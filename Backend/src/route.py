import random
import googleMapsApi
import math
import json
import copy
from datetime import datetime, timedelta
import database
from bson.objectid import ObjectId



TYPES = database.DEFAULT_VALUES["place"]["types"]
TEMPLATES = database.DEFAULT_VALUES["place"]["templates"]
MEAL_TIMES = database.DEFAULT_VALUES["time"]["meal"]
TRAVEL_TIMES = database.DEFAULT_VALUES["time"]["speed"] #(1m/h)
MAXIMUM_DISTANCE = database.DEFAULT_VALUES["time"]["maximum"] #(m)
NIGHT_TIME = database.DEFAULT_VALUES["time"]["night"]
MEAL_INTERVAL_TIME = database.DEFAULT_VALUES["time"]["mealInterval"]
MUTATION = database.DEFAULT_VALUES["algorithm"]["mutation"]
DUPLICATE_TYPES_WEIGHT = database.DEFAULT_VALUES["algorithm"]["duplicateTypesWeight"]



#========================================================================fetching functions


def getPlaces(userInput):
    types = TEMPLATES[userInput['template']]
    # random.shuffle(types)

    places = {}

     
    for type_ in types:
        results = googleMapsApi.getPlaces(type_, userInput['location'], userInput['distance'], userInput['budget'])
        
        for result in results:
            refinedResult = refinePlaceResult(type_, userInput, result)

            if refinedResult != False:
                places[refinedResult["place_id"]] = refinedResult["place"]
    
    if len(places.keys()) == 0:
        print("getPlaces: No places were fetched from API")
        return False

    return places



#========================================================================utility functions


def refinePlaceResult(type_, userInput, result):    
    REQUIRE_KEYS = ['name', 'type', 'price_level', 'rating', "place_id", 'user_ratings_total', 'geometry']

    #rating must be over 3.0
    if 'rating' in result.keys():
        if float(result['rating']) <= 3.0:
            return False
    else:
        return False
        
    #filter out unrelated types
    if 'travel_agency' in result['types']:
        return False

    #remove place based on budget
    if 'price_level' in result.keys():
        if int(userInput['budget']) < int(result['price_level']):
            return False
    
    #insert the main type
    result['type'] = type_

    #remove unnecessary KVs
    result = {key: value for key, value in result.items() if key in REQUIRE_KEYS}

    return {"place_id": result["place_id"], "place": result}


def refineDetailResult(result):
    currentOpeningHours = None
    openingHours = None
    endTime = None
    startTime = None
    
    def convertTimeFormat(time):
        hour = int(time[:2])
        minute = int(time[2:])/60

        return hour + minute

    dayOfWeek = datetime.now().weekday()
    if dayOfWeek == 6: 
        dayOfWeek = 0
    else:
        dayOfWeek += 1

    if 'current_opening_hours' in result:
        currentOpeningHours = result['current_opening_hours']['periods'] #today ~ 7days
    if 'opening_hours' in result:
        openingHours = result['opening_hours']['periods'] #regular schedule
    
    if currentOpeningHours == None and openingHours == None:
        return False
    
    elif currentOpeningHours != None and openingHours == None:
        if not 'close' in currentOpeningHours[0]:
            return False
        
    elif currentOpeningHours == None and openingHours != None:
        check = False
        for schedule in openingHours:
            if 'close' in schedule:
                if schedule['close']['day'] == dayOfWeek:
                    check = True
                    break
        if not check: return False
        
    else:
        if currentOpeningHours != None:
            startTime = currentOpeningHours[0]['open']['time']
            endTime = currentOpeningHours[0]['close']['time']
        
        else:
            for schedule in openingHours:
                if 'close' in schedule:
                    if schedule['close']['day'] == dayOfWeek:
                        startTime = schedule['open']['time']
                        endTime = schedule['close']['time']
                        break

    startTime = convertTimeFormat(startTime)
    endTime = convertTimeFormat(endTime)

    return {'startTime': startTime, 'endTime': endTime}


def calculateDistance(location1, location2):
    lat1_rad = math.radians(location1['lat'])
    lon1_rad = math.radians(location1['lng'])
    lat2_rad = math.radians(location2['lat'])
    lon2_rad = math.radians(location2['lng'])

    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    distance = 6371 * c

    return distance * 1000


def converUserInputTypes(userInput):
    userInput['location']['lat'] = float(userInput['location']['lat'])
    userInput['location']['lng'] = float(userInput['location']['lng'])
    userInput['distance'] = float(userInput['distance'])
    userInput['time'] = int(userInput['time'])
    userInput['duration'] = int(userInput['duration'])
    userInput['budget'] = float(userInput['budget'])

    if "desireTime" in userInput.keys():
        userInput['desireTime'] = float(userInput['desireTime'])

    return userInput


#======================================================================== route funcitons


