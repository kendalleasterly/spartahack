import cloudinary
from bson.objectid import ObjectId
from flask import Flask, redirect, url_for, request, render_template, jsonify
from pymongo import MongoClient
from flask_cors import CORS

app = Flask("Spartancutz")
CORS(app)

# MongoDB connection setup
client = MongoClient("mongodb+srv://gautham:nVXsNYur5nPIzpP1@main.1kg3i.mongodb.net/")
db = client["barber-database"]
collection = db["barber"]

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get_barber", methods=["GET"])
def get_barber():
    try:
        # Extract query parameters from the URL
        barber_id = request.args.get("_id")
        barber_name = request.args.get("name")
        location = request.args.get("location")
        hairstyle = request.args.get("hairstyle")
        rating = request.args.get("rating")
        gender = request.args.get("gender")
        will_travel = request.args.get("will_travel")
        cost = request.args.get("cost")

        query = {}

        # Build the query based on the provided parameters
        if barber_id:
            query["_id"] = ObjectId(barber_id)
        if barber_name:
            query["Name"] = barber_name
        if location:
            query["Neighborhood"] = location
        if hairstyle:
            query["Hairstyles"] = {"$in": [hairstyle]}
        if rating:
            query["Rating"] = float(rating)
        if gender:
            query["Gender"] = gender
        if will_travel:
            query["Will-Travel"] = will_travel.lower() == 'true'
        if cost:
            query["Cost"] = int(cost)

        # Fetch the data from MongoDB
        barber_data = list(collection.find(query))

        # Convert ObjectId to string for JSON serialization
        for item in barber_data:
            item["_id"] = str(item["_id"])

        return jsonify(barber_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/create_session", methods=["POST"])
def create_session():
    try:
        data = request.get_json()
        barber_id = data.get('barber_id')
        
        # Find barber in the barber collection
        barber = collection.find_one({"_id": ObjectId(barber_id)})
        
        if not barber:
            return jsonify({"error": "Barber not found"}), 404

        # Create session document
        session_data = {
            "barber_id": barber_id,
            "barber_name": barber.get("Name"),
            "barber_photo": barber.get("Photo"),
        }

        # Insert into sessions collection
        sessions_collection = db["sessions"]
        result = sessions_collection.insert_one(session_data)

        return jsonify({
            "session_id": str(result.inserted_id),
            "message": "Session created successfully"
        })

    except Exception as e:
        print(f"Error in create_session: {str(e)}")  # Debug print
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)