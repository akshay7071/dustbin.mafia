from fastapi import APIRouter, HTTPException
from app.core.firebase import get_db
from app.ml.predictor import predict_fill
from datetime import datetime

router = APIRouter()

@router.get("/collectors")
def get_all_collectors():
    db = get_db()
    docs = db.collection("collectors").stream()
    collectors = []
    for doc in docs:
        data = doc.to_dict()
        data["collector_id"] = doc.id
        collectors.append(data)
    return collectors


@router.get("/collector/{collector_id}/bins")
def get_collector_bins(collector_id: str):
    db = get_db()

    # ── Get collector ──
    col_doc = db.collection("collectors").document(collector_id).get()
    if not col_doc.exists:
        raise HTTPException(status_code=404, detail="Collector not found")

    collector    = col_doc.to_dict()
    assigned_zones = collector.get("assigned_zone", [])

    # ── Get all bins in assigned zones ──
    all_bins = db.collection("bins").stream()
    assigned_bins = []

    for doc in all_bins:
        b = doc.to_dict()
        if b.get("zone") not in assigned_zones:
            continue

        predicted = predict_fill(
            area_name            = b.get("area_name", "Osmanpura"),
            last_collected_hours = b.get("last_collected_hours", 24),
        )

        urgency = (
            "CRITICAL" if predicted > 90 else
            "HIGH"     if predicted > 70 else
            "MEDIUM"   if predicted > 50 else
            "LOW"
        )

        assigned_bins.append({
            "bin_id":               doc.id,
            "name":                 b.get("name"),
            "zone":                 b.get("zone"),
            "lat":                  b.get("lat"),
            "lon":                  b.get("lon"),
            "fill_pct":             b.get("fill_pct"),
            "predicted_fill":       round(predicted, 1),
            "urgency":              urgency,
            "last_collected_hours": b.get("last_collected_hours"),
            "status":               b.get("status", "pending"),
        })

    # Sort by predicted fill descending (most urgent first)
    assigned_bins.sort(key=lambda x: x["predicted_fill"], reverse=True)

    return {
        "collector_id":   collector_id,
        "collector_name": collector.get("name"),
        "zone":           assigned_zones,
        "total_bins":     len(assigned_bins),
        "bins":           assigned_bins,
    }


@router.get("/collector/{collector_id}/stats")
def get_collector_stats(collector_id: str):
    db = get_db()

    # ── Verify collector exists ──
    col_doc = db.collection("collectors").document(collector_id).get()
    if not col_doc.exists:
        raise HTTPException(status_code=404, detail="Collector not found")

    collector = col_doc.to_dict()

    # ── Count today's collections from feedback log ──
    from app.ml.self_evolution import get_feedback_log
    logs = get_feedback_log()

    today = datetime.now().date().isoformat()
    today_logs = [
        l for l in logs
        if l["timestamp"].startswith(today)
    ]

    errors = [l["error"] for l in today_logs] if today_logs else []
    avg_accuracy = round(100 - (sum(errors) / len(errors)), 1) if errors else None

    return {
        "collector_id":      collector_id,
        "collector_name":    collector.get("name"),
        "status":            collector.get("status"),
        "bins_collected_today": len(today_logs),
        "avg_accuracy_pct":  avg_accuracy,
        "assigned_zones":    collector.get("assigned_zone", []),
    }