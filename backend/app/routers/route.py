from fastapi import APIRouter
from app.core.firebase import get_db
from app.ml.predictor import predict_fill
from app.core.config import (
    DEPOT_LAT, DEPOT_LON,
    FUEL_PER_KM, CO2_PER_LITRE, TREES_PER_KG_CO2
)
import math
from datetime import datetime

router = APIRouter()

def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlam/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

@router.post("/route")
def optimize_route():
    db = get_db()
    docs = list(db.collection("bins").stream())

    if not docs:
        return {"message": "No bins found. Run seed first.", "route": []}

    bin_data = []
    for doc in docs:
        b = doc.to_dict()
        predicted = predict_fill(
            area_name=b.get("area_name", "Osmanpura"),
            last_collected_hours=b.get("last_collected_hours", 24),
        )
        bin_data.append({
            "bin_id":         doc.id,
            "name":           b.get("name"),
            "lat":            b.get("lat"),
            "lon":            b.get("lon"),
            "zone":           b.get("zone"),
            "area_type":      b.get("area_type"),
            "fill_pct":       b.get("fill_pct"),
            "predicted_fill": round(predicted, 1),
            "urgency":        b.get("urgency", "low"),
        })

    urgent  = [b for b in bin_data if b["predicted_fill"] > 70]
    skipped = len(bin_data) - len(urgent)

    if not urgent:
        return {"message": "No urgent bins right now", "route": [], "bins_skipped": skipped}

    # Nearest-neighbor greedy from depot
    route = []
    remaining = list(urgent)
    cur_lat, cur_lon = DEPOT_LAT, DEPOT_LON

    while remaining:
        nearest = min(remaining, key=lambda b: haversine_km(cur_lat, cur_lon, b["lat"], b["lon"]))
        route.append(nearest)
        remaining.remove(nearest)
        cur_lat, cur_lon = nearest["lat"], nearest["lon"]

    # Calculate distances
    optimized_km = 0
    prev_lat, prev_lon = DEPOT_LAT, DEPOT_LON
    for stop in route:
        optimized_km += haversine_km(prev_lat, prev_lon, stop["lat"], stop["lon"])
        prev_lat, prev_lon = stop["lat"], stop["lon"]
    optimized_km += haversine_km(prev_lat, prev_lon, DEPOT_LAT, DEPOT_LON)

    baseline_km = sum(
        haversine_km(DEPOT_LAT, DEPOT_LON, b["lat"], b["lon"]) * 2
        for b in bin_data
    )

    fuel_saved = round((baseline_km - optimized_km) * FUEL_PER_KM, 2)
    co2_saved  = round(fuel_saved * CO2_PER_LITRE, 2)

    db.collection("routes").add({
        "stop_ids":              [r["bin_id"] for r in route],
        "total_distance_km":     round(optimized_km, 2),
        "baseline_distance_km":  round(baseline_km, 2),
        "bins_visited":          len(route),
        "bins_skipped":          skipped,
        "fuel_saved_litres":     fuel_saved,
        "co2_saved_kg":          co2_saved,
        "trees_equivalent":      round(co2_saved * TREES_PER_KG_CO2, 2),
        "created_at":            datetime.utcnow().isoformat(),
    })

    return {
        "route":                 route,
        "total_distance_km":     round(optimized_km, 2),
        "baseline_distance_km":  round(baseline_km, 2),
        "bins_visited":          len(route),
        "bins_skipped":          skipped,
        "fuel_saved_litres":     fuel_saved,
        "co2_saved_kg":          co2_saved,
        "trees_equivalent":      round(co2_saved * TREES_PER_KG_CO2, 2),
    }