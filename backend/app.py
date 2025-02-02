from datetime import datetime
import time
from bson.objectid import ObjectId
from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS

# Initialize Flask with __name__
app = Flask(__name__)
CORS(app, supports_credentials=True)

# MongoDB connection setup
client = MongoClient("mongodb+srv://kjeasterly31:yfuOCpUepwOwyCgc@main.1kg3i.mongodb.net/")
db = client["barber-database"]
collection = db["barbers"]
sessions_collection = db["sessions"]

# Verify MongoDB connection
try:
    client.admin.command('ping')
    print("MongoDB connection successful!")
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    exit(1)

@app.route("/test", methods=["GET"])
def test():
    return "Server is running!"

@app.route("/get_barber", methods=["GET"])
def get_barber():
    try:
        barber_id = request.args.get("id")
        barber_name = request.args.get("name")
        location = request.args.get("location")
        hairstyles = request.args.get("hairstyles")
        rating = request.args.get("rating")
        gender = request.args.get("gender")
        will_travel = request.args.get("will_travel")
        cost = request.args.get("cost")

        query = {}

        if barber_id:
            query["_id"] = ObjectId(barber_id)
        if barber_name:
            query["name"] = barber_name
        if location:
            query["neighborhood"] = location
        if hairstyles:
            query["hairstyles"] = {
                "$regex": f".*{hairstyles}.*",
                "$options": "i"
            }
        if rating:
            query["rating"] = {"$gte": float(rating)}
        if gender:
            query["gender"] = gender
        if will_travel:
            query["will-travel"] = will_travel
        if cost:
            query["cost"] = {"$lte": float(cost)}

        barber_data = list(collection.find(query))

        for item in barber_data:
            item["_id"] = str(item["_id"])

        return jsonify(barber_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/create_session", methods=["POST"])
def create_session():
    try:
        data = request.get_json()
        
        barber_id = data['barber_id']
        user_id = data['user_id']
        appointment_time = int(data['time'])
        duration = int(data['duration'])
        amount_paid = float(data['amount_paid'])
        meeting_location = data['meeting_location']
        
        barber = collection.find_one({"_id": ObjectId(barber_id)})
        
        if not barber:
            return jsonify({"error": "Barber not found"}), 404

        barber_data = {
            "name": barber.get("name"),
            "photo": barber.get("photo"),
            "_id": str(barber.get("_id"))
        }

        session_data = {
            "barber_id": str(barber_id),
            "user_id": user_id,
            "barber_name": barber_data["name"],
            "barber_photo": barber_data["photo"],
            "created_time": int(time.time()),
            "appointment_time": appointment_time,
            "duration": duration,
            "amount_paid": amount_paid,
            "meeting_location": meeting_location
        }

        result = sessions_collection.insert_one(session_data)
        
        response_data = {
            "session_id": str(result.inserted_id),
            "message": "Session created successfully",
            "session_details": {
                **session_data,
                "_id": str(result.inserted_id)
            }
        }

        return jsonify(response_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_user_sessions", methods=["GET"])
def get_user_sessions():
    try:
        user_id = request.args.get("user_id")
        
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        # Find all sessions for this user
        sessions = list(sessions_collection.find({"user_id": user_id}))

        # Convert ObjectIds to strings
        for session in sessions:
            session["_id"] = str(session["_id"])

        return jsonify({
            "user_id": user_id,
            "session_count": len(sessions),
            "sessions": sessions
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_barber_sessions", methods=["GET"])
def get_barber_sessions():
    try:
        barber_id = request.args.get("barber_id")
        
        if not barber_id:
            return jsonify({"error": "Barber ID is required"}), 400

        # Find all sessions for this barber
        sessions = list(sessions_collection.find({"barber_id": barber_id}))

        # Convert ObjectIds to strings
        for session in sessions:
            session["_id"] = str(session["_id"])

        return jsonify({
            "barber_id": barber_id,
            "session_count": len(sessions),
            "sessions": sessions
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.after_request
def add_cors_headers(response):
    """
    Add CORS headers to the response to allow requests from the origin of the request.
    """
    origin = request.headers.get('Origin')
    if origin:
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

if __name__ == "__main__":
    print("Starting server...")
    app.run(debug=True, port=5000)