def getNextPlace(userInput, route, currentTime, places, requireTypes, avoidTypes):
    
    MAX = MAXIMUM_DISTANCE[userInput['transportation']]
    result = None
    
    score = {
        'total':0,
        'distance': None,
        'rating': None,
        'user_ratings_total': None
    }
    travel = {
        "type": "travel",
        "startTime": currentTime,
        "timeSpent": None,
        "endTime": None
    }
    
    def validation(place, distance):

        #Check whether the type of the place is require type
        if (not place['type'] in requireTypes) and 0 != len(requireTypes):
            return False
        
        #Check whether the type of the place is avoiding type
        if (place['type'] in avoidTypes) and 0 != len(avoidTypes):
            return False
        
        #Check the opening time
        if 'schedule' in place.keys():
            if place['schedule'] != False:
                schedule = place['schedule']
                if not (place['startTime'] > schedule['startTime'] and place['endTime'] < schedule['endTime']):
                    return False

        #Check whether the place is already in the route
        if place['place_id'] in [place['place_id'] for place in route if place['type'] != 'travel']: 
            return False

        #Check whether the place is far
        if distance > MAX:            
            return False

        #Check whether the place is same type with the previous place
        if len(route) != 0:
            if place['type'] == route[-1]['type']:                
                return False

        #Check whether the place is for the right moment of the day
        if NIGHT_TIME < currentTime:
            if TYPES[place['type']]['time'] == 'day':                
                return False
        else:
            if TYPES[place['type']]['time'] == 'night':                
                return False

        return True

    for key in places:

        if key == '_id':
            continue
        
        if len(route) == 0:
            distance = calculateDistance(userInput['location'], places[key]['geometry']['location'])
        else:
            distance = calculateDistance(route[-1]['geometry']['location'], places[key]['geometry']['location'])
        
        if validation(places[key], distance):

            #Calcualte Score

            distanceScore = 100-distance/MAX*100
            
            ratingScore = float(places[key]['rating'])/5*100
            
            user_ratings_totalScore = min(100, int(places[key]['user_ratings_total']))
            
            typesScore = max(1, DUPLICATE_TYPES_WEIGHT*[place['type'] for place in route if place['type'] != 'restaurants'].count(places[key]['type']))
            
            randomScore = random.randint(-1*MUTATION,MUTATION)

            newTotalScore = (ratingScore + user_ratings_totalScore + distanceScore + randomScore)/typesScore
            
            if newTotalScore > score['total']:
                score = {
                    'total': newTotalScore,
                    'distance': distance,
                    'rating': ratingScore,
                    'user_ratings_total': user_ratings_totalScore,
                }
                result = places[key]

    if result == None : 
        print("getNextPlace: Cannot find any suitable next place.")
        return False   
    
    #Save score without random bonus
    score['total'] = (ratingScore + user_ratings_totalScore + distanceScore)/typesScore

    #Travel Time
    travel['timeSpent'] = TRAVEL_TIMES[userInput['transportation']]*distance
    travel['endTime'] = travel['startTime'] +  travel['timeSpent']

    #Place Time
    result['startTime'] = currentTime + travel['timeSpent']
    result['timeSpent'] = TYPES[result['type']]["duration"]
    result['endTime'] = result['startTime'] + result['timeSpent']

    return {'travel':travel, 'place':result, 'score': score}


def generateRoute(userInput, places, oldRoute=[]):
    
    route = copy.deepcopy(oldRoute)
    lastMealTime = 0
    currentTime = userInput['time']
    endTime = userInput['time'] + userInput['duration']
    
    if len(route) != 0:
        #update last meal time
        for place in route:
            if place['type'] == 'restaurant':
                lastMealTime = place['endTime']
    
    score = {
        'total': [],
        'distance': [],
        'rating': [],
        'user_ratings_total': []
    }

    def checkMealTime():
        if MEAL_INTERVAL_TIME <= currentTime - lastMealTime:
            if 0 != len(list(filter(lambda mealTime: mealTime['startTime'] < currentTime < mealTime['endTime'], MEAL_TIMES))):
                return True
        return False
    
    while currentTime < endTime:
        if checkMealTime():
            #select next place
            nextPlace = getNextPlace(userInput, route, currentTime, places, ["restaurant"], [])
            if nextPlace == False:
                print('generateRoute: No place was fetched.')
                return False
                
            #calculate meal time
            lastMealTime = nextPlace['place']['endTime']               

        else:
            #select next place
            nextPlace = getNextPlace(userInput, route, currentTime, places, [], ["restaurant"])
            if nextPlace == False:
                print('generateRoute: No place was fetched.')
                return False

        #place
        place = nextPlace['place']

        #Insert travel
        travel = nextPlace['travel']

        #Update Scores
        for key in score.keys():
            score[key].append(nextPlace['score'][key])

        #update time
        currentTime = place['endTime']     
        
        #update Travel
        route.append(travel)

        #update new place to the route
        route.append(place)

    #Calculate Scores AVG * TYPES
    typeBonus = len(set([place['type'] for place in route]))/20 * 100
    for key in score.keys():
        if key == "distance":
            score[key] = sum(score[key])
        else:
            score[key] = sum(score[key]) / len(score[key]) + typeBonus
    return {'score': score, 'route': route}



