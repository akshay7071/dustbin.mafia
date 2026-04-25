from fastapi import APIRouter
from app.core.firebase import get_db
from app.ml.self_evolution import get_retrain_log, get_feedback_log

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

    data      = latest.to_dict()
    baseline  = data.get("baseline_distance_km", 1)
    optimized = data.get("total_distance_km", 1)
    pct_saved = round((1 - optimized / baseline) * 100, 1) if baseline > 0 else 0

    # ── RMSE from retrain log ──
    retrain_logs   = get_retrain_log()
    latest_retrain = retrain_logs[-1] if retrain_logs else None

    # ── Accuracy from feedback log ──
    feedback_logs = get_feedback_log()
    total         = len(feedback_logs)
    accurate      = sum(1 for e in feedback_logs if e["error"] <= 10)
    accuracy_pct  = round((accurate / total) * 100, 1) if total > 0 else None

    return {
        "optimized_distance_km":  optimized,
        "baseline_distance_km":   baseline,
        "pct_distance_saved":     pct_saved,
        "bins_visited":           data.get("bins_visited"),
        "bins_skipped":           data.get("bins_skipped"),
        "fuel_saved_litres":      data.get("fuel_saved_litres"),
        "co2_saved_kg":           data.get("co2_saved_kg"),
        "trees_equivalent":       data.get("trees_equivalent"),
        "model_rmse":             latest_retrain.get("new_rmse") if latest_retrain else None,
        "last_retrained":         latest_retrain.get("timestamp") if latest_retrain else None,
        "total_retrains":         len(retrain_logs),
        "model_accuracy_pct":     accuracy_pct,
        "total_collections":      total,
    }