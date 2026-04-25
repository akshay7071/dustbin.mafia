import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
import os

# Ensure models directory exists
os.makedirs("backend/models", exist_ok=True)

# 1. Create Label Encoder for zones
ZONES = [
    "Gulmandi Market", "Mondha Market", "Usmanpura Market", "Juna Bazaar",
    "Station Road", "Connaught Place Chowk", "Kranti Chowk", "Roshan Gate",
    "Shahaganj", "Gulmandi", "Osmanpura", "Nirala Bazaar", "Chikalthana MIDC",
    "Shendra MIDC", "Waluj MIDC", "Daultabad Industrial", "Cidco N-1",
    "Cidco N-2", "Cidco N-3", "Cidco N-4", "Cidco N-5", "Cidco N-6",
    "Bajaj Nagar", "Samarth Nagar", "Shivaji Nagar", "Garkheda",
    "Mukundwadi", "Naregaon", "Padegaon", "Pundaliknagar", "Aurangpura",
    "Bairagadpura", "Jadhavwadi", "Cantonment"
]

encoder = LabelEncoder()
encoder.fit(ZONES)
joblib.dump(encoder, "backend/models/label_encoder.pkl")
print("✅ Saved label_encoder.pkl")

# 2. Create Scaler
# Features: area_type, area_encoded, last_collected_hours, time_of_day, day_of_week
# Let's fit it on some dummy data
dummy_data = pd.DataFrame([
    [1, 0, 0, 0, 0],
    [0, 33, 48, 23, 6]
], columns=["area_type", "area_encoded", "last_collected_hours", "time_of_day", "day_of_week"])

scaler = StandardScaler()
scaler.fit(dummy_data)
joblib.dump(scaler, "backend/models/scaler.pkl")
print("✅ Saved scaler.pkl")

# 3. Create initial Random Forest Model
X = dummy_data
y = [10.0, 95.0]

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)
joblib.dump(model, "backend/models/waste_fill_model.pkl")
print("✅ Saved waste_fill_model.pkl")

print("\n🚀 Initial ML models generated successfully!")
