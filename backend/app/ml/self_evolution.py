import joblib
import json
import numpy as np
import pandas as pd
import threading
from datetime import datetime
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
from app.ml.predictor import ZONE_TYPE, scaler, encoder

# ── Color → actual fill % (ground truth from collector) ──
COLOR_TO_FILL = {
    "green":  25.0,   # LOW      0–40%
    "yellow": 55.0,   # MEDIUM   41–65%
    "orange": 78.0,   # HIGH     66–85%
    "red":    93.0,   # CRITICAL 86–100%
}

# ── File paths ──
FEEDBACK_LOG    = "data/feedback_log.json"
TRAINING_BUFFER = "data/training_buffer.json"
RETRAIN_LOG     = "data/retraining_log.json"
MODEL_PATH      = "models/waste_fill_model.pkl"

# ── Load model ──
_lock  = threading.Lock()
_model = joblib.load(MODEL_PATH)

RETRAIN_EVERY = 5


def _read_json(path):
    try:
        with open(path, "r") as f:
            return json.load(f)
    except:
        return []


def _append_json(path, entry):
    data = _read_json(path)
    data.append(entry)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


def _save_retrain_to_firestore(entry: dict):
    try:
        from app.core.firebase import get_db
        db = get_db()
        db.collection("retraining_logs").add(entry)
    except Exception as e:
        print(f"Firestore retrain log failed: {e}")


def submit_feedback(bin_id: str, area_name: str,
                    last_collected_hours: int,
                    predicted_fill: float,
                    actual_color: str) -> dict:
    if actual_color not in COLOR_TO_FILL:
        raise ValueError(f"Invalid color '{actual_color}'. Use: {list(COLOR_TO_FILL)}")

    actual_fill = COLOR_TO_FILL[actual_color]
    error = round(abs(predicted_fill - actual_fill), 2)
    now = datetime.now()

    # ── Save to feedback log ──
    _append_json(FEEDBACK_LOG, {
        "timestamp":            now.isoformat(),
        "bin_id":               bin_id,
        "area_name":            area_name,
        "predicted_fill":       predicted_fill,
        "actual_color":         actual_color,
        "actual_fill":          actual_fill,
        "error":                error,
    })

    # ── Save to training buffer ──
    _append_json(TRAINING_BUFFER, {
        "area_type":            ZONE_TYPE.get(area_name, 0),
        "area_name":            area_name,
        "last_collected_hours": last_collected_hours,
        "time_of_day":          now.hour,
        "day_of_week":          now.weekday(),
        "fill_percentage":      actual_fill,
    })

    # ── Trigger retraining if threshold met ──
    buffer = _read_json(TRAINING_BUFFER)
    retrain_triggered = len(buffer) % RETRAIN_EVERY == 0

    if retrain_triggered:
        threading.Thread(target=_retrain, daemon=True).start()

    return {
        "status":            "recorded",
        "bin_id":            bin_id,
        "predicted_fill":    predicted_fill,
        "actual_fill":       actual_fill,
        "error":             error,
        "total_feedback":    len(buffer),
        "retrain_triggered": retrain_triggered,
    }


def _retrain():
    global _model

    buffer = _read_json(TRAINING_BUFFER)
    if len(buffer) < 5:
        return

    df = pd.DataFrame(buffer)
    df["area_encoded"] = df["area_name"].apply(
        lambda x: int(encoder.transform([x])[0]) if x in encoder.classes_ else 0
    )

    feature_cols = ["area_type", "area_encoded", "last_collected_hours",
                    "time_of_day", "day_of_week"]
    X = df[feature_cols]
    y = df["fill_percentage"]

    X_scaled = scaler.transform(X)

    # ── RMSE before ──
    with _lock:
        old_preds = _model.predict(X_scaled)
    old_rmse = round(float(np.sqrt(mean_squared_error(y, old_preds))), 4)

    # ── Retrain ──
    new_model = RandomForestRegressor(n_estimators=100, random_state=42)
    new_model.fit(X_scaled, y)
    new_preds = new_model.predict(X_scaled)
    new_rmse  = round(float(np.sqrt(mean_squared_error(y, new_preds))), 4)

    # ── Swap model in memory ──
    with _lock:
        _model = new_model

    # ── Save to disk ──
    joblib.dump(new_model, MODEL_PATH)

    # ── Log entry ──
    log_entry = {
        "timestamp":    datetime.now().isoformat(),
        "samples_used": len(buffer),
        "old_rmse":     old_rmse,
        "new_rmse":     new_rmse,
        "improved":     new_rmse < old_rmse,
    }

    # ── Save to local JSON ──
    _append_json(RETRAIN_LOG, log_entry)

    # ── Save to Firestore ──
    _save_retrain_to_firestore(log_entry)


def force_retrain() -> dict:
    buffer = _read_json(TRAINING_BUFFER)
    if len(buffer) < 2:
        return {
            "status":  "not_enough_data",
            "message": "Need at least 2 feedback entries to retrain"
        }

    _retrain()

    logs   = _read_json(RETRAIN_LOG)
    latest = logs[-1] if logs else {}

    return {
        "status":       "retrained",
        "old_rmse":     latest.get("old_rmse"),
        "new_rmse":     latest.get("new_rmse"),
        "improved":     latest.get("improved"),
        "samples_used": latest.get("samples_used"),
    }


def get_retrain_log() -> list:
    return _read_json(RETRAIN_LOG)


def get_feedback_log() -> list:
    return _read_json(FEEDBACK_LOG)