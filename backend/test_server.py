from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/ping", methods=['GET', 'POST'])
def ping():
    return jsonify({"message": "pong"})

if __name__ == "__main__":
    app.run(debug=True, port=5001)  # Using a different port