from fastapi import APIRouter
from app.core.firebase import get_db

router = APIRouter()

@router.get("/metrics")
def get_metrics():
    db = get_db()
    docs = (
        db.collection("routes")
        .order_by("created_at", direction="DESCENDING")
        .limit(1)
        .stream()
    )
    latest = next(docs, None)
    if not latest:
        return {"message": "No routes generated yet. Hit POST /route first."}

    data = latest.to_dict()
    baseline  = data.get("baseline_distance_km", 1)
    optimized = data.get("total_distance_km", 1)
    pct_saved = round((1 - optimized / baseline) * 100, 1) if baseline > 0 else 0

    return {
        "optimized_distance_km": optimized,
        "baseline_distance_km":  baseline,
        "pct_distance_saved":    pct_saved,
        "bins_visited":          data.get("bins_visited"),
        "bins_skipped":          data.get("bins_skipped"),
        "fuel_saved_litres":     data.get("fuel_saved_litres"),
        "co2_saved_kg":          data.get("co2_saved_kg"),
        "trees_equivalent":      data.get("trees_equivalent"),
    }