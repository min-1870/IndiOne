from flask import Flask, request
app = Flask("IndiOneApi")

@app.route('/', methods=['GET'])
def header_info():
    headers = request.headers
    userInput = {
        "people": headers.get('people'),
        "purpose": headers.get('purpose'),
        "time": headers.get('time'),
        "distance": headers.get('distance'),
        "transportation": headers.get('transportation'),
        "budget": headers.get('budget'),
        "priority": headers.get('priority')
    }

    if [key for key, value in userInput.items() if not value]:
        return {"error": "Missing property"}, 400

    
    return userInput, 200


if __name__ == '__main__':
    app.run(port=5000)