#======================================================================== algorithm


def categorizeRoutes(routes):
    categorizedRoutes = {
        'casual': copy.deepcopy(routes), #sort by total
        'shortest': copy.deepcopy(routes), #sort by distance
        'qualitative': copy.deepcopy(routes), #sort by rating
        'local_specialty': copy.deepcopy(routes) #sort by total among the route with local_specialty
    }

    for key in categorizedRoutes.keys():
        if key == 'casual':
            categorizedRoutes[key] = sorted(categorizedRoutes[key], reverse=True, key=lambda route: route['score']['total'])
            
        elif key == 'shortest':
            categorizedRoutes[key] = sorted(categorizedRoutes[key], reverse=False, key=lambda route: route['score']['distance'])
            
        elif key == 'qualitative':
            categorizedRoutes[key] = sorted(categorizedRoutes[key], reverse=True, key=lambda route: route['score']['rating'])
            
        elif key == 'local_specialty':
            LSroutes = []
            
            for route in routes:
                local_specialty = False

                for place in route['route']:
                    if place['type'] == 'tourist_attraction':
                        local_specialty = True
                        break

                if local_specialty:
                    LSroutes.append(route)
                
            
            categorizedRoutes[key] = sorted(LSroutes, reverse=True, key=lambda route: route['score']['total'])

    return categorizedRoutes


def feasibilityRoute(route, places):
    
    
    for place in route:
        if place['type'] != 'travel':
            if "schedule" in places[place['place_id']]:
                schedule = places[place['place_id']]['schedule']
                if schedule != False:
                    if not (place['startTime'] > schedule['startTime'] and place['endTime'] < schedule['endTime']):
                        
                        return False
            else:
                schedule = refineDetailResult(googleMapsApi.getPlaceDetails(place['place_id']))
                
                if schedule != False:
                    places[place['place_id']]['schedule'] = copy.deepcopy(schedule)
                    if not (place['startTime'] > schedule['startTime'] and place['endTime'] < schedule['endTime']):
                        
                        return False
                else:
                    places[place['place_id']]['schedule'] = False
    return True


def generateRoutes(userInput):
    #Convert type of input
    converUserInputTypes(userInput)
    
    #Fetch places
    places = getPlaces(userInput)
    if places == False:
        print("generateRoutes: No places were fetched from getPlaces.")
        return False

    #Generate 500 routes
    routes = []
    for i in range(500):
        newCase = generateRoute(userInput, places)
        if newCase != False: routes.append(newCase)

    if len(routes) == 0:
        print('generateRoutes: Fail to generate any route.')
        return False

    #Sort the routes based on each theme   
    categorizedRoutes = categorizeRoutes(routes)

    #Check the feasibility of the routes
    passedCategories = []
    for i in range(len(routes)):
        if i % 10 == 0: print(i)
        for key in categorizedRoutes:
            if not key in passedCategories:
                if feasibilityRoute(categorizedRoutes[key][i]['route'], places):
                    categorizedRoutes[key] = categorizedRoutes[key][i]['route']
                    passedCategories.append(key)
                    print('success '+key)
        if len(passedCategories) == len(categorizedRoutes.keys()):
            break
    
    if len(passedCategories) != len(categorizedRoutes.keys()):
        return False

    #Save the places into db
    try:
        id_ = database.PLACES_COLLECTION.insert_one(places).inserted_id
    except:
        print("generateRoutes: Fail to save place into database.")
        id_ = 'none'

    return {"categorizedRoutes": categorizedRoutes, "id": str(id_)}


