import json
import requests
import read


NEARBYSEARCH_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
PLACE_DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json'
API_KEY = read.API_KEY


def getPlaceDetails(placeId):
    params = {
        "place_id": str(placeId),
        "key": API_KEY 
    }
    
    response = requests.get(PLACE_DETAILS_URL, params=params)
    
    if response.status_code == 200:
        return response.json().get("result", [])
    else:
        print('getPlaces: '+ response['status'])
        return []


def getPlaces(type_, location, distance, budget):

    params = {
        "location": str(location['lat'])+', '+str(location['lng']),
        "radius": distance,
        "maxprice": budget,
        "type": type_,
        "key": API_KEY 
    }

    response = requests.get(NEARBYSEARCH_URL, params=params)

    if response.status_code == 200:
        return response.json().get("results", [])
    else:
        print('getPlaces: '+ response['status'])
        return []