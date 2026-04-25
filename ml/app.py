from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import joblib

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "Dustbin Mafia ML Service is running..."})

@app.route('/predict', methods=['POST'])
def predict():
    # Placeholder for prediction logic
    data = request.get_json()
    return jsonify({"status": "success", "prediction": "placeholder", "received_data": data})

if __name__ == '__main__':
    # For development
    app.run(port=5001, debug=True)
