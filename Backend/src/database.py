import json
import os
from pymongo.mongo_client import MongoClient

def directory(fileName):
    return os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), fileName)



with open(directory('keys.json'), 'r') as f:
    KEYS = json.load(f)
    print(KEYS)



with open(directory('defaultValues.json'), 'r') as f:
    DEFAULT_VALUES = json.load(f)
    print(DEFAULT_VALUES)
    

uri = KEYS['databaseUrl']

# Create a new client and connect to the server
client = MongoClient(uri)

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    USERS_DATABASE = client.get_database("users")
    PLACES_COLLECTION = USERS_DATABASE.get_collection("temp-places")
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
