"""
seed_feedback.py
Run this ONCE before the demo to pre-load realistic feedback data.
This makes the RMSE drop dramatic when judges watch live retraining.
"""

import json
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

TRAINING_BUFFER = "data/training_buffer.json"
FEEDBACK_LOG    = "data/feedback_log.json"

seed_buffer = [
    # Commercial zones — high fill, collected late
    {"area_type": 1, "area_name": "Gulmandi Market",       "last_collected_hours": 12, "time_of_day": 9,  "day_of_week": 0, "fill_percentage": 78.0},
    {"area_type": 1, "area_name": "Mondha Market",         "last_collected_hours": 20, "time_of_day": 10, "day_of_week": 0, "fill_percentage": 93.0},
    {"area_type": 1, "area_name": "Kranti Chowk",          "last_collected_hours": 14, "time_of_day": 11, "day_of_week": 1, "fill_percentage": 85.0},
    {"area_type": 1, "area_name": "Juna Bazaar",           "last_collected_hours": 18, "time_of_day": 8,  "day_of_week": 1, "fill_percentage": 90.0},
    {"area_type": 1, "area_name": "Station Road",          "last_collected_hours": 16, "time_of_day": 12, "day_of_week": 2, "fill_percentage": 82.0},
    {"area_type": 1, "area_name": "Osmanpura",             "last_collected_hours": 22, "time_of_day": 14, "day_of_week": 2, "fill_percentage": 88.0},
    {"area_type": 1, "area_name": "Nirala Bazaar",         "last_collected_hours": 10, "time_of_day": 9,  "day_of_week": 3, "fill_percentage": 72.0},
    {"area_type": 1, "area_name": "Roshan Gate",           "last_collected_hours": 24, "time_of_day": 15, "day_of_week": 3, "fill_percentage": 91.0},
    {"area_type": 1, "area_name": "Shahaganj",             "last_collected_hours": 8,  "time_of_day": 10, "day_of_week": 4, "fill_percentage": 65.0},
    {"area_type": 1, "area_name": "Gulmandi",              "last_collected_hours": 28, "time_of_day": 16, "day_of_week": 4, "fill_percentage": 95.0},

    # Residential zones — medium fill
    {"area_type": 0, "area_name": "Bajaj Nagar",           "last_collected_hours": 4,  "time_of_day": 7,  "day_of_week": 0, "fill_percentage": 25.0},
    {"area_type": 0, "area_name": "Cidco N-1",             "last_collected_hours": 36, "time_of_day": 8,  "day_of_week": 0, "fill_percentage": 55.0},
    {"area_type": 0, "area_name": "Cidco N-2",             "last_collected_hours": 48, "time_of_day": 9,  "day_of_week": 1, "fill_percentage": 60.0},
    {"area_type": 0, "area_name": "Cidco N-3",             "last_collected_hours": 60, "time_of_day": 10, "day_of_week": 1, "fill_percentage": 78.0},
    {"area_type": 0, "area_name": "Samarth Nagar",         "last_collected_hours": 6,  "time_of_day": 7,  "day_of_week": 2, "fill_percentage": 20.0},
    {"area_type": 0, "area_name": "Shivaji Nagar",         "last_collected_hours": 55, "time_of_day": 11, "day_of_week": 2, "fill_percentage": 70.0},
    {"area_type": 0, "area_name": "Garkheda",              "last_collected_hours": 40, "time_of_day": 13, "day_of_week": 3, "fill_percentage": 58.0},
    {"area_type": 0, "area_name": "Mukundwadi",            "last_collected_hours": 30, "time_of_day": 14, "day_of_week": 3, "fill_percentage": 45.0},
    {"area_type": 0, "area_name": "Naregaon",              "last_collected_hours": 64, "time_of_day": 15, "day_of_week": 4, "fill_percentage": 80.0},
    {"area_type": 0, "area_name": "Aurangpura",            "last_collected_hours": 12, "time_of_day": 8,  "day_of_week": 4, "fill_percentage": 35.0},

    # Industrial zones — low fill, collected less often
    {"area_type": 0, "area_name": "Chikalthana MIDC",      "last_collected_hours": 60, "time_of_day": 9,  "day_of_week": 0, "fill_percentage": 55.0},
    {"area_type": 0, "area_name": "Shendra MIDC",          "last_collected_hours": 72, "time_of_day": 10, "day_of_week": 1, "fill_percentage": 40.0},
    {"area_type": 0, "area_name": "Waluj MIDC",            "last_collected_hours": 39, "time_of_day": 11, "day_of_week": 2, "fill_percentage": 25.0},
    {"area_type": 0, "area_name": "Daultabad Industrial",  "last_collected_hours": 70, "time_of_day": 12, "day_of_week": 3, "fill_percentage": 50.0},
]

