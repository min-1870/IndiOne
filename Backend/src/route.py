import os
import json
import requests
import random


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


NEARBYSEARCH_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"


def getApi():
    file_path = os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), 'api_key.txt')

    with open(file_path, 'r') as file:
        return file.read()

#fixme: need to change the request format as getPlaces function
def getRoutes(API, origin, destination):
    
    headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API,
        'X-Goog-FieldMask': 'routes.legs.steps.transitDetails'
    }

    data = {
        "origin": {
            "address": origin
        },
        "destination": {
            "address": destination
        },
        "travelMode": "TRANSIT",
        "computeAlternativeRoutes": True,
        "transitPreferences": {
            "routingPreference": "LESS_WALKING",
            "allowedTravelModes": ["TRAIN"]
        }
    }

    response = requests.post('https://routes.googleapis.com/directions/v2:computeRoutes', headers=headers, data=json.dumps(data))
    return response


def getPlaces(API, template, location, distance, budget):

    activities = []

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

    print(types)

    for i in types:
        params = {
            "location": location,
            "radius": distance,
            "maxprice": budget,
            "type": i,
            "key": API
        }

        response = requests.get(NEARBYSEARCH_URL, params=params)

        if response.status_code == 200:
            activities+=response.json().get("results", [])
        else:
            print(f"Error {response.status_code}: {response.text}")
        
    params = {
        "location": location,
        "radius": distance,
        "maxprice": budget,
        "type": 'restaurant',
        "key": API
    }

    response = requests.get(NEARBYSEARCH_URL, params=params)

    if response.status_code == 200:
        restaurantes=response.json().get("results", [])
    else:
        print(f"Error {response.status_code}: {response.text}")

    return {"restaurantes": restaurantes, "activities": activities}


def getShortestRoute():
    pass


def getQualitativeRoute():
    pass


def getNoMealRoute():
    pass


def getLocalSpecialtyRoute():
    pass


def getAllRoutes(location, distance, time, duration, transportation, budget, template):
    API = getApi()

    LOCATION = location
    DISTANCE = distance #maximum 5000(m)
    TIME = time
    DURATION = duration
    TRANSPORTATION = transportation
    BUDGET = budget #between 0(free) ~ 4(Expensive)
    TEMPLATE = template

    return{
        "shortest": getShortestRoute(),
        "qualitative": getQualitativeRoute(),
        "noMeal": getNoMealRoute(),
        "localSpecialty": getLocalSpecialtyRoute(),
    }



location = '-33.870396, 151.207030'
distance = '1000'
time = ''
duration = ''
transportation = ''
budget = '4'
template = 'solo'


# print(getPlaces(getApi(), template, location, distance, budget))

# print(getAllRoutes(location, distance, time, duration, transportation, budget, template))