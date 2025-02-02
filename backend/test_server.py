from datetime import datetime
import time
from bson.objectid import ObjectId
from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# MongoDB connection setup
print("Attempting MongoDB connection...")
client = MongoClient("mongodb+srv://gautham:nVXsNYur5nPIzpP1@main.1kg3i.mongodb.net/")
db = client["barber-database"]
collection = db["barbers"]
sessions_collection = db["sessions"]

print(f"Connected to database: {db.name}")
print(f"Using collection: {collection.name}")
print(f"Document count: {collection.count_documents({})}")
print(f"Available collections: {db.list_collection_names()}")

@app.route("/test", methods=["GET"])
def test():
    return "Server is running!"

@app.route("/create_session", methods=["POST"])
def create_session():
    return "Session endpoint"  # Add a simple return statement

if __name__ == "__main__":
    print("Starting server...")
    app.run(debug=True, port=5000)