def regenerateRoutes(userInput):
    #Convert type of input
    converUserInputTypes(userInput)
    route = userInput['route']

    #update the startTime and duration
    #testing
    # oldTime = userInput['time']
    # currentTime = 17
    if 'desireTime' in userInput.keys():
        userInput['duration'] = userInput['duration'] - (userInput['desireTime'] - userInput['time'])
        userInput['time'] = userInput['desireTime']
        currentTime = userInput['time']

    else:
        timeZone = googleMapsApi.getTimeZone(userInput["location"])
        currentUtcTime = datetime.utcnow()
        secondsToAdd = timeZone['dstOffset'] + timeZone['rawOffset']  
        timeDelta = timedelta(seconds=secondsToAdd)
        currentLocalTime = currentUtcTime + timeDelta
        hours, minute = map(int, currentLocalTime.strftime('%H:%M').split(':'))
        
        oldTime = userInput['time']
        currentTime = hours + minute/60

        if currentTime > oldTime + userInput['duration'] or currentTime < oldTime:
            return False
        
        userInput['time'] = currentTime
        userInput['duration'] = userInput['duration'] - (currentTime - oldTime)

    #upate location as last place
    
    for i in range(len(route)):
        place = route[i]
        if place['startTime'] < currentTime and place['endTime'] > currentTime:
            if i == 0:
                print('regenrateRoutes: No need to update the route.')
                return False
            elif place['type'] == "travel":
                # userInput["location"] = route[-1]['geometry']['location']
                route[-1]['endTime'] = currentTime
                route[-1]['timeSpent'] = route[-1]['endTime'] - route[-1]['startTime']
                route = route[:i]
                break
            else:
                if i == len(route):
                    print('regenrateRoutes: The route is already finished.')
                    return False
                # userInput["location"] = place['geometry']['location']
                place['endTime'] = currentTime
                place['timeSpent'] = place['endTime'] - place['startTime']
                route = route[:i+1]
                break

    #Load places from DB
    try: 
        places = database.PLACES_COLLECTION.find_one({"_id": ObjectId(userInput['id'])})
    except:
        print("generateRoutes: Fail to load places from database.")
        places = getPlaces(userInput)


    #generate 500 new route for rest of the route
    routes = []
    for _ in range(500):
        newRoute = generateRoute(userInput, places, route)
        if newRoute != False:
            routes.append(newRoute)
    
    #sort the routes
    categorizedRoutes = categorizeRoutes(routes)

    #Check the feasibility of the routes
    passedCategories = []
    for i in range(len(routes)):
        if i % 10 == 0: print(i)
        for key in categorizedRoutes:
            
            if key in passedCategories:
                continue

            if i >= len(categorizedRoutes[key]):
                continue

            if feasibilityRoute(categorizedRoutes[key][i]['route'], places):
                categorizedRoutes[key] = categorizedRoutes[key][i]['route']
                passedCategories.append(key)
                print('success '+key)
        if len(passedCategories) == len(categorizedRoutes.keys()):
            break   
    
    if len(passedCategories) != len(categorizedRoutes.keys()):
        return False
    
    #Update db
    try:
        database.PLACES_COLLECTION.replace_one({"_id": ObjectId(userInput['id'])}, places)
    except:
        print("generateRoutes: Fail to save place into database.")

    #return new route
    return {"categorizedRoutes": categorizedRoutes, "id": userInput['id']}


qvb = {'lat':'-33.871506', 'lng':'151.206982'}
sydney = {'lat':'-33.867298', 'lng':'151.209154'}
hcmc  = {'lat':"10.777981", 'lng':"106.694449"}
userInput = {
    'location': sydney,
    'distance': "1000",
    'time': "12",
    'duration': "10",
    'transportation': 'public',
    'budget': "2",
    'template':'friends',
}

# testing backend generating route api ==========================================

# categorizedRoutes = generateRoutes(userInput)

# if categorizedRoutes != False:


#     with open("sample_route.json", "w") as json_file:
#         json.dump(categorizedRoutes['categorizedRoutes']['casual'], json_file)
#     print(categorizedRoutes['id'])

#     for key in categorizedRoutes['categorizedRoutes'].keys():
#             print("\n------------------------------------------"+key+"\n")
#             for place in categorizedRoutes['categorizedRoutes'][key]:
#                 if len(place) != 0:
#                     if place['type'] == 'travel':
#                         print("     ->      Leave at "+str(place['startTime']))
                        
#                         print("     <-      Arrive at "+str(place['endTime']))
#                     else:
#                         print(place['type'], place['rating'], place['place_id'], ' - ', place['name'])
# else:
#     print('nothing to return')


# testing backend updating route api ==========================================


#652d3f6c6049fe789974d5b6
# with open(database.directory('sample_route.json'), 'r') as f:
#     userInput = json.load(f)

# categorizedRoutes = regenerateRoutes(userInput)

# if categorizedRoutes != False:


#     with open("sample_route.json", "w") as json_file:
#         json.dump(categorizedRoutes['categorizedRoutes']['casual'], json_file)
#     print(categorizedRoutes['id'])

#     for key in categorizedRoutes['categorizedRoutes'].keys():
#             print("\n------------------------------------------"+key+"\n")
#             for place in categorizedRoutes['categorizedRoutes'][key]:
#                 if len(place) != 0:
#                     if place['type'] == 'travel':
#                         print("     ->      Leave at "+str(place['startTime']))
                        
#                         print("     <-      Arrive at "+str(place['endTime']))
#                     else:
#                         print(place['type'], place['rating'], place['place_id'], ' - ', place['name'])
# else:
#     print('nothing to return')