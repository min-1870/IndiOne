import os
import json
import requests

NEARBYSEARCH_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"

file_path = os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), 'api_key.txt')

with open(file_path, 'r') as file:
    API = file.read()

#fixme: need to change the request format as getPlaces function
def getRoutes(origin, destination):
    
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


def getPlaces(type_, location, distance, budget):

    params = {
        "location": str(location['lat'])+', '+str(location['lng']),
        "radius": distance,
        "maxprice": budget,
        "type": type_,
        "key": API 
    }

    response = requests.get(NEARBYSEARCH_URL, params=params)

    if response.status_code == 200:
        return response.json().get("results", [])
    else:
        return []