seed_feedback = [
    {"timestamp": "2026-04-24T09:00:00", "bin_id": "BIN_S01", "area_name": "Gulmandi Market",      "predicted_fill": 55.0, "actual_color": "orange", "actual_fill": 78.0, "error": 23.0},
    {"timestamp": "2026-04-24T09:10:00", "bin_id": "BIN_S02", "area_name": "Mondha Market",        "predicted_fill": 60.0, "actual_color": "red",    "actual_fill": 93.0, "error": 33.0},
    {"timestamp": "2026-04-24T09:20:00", "bin_id": "BIN_S03", "area_name": "Kranti Chowk",         "predicted_fill": 70.0, "actual_color": "orange", "actual_fill": 85.0, "error": 15.0},
    {"timestamp": "2026-04-24T09:30:00", "bin_id": "BIN_S04", "area_name": "Bajaj Nagar",          "predicted_fill": 40.0, "actual_color": "green",  "actual_fill": 25.0, "error": 15.0},
    {"timestamp": "2026-04-24T09:40:00", "bin_id": "BIN_S05", "area_name": "Cidco N-3",            "predicted_fill": 50.0, "actual_color": "orange", "actual_fill": 78.0, "error": 28.0},
    {"timestamp": "2026-04-24T10:00:00", "bin_id": "BIN_S06", "area_name": "Osmanpura",            "predicted_fill": 65.0, "actual_color": "orange", "actual_fill": 78.0, "error": 13.0},
    {"timestamp": "2026-04-24T10:10:00", "bin_id": "BIN_S07", "area_name": "Chikalthana MIDC",     "predicted_fill": 70.0, "actual_color": "yellow", "actual_fill": 55.0, "error": 15.0},
    {"timestamp": "2026-04-24T10:20:00", "bin_id": "BIN_S08", "area_name": "Naregaon",             "predicted_fill": 55.0, "actual_color": "orange", "actual_fill": 78.0, "error": 23.0},
    {"timestamp": "2026-04-24T10:30:00", "bin_id": "BIN_S09", "area_name": "Nirala Bazaar",        "predicted_fill": 60.0, "actual_color": "yellow", "actual_fill": 55.0, "error": 5.0},
    {"timestamp": "2026-04-24T10:40:00", "bin_id": "BIN_S10", "area_name": "Roshan Gate",          "predicted_fill": 72.0, "actual_color": "red",    "actual_fill": 93.0, "error": 21.0},
]

def seed():
    # ── Load existing data ──
    try:
        with open(TRAINING_BUFFER, "r") as f:
            existing_buffer = json.load(f)
    except:
        existing_buffer = []

    try:
        with open(FEEDBACK_LOG, "r") as f:
            existing_feedback = json.load(f)
    except:
        existing_feedback = []

    # ── Merge ──
    merged_buffer   = seed_buffer + existing_buffer
    merged_feedback = seed_feedback + existing_feedback

    # ── Write ──
    with open(TRAINING_BUFFER, "w") as f:
        json.dump(merged_buffer, f, indent=2)

    with open(FEEDBACK_LOG, "w") as f:
        json.dump(merged_feedback, f, indent=2)

    print(f"✅ Seeded {len(seed_buffer)} training rows")
    print(f"✅ Seeded {len(seed_feedback)} feedback entries")
    print(f"📦 Total training buffer: {len(merged_buffer)} rows")
    print(f"📋 Total feedback log:    {len(merged_feedback)} entries")
    print()
    print("Now run: curl -X POST http://127.0.0.1:8000/retrain")
    print("You should see a dramatic RMSE drop for the demo!")

if __name__ == "__main__":
    seed()