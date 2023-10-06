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
        "eat": False,
        "day": True
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
        "day": True
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

SOLO_TYPES = [
    "art_gallery",
    "bakery",
    "bowling_alley",
    "cafe",
    "movie_theater",
    "museum",
    "park",
    "shopping_mall",
    "zoo"
]

COUPLE_TYPES = [
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
]

FAMILY_TYPES = [
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
]

FRIENDS_TYPES = [
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

MEAL_TIMES = [
        {"startTime":6, "endTime": 9},
        {"startTime":11, "endTime": 14},
        {"startTime":18, "endTime": 21},
]

TRAVEL_TIMES = {
    'walking':0.2,
    'public':0.075,
    'private':0.05
}

#========================================================================fetching functions


def refineResult(type_, results):    
    REQUIRE_KEYS = ['name', 'type', 'price_level', 'rating', 'user_ratings_total', 'geometry', 'place_id', 'plus_code', 'vicinity']

    #filter out not operating places
    # results = [result for result in results if result['business_status'] == 'OPERATIONAL']

    #filter out the rating smaller than 3
    
    results = [result for result in results if float(result['rating']) >= 3.0]
    
    results = list(map(lambda result: {**result, 'type': type_}, results))

    #remove unnecessary key value
    return list(map(lambda result: {key: value for key, value in result.items() if key in REQUIRE_KEYS}, results))


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


def getActivities(userInput):
    
    if userInput['template'] == "solo":
        random.shuffle(SOLO_TYPES)
        types = SOLO_TYPES[0:3]
    elif userInput['template'] == "couple":
        random.shuffle(COUPLE_TYPES)
        types = COUPLE_TYPES[0:3]
    elif userInput['template'] == "family":
        random.shuffle(FAMILY_TYPES)
        types = FAMILY_TYPES[0:3]
    elif userInput['template'] == "friends":
        random.shuffle(FRIENDS_TYPES)
        types = FRIENDS_TYPES[0:3]

    activites = []

    for type_ in types:
        activites += refineResult(type_, googleMapsApi.getPlaces(type_, userInput['location'], userInput['distance'], userInput['budget']))

    return activites


def getRestaurants(userInput):
    activites = googleMapsApi.getPlaces('restaurant', userInput['location'], userInput['distance'], userInput['budget'])

    return refineResult('restaurant', activites)


#========================================================================place selector functions


def getClosestPlace(userInput, currentLocation, places):
    closest = ''
    distance = float('inf')
    for place in places:
        newDistance = calculateDistance(currentLocation, place['geometry']['location'])
        if newDistance < distance:
            distance = newDistance
            closest = place

    return {'place':closest, 'travelTime':TRAVEL_TIMES[userInput['transportation']]*distance}


def getQualitativePlace(userInput, currentLocation, places):
    best = ''
    rating = 0
    for place in places:
        if rating < place['rating']:
            rating = place['rating']
            best = place
            
            if rating == 5.0:
                break

    travelTime = TRAVEL_TIMES[userInput['transportation']]*calculateDistance(currentLocation, best['geometry']['location'])
    
    return {'place':best, 'travelTime':travelTime}


# def getRandomPlace(userInput, places):
#     return places[random.randrange(0, len(places))]


#========================================================================generative algorithm


def generateRoute(userInput, nextPlaceSelector, places):
    
    lastMealTime = None
    activities = places['activities']
    restaurants = places['restaurants']
    currentLocation = userInput['location']
    currentTime = userInput['time']
    endTime = userInput['time'] + userInput['duration']
    route = []
    
    while currentTime < endTime:
        if (restaurants != None) and (4 <= currentTime - lastMealTime):
            if 0 != len(list(filter(lambda mealTime: mealTime['startTime'] < currentTime < mealTime['endTime'], MEAL_TIMES))):
                #select next place
                nextPlace = nextPlaceSelector(userInput, currentLocation, restaurants)

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
            nextPlace = nextPlaceSelector(userInput, currentLocation, activities)

            #place
            place = nextPlace['place']

            #travel time
            travelTime = nextPlace['travelTime']
            
            #remove the selected place
            activities = [activity for activity in activities if place['place_id'] != activity['place_id']]
            
            #calcualte time
            currentTime += TYPES[place['type']]["duration"]
        
        route.append({'type':'travelTime', 'travelTime':travelTime})

        #update new place to the route
        route.append(place)

        #update current location
        currentLocation = place['geometry']['location']

    return {'route':route, 'restPlaces':{'activities':activities, 'restaurants':restaurants} }


#generate initial population with route selectors
def generateFirstPopulation(userInput, populationNumber, places):
    routes = []
    placesC = places[:]
    placesQ = places[:]

    for _ in range(populationNumber):
        newRoute = generateRoute(userInput, getClosestPlace, placesC)
        routes.append(newRoute['route'])
        placesC = newRoute['restPlaces']

    for _ in range(populationNumber):
        newRoute = generateRoute(userInput, getQualitativePlace, placesQ)
        routes.append(newRoute['route'])
        placesC = newRoute['restPlaces']

    return routes
    

#todo: finish this function
#make the population double with some mutation
def generateNextPopulation(population, mutationRate):
    pass


#todo: finish this function
#O(log(n)/2) removing the worst route untill 50% left
# -travelTime, +diversity, +rating, +user_ratings_total*0.5, 
def removeBadPopulation(population):
    for _ in range(int(len(population)/2)):
        for route in population:
            travelTime = 0
            types = []
            rating = 0
            user_ratings_total = 0
            for place in route:
                if place['type'] == "travelTime":
                    travelTime += place['travelTime']
                else:
                    types.append(place['type'])
                    rating += float(place['rating'])
                    user_ratings_total += int(place['user_ratings_total'])


def runPopulation(userInput, places, intialPopulationNumber, generationNumber, mutationRate):
    
    population = generateFirstPopulation(userInput, intialPopulationNumber, places)
    for _ in generationNumber:
        population = generateNextPopulation(population, mutationRate)
        population = removeBadPopulation(population)
    
    return population







userInput = {
    'location': {'lat':-33.917663, 'lng':151.232869},
    'distance': 1000,
    'time': 5,
    'duration': 7,
    'transportation': 'public',
    'budget': 2,
    'template':'solo',
}
print(getActivities(template, location, distance, budget))