from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.ml.self_evolution import submit_feedback, get_retrain_log, get_feedback_log, force_retrain
from app.core.firebase import get_db
from datetime import datetime

router = APIRouter()

class CollectRequest(BaseModel):
    bin_id:               str
    area_name:            str
    last_collected_hours: int
    predicted_fill:       float
    actual_color:         str

@router.post("/collect")
def mark_collected(data: CollectRequest):
    try:
        result = submit_feedback(
            bin_id               = data.bin_id,
            area_name            = data.area_name,
            last_collected_hours = data.last_collected_hours,
            predicted_fill       = data.predicted_fill,
            actual_color         = data.actual_color,
        )

        db = get_db()
        bin_ref = db.collection("bins").document(data.bin_id)
        doc = bin_ref.get()

        if doc.exists:
            bin_ref.update({
                "fill_percentage":      0,
                "last_collected":       datetime.now().isoformat(),
                "last_collected_hours": 0,
                "status":               "collected",
            })
            result["firestore_updated"] = True
        else:
            result["firestore_updated"] = False
            result["warning"] = f"Bin {data.bin_id} not found in Firestore"

        return result

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/collect/logs")
def feedback_logs():
    return {"logs": get_feedback_log()}


@router.get("/collect/accuracy")
def model_accuracy():
    logs = get_feedback_log()
    if not logs:
        return {"message": "No feedback data yet"}

    errors = [entry["error"] for entry in logs]
    total  = len(errors)

    # within 25% = accurate prediction
    accurate     = sum(1 for e in errors if e <= 25)
    accuracy_pct = round((accurate / total) * 100, 1)

    avg_error = round(sum(errors) / total, 2)
    max_error = round(max(errors), 2)
    min_error = round(min(errors), 2)

    return {
        "total_collections":    total,
        "accurate_predictions": accurate,
        "accuracy_pct":         accuracy_pct,
        "avg_error":            avg_error,
        "max_error":            max_error,
        "min_error":            min_error,
        "threshold_used":       "±25% = accurate",
    }


@router.get("/retrain/logs")
def retrain_logs():
    return {"logs": get_retrain_log()}


@router.post("/retrain")
def manual_retrain():
    result = force_retrain()
    return result