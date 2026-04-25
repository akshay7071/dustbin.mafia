import joblib
import numpy as np
import os

# Get current file directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Build path to models folder
MODEL_PATH = os.path.join(BASE_DIR, "../../models/waste_fill_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "../../models/scaler.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "../../models/label_encoder.pkl")

# Load files
model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
label_encoder = joblib.load(ENCODER_PATH)


def predict_fill(data):
    try:
        area_encoded = label_encoder.transform([data["area_type"]])[0]
    except:
        area_encoded = data["area_type"]

    features = np.array([[
        data["last_collected_hours"],
        data["time_of_day"],
        data["day_of_week"],
        area_encoded,
        data["bin_capacity"]
    ]])

    features_scaled = scaler.transform(features)

    prediction = model.predict(features_scaled)[0]

    return round(float(prediction), 2)