import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.firebase import get_db
import random

# Real Aurangabad zones with actual approximate lat/lon
ZONES = [
    {"name": "Gulmandi Market",       "lat": 19.8762, "lon": 75.3433, "area_type": 1},
    {"name": "Mondha Market",         "lat": 19.8798, "lon": 75.3456, "area_type": 1},
    {"name": "Usmanpura Market",      "lat": 19.8821, "lon": 75.3401, "area_type": 1},
    {"name": "Juna Bazaar",           "lat": 19.8743, "lon": 75.3478, "area_type": 1},
    {"name": "Station Road",          "lat": 19.8701, "lon": 75.3389, "area_type": 1},
    {"name": "Connaught Place Chowk", "lat": 19.8756, "lon": 75.3412, "area_type": 1},
    {"name": "Kranti Chowk",          "lat": 19.8734, "lon": 75.3445, "area_type": 1},
    {"name": "Roshan Gate",           "lat": 19.8812, "lon": 75.3367, "area_type": 1},
    {"name": "Shahaganj",             "lat": 19.8867, "lon": 75.3423, "area_type": 1},
    {"name": "Gulmandi",              "lat": 19.8771, "lon": 75.3429, "area_type": 1},
    {"name": "Osmanpura",             "lat": 19.8923, "lon": 75.3512, "area_type": 1},
    {"name": "Nirala Bazaar",         "lat": 19.8689, "lon": 75.3534, "area_type": 1},
    {"name": "Cidco N-1",             "lat": 19.8634, "lon": 75.3156, "area_type": 0},
    {"name": "Cidco N-2",             "lat": 19.8612, "lon": 75.3178, "area_type": 0},
    {"name": "Cidco N-3",             "lat": 19.8589, "lon": 75.3201, "area_type": 0},
    {"name": "Cidco N-4",             "lat": 19.8567, "lon": 75.3223, "area_type": 0},
    {"name": "Cidco N-5",             "lat": 19.8545, "lon": 75.3245, "area_type": 0},
    {"name": "Cidco N-6",             "lat": 19.8523, "lon": 75.3267, "area_type": 0},
    {"name": "Bajaj Nagar",           "lat": 19.8478, "lon": 75.3312, "area_type": 0},
    {"name": "Samarth Nagar",         "lat": 19.8512, "lon": 75.3189, "area_type": 0},
    {"name": "Shivaji Nagar",         "lat": 19.8934, "lon": 75.3298, "area_type": 0},
    {"name": "Garkheda",              "lat": 19.8456, "lon": 75.3567, "area_type": 0},
    {"name": "Mukundwadi",            "lat": 19.8389, "lon": 75.3623, "area_type": 0},
    {"name": "Naregaon",              "lat": 19.9012, "lon": 75.3712, "area_type": 0},
    {"name": "Padegaon",              "lat": 19.8278, "lon": 75.3489, "area_type": 0},
    {"name": "Pundaliknagar",         "lat": 19.8345, "lon": 75.3534, "area_type": 0},
    {"name": "Aurangpura",            "lat": 19.8801, "lon": 75.3356, "area_type": 0},
    {"name": "Bairagadpura",          "lat": 19.8823, "lon": 75.3378, "area_type": 0},
    {"name": "Jadhavwadi",            "lat": 19.8712, "lon": 75.3601, "area_type": 0},
    {"name": "Cantonment",            "lat": 19.8634, "lon": 75.3645, "area_type": 0},
    {"name": "Chikalthana MIDC",      "lat": 19.8234, "lon": 75.3889, "area_type": 0},
    {"name": "Shendra MIDC",          "lat": 19.8156, "lon": 75.2934, "area_type": 0},
    {"name": "Waluj MIDC",            "lat": 19.8089, "lon": 75.2801, "area_type": 0},
    {"name": "Daultabad Industrial",  "lat": 19.9312, "lon": 75.2156, "area_type": 0},
]

def seed():
    db = get_db()
    existing = list(db.collection("bins").limit(1).stream())
    if existing:
        print("Firestore already has bins. Skipping seed.")
        return

    batch = db.batch()
    bins_ref = db.collection("bins")
    count = 0

    # Create 1-2 bins per zone (totals ~50-60 bins)
    for zone in ZONES:
        n_bins = random.randint(1, 2)
        for i in range(n_bins):
            # Slight lat/lon jitter so bins don't stack exactly
            doc_ref = bins_ref.document()
            batch.set(doc_ref, {
                "name":                 f"{zone['name']} Bin-{i+1}",
                "area_name":            zone["name"],      # used by predictor
                "lat":                  round(zone["lat"] + random.uniform(-0.002, 0.002), 6),
                "lon":                  round(zone["lon"] + random.uniform(-0.002, 0.002), 6),
                "zone":                 zone["name"],
                "area_type":            zone["area_type"], # 0 or 1
                "capacity":             random.choice([100, 200, 500]),
                "fill_pct":             round(random.uniform(10, 95), 1),
                "last_collected_hours": random.randint(2, 72),
                "predicted_fill":       0.0,
                "urgency":              "low",
            })
            count += 1

    batch.commit()
    print(f"Seeded {count} bins across {len(ZONES)} Aurangabad zones into Firestore.")

if __name__ == "__main__":
    seed()