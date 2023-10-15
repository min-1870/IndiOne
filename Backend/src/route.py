import random
import googleMapsApi
import math
import copy
from datetime import datetime
import read



TYPES = read.DEFAULT_VALUES["place"]["types"]
TEMPLATES = read.DEFAULT_VALUES["place"]["templates"]
MEAL_TIMES = read.DEFAULT_VALUES["time"]["meal"]
TRAVEL_TIMES = read.DEFAULT_VALUES["time"]["speed"] #(1m/h)
MAXIMUM_DISTANCE = read.DEFAULT_VALUES["time"]["maximum"] #(m)
NIGHT_TIME = read.DEFAULT_VALUES["time"]["night"]
MEAL_INTERVAL_TIME = read.DEFAULT_VALUES["time"]["mealInterval"]
MUTATION = read.DEFAULT_VALUES["algorithm"]["mutation"]
DUPLICATE_TYPES_WEIGHT = read.DEFAULT_VALUES["algorithm"]["duplicateTypesWeight"]
database = {}



#========================================================================fetching functions


def getActivities(userInput):
    types = TEMPLATES[userInput['template']]
    # random.shuffle(types)

    activites = []

    for type_ in types:#[0:int(len(types)/1.5)]
        activites += refinePlaceResults(type_, userInput, googleMapsApi.getPlaces(type_, userInput['location'], userInput['distance'], userInput['budget']))
    
    return activites


def getRestaurants(userInput):
    activites = googleMapsApi.getPlaces('restaurant', userInput['location'], userInput['distance'], userInput['budget'])

    return refinePlaceResults('restaurant', userInput, activites)




#========================================================================utility functions


def refinePlaceResults(type_, userInput, results):    
    REQUIRE_KEYS = ['name', 'type', 'price_level', 'rating', 'user_ratings_total', 'place_id', 'geometry']
    
    # results = [result for result in results if result['business_status'] == 'OPERATIONAL']

    def validation(result):

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
        
            
        return True

    newResults = []
    for result in results:
        if validation(result):
            newResults.append(result)                    
    results = newResults
    
    results = list(map(lambda result: {**result, 'type': type_}, results))

    #remove unnecessary key value
    return list(map(lambda result: {key: value for key, value in result.items() if key in REQUIRE_KEYS}, results))


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




#======================================================================== route funcitons


def getNextPlace(userInput, route, currentTime, places):
    
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
        
        if distance > MAX:
            
            return False
            
        if len(route) != 0:
            if place['type'] == route[-1]['type']:
                return False


        if NIGHT_TIME < currentTime:
            if TYPES[place['type']]['time'] == 'day':
                return False
        else:
            if TYPES[place['type']]['time'] == 'night':
                return False

        return True

    for place in places:
        if len(route) == 0:
            distance = calculateDistance(userInput['location'], place['geometry']['location'])
        else:
            distance = calculateDistance(route[-1]['geometry']['location'], place['geometry']['location'])
        
        if validation(place, distance):

            #Calcualte Score

            distanceScore = 100-distance/MAX*100
            
            ratingScore = float(place['rating'])/5*100
            
            user_ratings_totalScore = min(100, int(place['user_ratings_total']))
            
            typesScore = max(1, DUPLICATE_TYPES_WEIGHT*[place['type'] for place in route if place['type'] != 'restaurants'].count(place['type']))
            
            randomScore = random.randint(-1*MUTATION,MUTATION)

            newTotalScore = (ratingScore + user_ratings_totalScore + distanceScore + randomScore)/typesScore
            
            if newTotalScore > score['total']:
                score = {
                    'total': newTotalScore,
                    'distance': distanceScore,
                    'rating': ratingScore,
                    'user_ratings_total': user_ratings_totalScore,
                }
                result = place

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


