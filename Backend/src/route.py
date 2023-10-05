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


def getActivities(template, location, distance, budget):
    if template == "solo":
        random.shuffle(SOLO_TYPES)
        types = SOLO_TYPES[0:3]
    elif template == "couple":
        random.shuffle(COUPLE_TYPES)
        types = COUPLE_TYPES[0:3]
    elif template == "family":
        random.shuffle(FAMILY_TYPES)
        types = FAMILY_TYPES[0:3]
    elif template == "friends":
        random.shuffle(FRIENDS_TYPES)
        types = FRIENDS_TYPES[0:3]

    activites = []

    for type_ in types:
        activites += refineResult(type_, googleMapsApi.getPlaces(type_, location, distance, budget))

    return activites


def getRestaurants(location, distance, budget):
    activites = googleMapsApi.getPlaces('restaurant', location, distance, budget)

    return refineResult('restaurant', activites)


#========================================================================place selector functions


def getClosestPlace(location, places):
    pass

def getQualitativePlace(location, places):
    pass

def getRandomPlace(location, places):
    pass


#========================================================================generative algorithm


def generateRoute(startTime, endTime, location, activities, nextPlaceSelector, restaurants=None):
    
    lastMealTime = None
    currentLocation = location
    currentTime = startTime
    route = []
    
    while currentTime < endTime:
        if (restaurants != None) and (4 <= currentTime - lastMealTime):
            if 0 != len(list(filter(lambda mealTime: mealTime['startTime'] < currentTime < mealTime['endTime'], MEAL_TIMES))):
                #select next place
                nextPlace = nextPlaceSelector(currentLocation, restaurants)
                
                #remove the selected place
                restaurants = [restaurant for restaurant in restaurants if nextPlace['place_id'] != restaurant['place_id']]
                
                #calculate time
                currentTime += TYPES[nextPlace['type']]["duration"]
                lastMealTime = currentTime
                

        else:
            #select next place
            nextPlace = nextPlaceSelector(currentLocation, activities)
            
            #remove the selected place
            activities = [activity for activity in activities if nextPlace['place_id'] != activity['place_id']]
            
            #calcualte time
            currentTime += TYPES[nextPlace['type']]["duration"]
        
        #update new place to the route
        route.append(nextPlace)

        #update current location
        currentLocation = nextPlace['geometry']['location']


#generate initial population with route selectors
def generateFirstPopulation(populationNumber):
    pass

#O(log(n)/2) removing the worst route untill 50% left
def removeBadPopulation(population):
    pass

#make the population double with some mutation
def generateNextPopulation(population, mutationRate):
    pass

def runPopulation(intialPopulationNumber, generationNumber, mutationRate):
    
    population = generateFirstPopulation(intialPopulationNumber)
    for _ in generationNumber:
        population = generateNextPopulation(population, mutationRate)
        population = removeBadPopulation(population)
    
    return population





location = '-33.917663, 151.232869'
distance = '1000'
time = ''
duration = ''
transportation = ''
budget = '2'
template = 'solo'
print(getActivities(template, location, distance, budget))