import joblib
import pandas as pd
from datetime import datetime

# Load all 3 model files once at startup
model   = joblib.load("models/waste_fill_model.pkl")
encoder = joblib.load("models/label_encoder.pkl")
scaler  = joblib.load("models/scaler.pkl")

# All 34 zones your encoder knows
VALID_ZONES = list(encoder.classes_)

# Zone type mapping — 1 = market/commercial, 0 = residential/industrial
ZONE_TYPE = {
    "Gulmandi Market":       1,
    "Mondha Market":         1,
    "Usmanpura Market":      1,
    "Juna Bazaar":           1,
    "Station Road":          1,
    "Connaught Place Chowk": 1,
    "Kranti Chowk":          1,
    "Roshan Gate":           1,
    "Shahaganj":             1,
    "Gulmandi":              1,
    "Osmanpura":             1,
    "Nirala Bazaar":         1,
    "Chikalthana MIDC":      0,
    "Shendra MIDC":          0,
    "Waluj MIDC":            0,
    "Daultabad Industrial":  0,
    "Cidco N-1":             0,
    "Cidco N-2":             0,
    "Cidco N-3":             0,
    "Cidco N-4":             0,
    "Cidco N-5":             0,
    "Cidco N-6":             0,
    "Bajaj Nagar":           0,
    "Samarth Nagar":         0,
    "Shivaji Nagar":         0,
    "Garkheda":              0,
    "Mukundwadi":            0,
    "Naregaon":              0,
    "Padegaon":              0,
    "Pundaliknagar":         0,
    "Aurangpura":            0,
    "Bairagadpura":          0,
    "Jadhavwadi":            0,
    "Cantonment":            0,
}

def predict_fill(area_name: str, last_collected_hours: int,
                 time_of_day: int = None, day_of_week: int = None) -> float:
    """
    Predict fill percentage for a bin.
    
    Args:
        area_name: One of the 34 Aurangabad zone names
        last_collected_hours: Hours since last collection
        time_of_day: Hour of day (0-23). Defaults to current hour.
        day_of_week: 0=Mon...6=Sun. Defaults to today.
    
    Returns:
        Predicted fill percentage (0-100)
    """
    now = datetime.now()
    if time_of_day is None:
        time_of_day = now.hour
    if day_of_week is None:
        day_of_week = now.weekday()

    # Encode area name → integer
    area_encoded = int(encoder.transform([area_name])[0])
    area_type    = ZONE_TYPE.get(area_name, 0)

    # Build DataFrame with exact feature names the model was trained on
    df = pd.DataFrame([{
        "area_type":            area_type,
        "area_encoded":         area_encoded,
        "last_collected_hours": last_collected_hours,
        "time_of_day":          time_of_day,
        "day_of_week":          day_of_week,
    }])

    scaled = scaler.transform(df)
    pred   = model.predict(scaled)[0]

    # Clamp to valid range
    return round(float(max(0.0, min(100.0, pred))), 1)


def get_feature_importance() -> list:
    """Returns feature importances for dashboard display."""
    features = list(model.feature_names_in_)
    importances = model.feature_importances_.tolist()
    return sorted(
        [{"feature": f, "importance": round(i * 100, 1)}
         for f, i in zip(features, importances)],
        key=lambda x: x["importance"], reverse=True
    )