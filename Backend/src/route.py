import random
import googleMapsApi
import math

TYPES = {
    "amusement_park": {
        "duration": 5,
        "eat": False,
        "day": True
    },
    "aquarium": {
        "duration": 2.5,
        "eat": False,
        "day": True
    },
    "art_gallery": {
        "duration": 1.5,
        "eat": False,
        "day": True
    },
    "bakery": {
        "duration": 0.75,
        "eat": True,
        "day": True
    },
    "bar": {
        "duration": 2.5,
        "eat": True,
        "day": False
    },
    "bowling_alley": {
        "duration": 1.5,
        "eat": False,
        "day": True
    },
    "cafe": {
        "duration": 1.5,
        "eat": True,
        "day": True
    },
    "casino": {
        "duration": 2.5,
        "eat": False,
        "day": False
    },
    "movie_theater": {
        "duration": 2.5,
        "eat": False
    },
    "museum": {
        "duration": 3,
        "eat": False,
        "day": True
    },
    "night_club": {
        "duration": 4,
        "eat": False,
        "day": False
    },
    "park": {
        "duration": 2,
        "eat": False,
    },
    "shopping_mall": {
        "duration": 3,
        "eat": False,
        "day": True
    },
    "zoo": {
        "duration": 4,
        "eat": False,
        "day": True
    },
    "tourist_attraction": {
        "duration": 2.5,
        "eat": False
    },
    "restaurant": {
        "duration": 1.5,
        "eat": True
    }
}

TEMPLATES = {
    "solo":[
        "art_gallery",
        "bakery",
        "bowling_alley",
        "cafe",
        "movie_theater",
        "museum",
        "park",
        "shopping_mall",
        "zoo"
    ],
    "couple":[
        "amusement_park",
        "aquarium",
        "art_gallery",
        "bar",
        "bakery",
        "movie_theater",
        "museum",
        "park",
        "shopping_mall",
        "zoo"
    ],
    "family":[
        "amusement_park",
        "aquarium",
        "art_gallery",
        "bakery",
        "cafe",
        "movie_theater",
        "museum",
        "park",
        "shopping_mall",
        "zoo"
    ],
    'friends':[
        "amusement_park",
        "aquarium",
        "art_gallery",
        "bar",
        "bowling_alley",
        "cafe",
        "casino",
        "movie_theater",
        "museum",
        "night_club",
        "park",
        "shopping_mall",
        "zoo"
    ]
}

MEAL_TIMES = [
        {"startTime":6, "endTime": 9},
        {"startTime":11, "endTime": 14},
        {"startTime":18, "endTime": 21},
]

#(1m/h)
TRAVEL_TIMES = {
    'walking':0.0002,
    'public':0.000075,
    'private':0.00005
}

#(m)
MAXIMUM_DISTANCE = {
    'walking':833, #5min
    'public':2222, #10min
    'private':5000 #15min
}


NIGHT_TIME = 18

MEAL_INTERVAL_TIME = 4

MUTATION = 200

DUPLICATE_TYPES_WEIGHT = 2

#========================================================================fetching functions


def refineResult(type_, results):    
    # REQUIRE_KEYS = ['name', 'type', 'price_level', 'rating', 'user_ratings_total', 'geometry', 'place_id', 'plus_code', 'vicinity']
    REQUIRE_KEYS = ['name', 'type', 'price_level', 'rating', 'user_ratings_total', 'geometry', 'place_id']

    #filter out not operating places
    # results = [result for result in results if result['business_status'] == 'OPERATIONAL']

    #filter out the rating smaller than 3
    
    results = [result for result in results if float(result['rating']) >= 3.0]
    
    results = list(map(lambda result: {**result, 'type': type_}, results))

    #remove unnecessary key value
    return list(map(lambda result: {key: value for key, value in result.items() if key in REQUIRE_KEYS}, results))


def calculateDistance(location1, location2):
    lat1_rad = math.radians(float(location1['lat']))
    lon1_rad = math.radians(float(location1['lng']))
    lat2_rad = math.radians(float(location2['lat']))
    lon2_rad = math.radians(float(location2['lng']))

    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    distance = 6371 * c

    return distance * 1000


def getActivities(userInput):
    types = TEMPLATES[userInput['template']]
    # random.shuffle(types)

    activites = []

    for type_ in types:#[0:int(len(types)/1.5)]
        activites += refineResult(type_, googleMapsApi.getPlaces(type_, userInput['location'], userInput['distance'], userInput['budget']))
    
    return activites


