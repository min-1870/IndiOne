import json
import os

def directory(fileName):
    return os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), fileName)



with open(directory('api_key.txt'), 'r') as file:
    API_KEY = file.read()


with open(directory('defaultValues.json'), 'r') as f:
   DEFAULT_VALUES = json.load(f)



print(API_KEY)
print(DEFAULT_VALUES)

