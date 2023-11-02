from flask import Flask, request, jsonify
from flask_cors import CORS
import route
app = Flask("IndiOneApi")
CORS(app)
CORS(app, origins=["http://localhost:1234/"])

@app.route('/route', methods=['POST'])
def generateRoutes():
    # Check if the request contains JSON data
    if request.is_json:
        try:
            # Parse the JSON data from the request body
            userInput = request.get_json()
            print(userInput)

            requireKeys = {'location', 'distance', 'time', 'duration', 'transportation', 'budget', 'template'}

            if requireKeys != set(userInput.keys()):
                return {"error": "Missing property"}, 400                
    
            if not 'lat' in userInput["location"].keys() or not 'lng' in userInput["location"].keys():
                return {"error": "Missing location"}, 400    

            # print(userInput)

            return jsonify(route.generateRoutes(userInput)), 200
        except Exception as e:
            return jsonify({"message": "Invalid JSON data", "error": str(e)}), 400
    else:
        return jsonify({"message": "Request body is not in JSON format"}), 400


@app.route('/update', methods=['POST'])
def regenerateRoute():
    # Check if the request contains JSON data
    if request.is_json:
        try:
            # Parse the JSON data from the request body
            userInput = request.get_json()
            
            requireKeys = ['id', "route", 'location', 'distance', 'time', 'duration', 'transportation', 'budget', 'template']

            for key in requireKeys:
                if not key in userInput:
                    return {"error": "Missing unserInput property: " + key}, 400    
    
            if not 'lat' in userInput["location"].keys() or not 'lng' in userInput["location"].keys():
                return {"error": "Missing location"}, 400    

            print(userInput)

            return route.regenerateRoutes(userInput), 200
        except Exception as e:
            return jsonify({"message": "Invalid JSON data", "error": str(e)}), 400
    else:
        return jsonify({"message": "Request body is not in JSON format"}), 400

if __name__ == '__main__':
    app.run(port=5000)