def getRestaurants(userInput):
    activites = googleMapsApi.getPlaces('restaurant', userInput['location'], userInput['distance'], userInput['budget'])

    return refineResult('restaurant', activites)


#======================================================================== selector 


def getNextPlace(userInput, route, currentTime, places):
    
    score = 0
    result = None
    MAX = MAXIMUM_DISTANCE[userInput['transportation']]
    
    def validation(place, distance):
        
        if distance > MAX:
            
            return False

        if 'price_level' in place.keys():
            if int(userInput['budget']) < int(place['price_level']):
                
                return False
            
        if len(route) != 0:
            if place['type'] == route[-1]['type']:
                return False
        
        if 'day' in TYPES[place['type']].keys():
            if NIGHT_TIME < currentTime:
                if TYPES[place['type']]['day']:
                    return False
            else:
                if not TYPES[place['type']]['day']:
                    return False

        return True

    for place in places:
        if len(route) == 0:
            distance = calculateDistance(userInput['location'], place['geometry']['location'])
        else:
            distance = calculateDistance(route[-1]['geometry']['location'], place['geometry']['location'])
        
        if validation(place, distance):

            #score

            distanceS = 100-distance/MAX*100
            
            ratingS = float(place['rating'])/5*100
            
            user_ratings_totalS = min(100, int(place['user_ratings_total']))
            
            typesS = max(1, DUPLICATE_TYPES_WEIGHT*[place['type'] for place in route if place['type'] != 'restaurants'].count(place['type']))
            
            newScore = (ratingS + user_ratings_totalS + distanceS + random.randint(-1*MUTATION,MUTATION))/typesS
            
            if newScore > score:
                score = newScore
                result = place

    if result == None : 
        print("Cannot find any suitable next place.")
        return False   
    
    # print(result['name']+'======'+str(int(score)) )
    # print("distance:",distanceS)
    # print("rating:",ratingS)
    # print("URT:",user_ratings_totalS)
    # print("types",typesS)
    return {'place':result, 'travelTime':TRAVEL_TIMES[userInput['transportation']]*distance}


#======================================================================== algorithm


def generateRoute(userInput, places):
    
    lastMealTime = 0
    activities = places['activities']
    restaurants = places['restaurants']
    currentTime = float(userInput['time'])
    endTime = float(userInput['time']) + float(userInput['duration'])
    route = []
    
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
                
                return False
            
            #place
            place = nextPlace['place']

            #travel time
            travelTime = nextPlace['travelTime']
                
            #remove the selected place
            restaurants = [restaurant for restaurant in restaurants if place['place_id'] != restaurant['place_id']]
                
            #calculate time
            currentTime += TYPES[place['type']]["duration"]
            currentTime += travelTime
            lastMealTime = currentTime                

        else:
            #select next place
            nextPlace = getNextPlace(userInput, route, currentTime, activities)
            if nextPlace == False:
                
                return False
            

            #place
            place = nextPlace['place']

            #travel time
            travelTime = nextPlace['travelTime']
            
            #remove the selected place
            activities = [activity for activity in activities if place['place_id'] != activity['place_id']]
            
            #calcualte time
            currentTime += TYPES[place['type']]["duration"]
            currentTime += travelTime
        

        #update travelTime
        route.append({'type':'travelTime', 'travelTime':travelTime})

        #update new place to the route
        route.append(place)
    
    return route
    # return {'route':route, 'unselectedPlaces':{'activities':activities, 'restaurants':restaurants} }


def categorizeRoutes(routes):
    pass


def evaluateRoute(route):
    pass


def feasibilityRoute(route):
    pass


def generateRoutes(userInput):
    pass


sydney = {'lat':"-33.867298", 'lng':"151.209154"}
hcmc  = {'lat':"10.777981", 'lng':"106.694449"}
userInput = {
    'location': sydney,
    'distance': "1000",
    'time': "14",
    'duration': "8",
    'transportation': 'public',
    'budget': "2",
    'template':'friends',
}
places = {
    'activities': getActivities(userInput),
    'restaurants': getRestaurants(userInput)
}


routes = []
for _ in range(1000):
    newCase = generateRoute(userInput, places)
    if newCase != False:
        if not (newCase in routes):
            routes.append(newCase)  
        # print("\n-------------------------------------------\n")
        # for place in routes[-1]:
        #     if place['type'] == 'travelTime':
        #         print("             Travel "+str(place['travelTime'])+"hrs")
        #     else:
        #         print(place['type'], place['rating'], ' - ', place['name'])
print(len(routes))