def generateRoute(userInput, places):
    
    lastMealTime = 0
    activities = places['activities']
    restaurants = places['restaurants']
    currentTime = userInput['time']
    endTime = userInput['time'] + userInput['duration']
    route = []
    
    score = {
        'total': [],
        'distance': [],
        'rating': [],
        'user_ratings_total': []
    }

    def checkMealTime():
        if (restaurants != None) and (MEAL_INTERVAL_TIME <= currentTime - lastMealTime):
            if 0 != len(list(filter(lambda mealTime: mealTime['startTime'] < currentTime < mealTime['endTime'], MEAL_TIMES))):
                return True
        return False
    
    while currentTime < endTime:
        if checkMealTime():
            #select next place
            nextPlace = getNextPlace(userInput, route, currentTime, restaurants)
            if nextPlace == False:
                print('generateRoute: No place was fetched.')
                return False
            
            #place
            place = nextPlace['place']
                
            #remove the selected place
            restaurants = [restaurant for restaurant in restaurants if place['place_id'] != restaurant['place_id']]
                
            #calculate meal time
            lastMealTime = place['endTime']               

        else:
            #select next place
            nextPlace = getNextPlace(userInput, route, currentTime, activities)
            if nextPlace == False:
                print('generateRoute: No place was fetched.')
                return False

            #place
            place = nextPlace['place']
            
            #remove the selected place
            activities = [activity for activity in activities if place['place_id'] != activity['place_id']]

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
        score[key] = sum(score[key]) / len(score[key]) + typeBonus

    
    return {'score': score, 'route': route}
    # return {'route':route, 'unselectedPlaces':{'activities':activities, 'restaurants':restaurants} }




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
            categorizedRoutes[key] = sorted(categorizedRoutes[key], reverse=True, key=lambda route: route['score']['distance'])
            
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


def feasibilityRoute(route):
    
    
    for place in route:
        if place['type'] != 'travel':
            if place['place_id'] in database:
                schedule = database[place['place_id']]
                if schedule != False:
                    if not (place['startTime'] > schedule['startTime'] and place['endTime'] < schedule['endTime']):
                        
                        return False
            else:
                schedule = refineDetailResult(googleMapsApi.getPlaceDetails(place['place_id']))
                
                if schedule != False:
                    database[place['place_id']] = copy.deepcopy(schedule)
                    if not (place['startTime'] > schedule['startTime'] and place['endTime'] < schedule['endTime']):
                        
                        return False
                else:
                    database[place['place_id']] = False
    return True


def generateRoutes(userInput):
    userInput['location']['lat'] = float(userInput['location']['lat'])
    userInput['location']['lng'] = float(userInput['location']['lng'])
    userInput['distance'] = float(userInput['distance'])
    userInput['time'] = int(userInput['time'])
    userInput['duration'] = int(userInput['duration'])
    userInput['budget'] = float(userInput['budget'])
    

    places = {
        'activities': None,
        'restaurants': None
    }

    # def checkIncludeMeal():
    #     for time in range(userInput['time'], userInput['time']+userInput['duration']):
    #         for timeRange in MEAL_TIMES:
    #             if timeRange['startTime'] < time < timeRange['endTime']:
    #                 return True
    #     return False
    
    places['activities'] = getActivities(userInput)

    # if checkIncludeMeal():
    places['restaurants'] = getRestaurants(userInput)      

    

    routes = []
    for i in range(1000):
        newCase = generateRoute(userInput, places)
        if newCase != False: routes.append(newCase)
    
    categorizedRoutes = categorizeRoutes(routes)

    passedCategories = []
    for i in range(len(routes)):
        if i % 10 == 0: print(i)
        for key in categorizedRoutes:
            if not key in passedCategories:
                if feasibilityRoute(categorizedRoutes[key][i]['route']):
                    categorizedRoutes[key] = categorizedRoutes[key][i]['route']
                    passedCategories.append(key)
                    print('success '+key)
        if len(passedCategories) == len(categorizedRoutes.keys()):
            break

    # for key in categorizedRoutes.keys():
    #     print(key)
    #     for route in categorizedRoutes[key]:
    #         c += 1
    #         if c%10 == 0: print(c)
    #         if feasibilityRoute(route['route']):
    #             categorizedRoutes[key] = route['route']
    #             break
    print('---------------------------------')
    print(len(database))
    return categorizedRoutes



qvb = {'lat':'-33.871506', 'lng':'151.206982'}
sydney = {'lat':'-33.867298', 'lng':'151.209154'}
hcmc  = {'lat':"10.777981", 'lng':"106.694449"}
userInput = {
    'location': sydney,
    'distance': "1000",
    'time': "12",
    'duration': "8",
    'transportation': 'public',
    'budget': "2",
    'template':'friends',
}



categorizedRoute = generateRoutes(userInput)
for key in categorizedRoute.keys():
        print("\n------------------------------------------"+key+"\n")
        for place in categorizedRoute[key]:
            if len(place) != 0:
                if place['type'] == 'travel':
                    print("     ->      Leave at "+str(place['startTime']))
                    
                    print("     <-      Arrive at "+str(place['endTime']))
                else:
                    print(place['type'], place['rating'], place['place_id'], ' - ', place['name'])