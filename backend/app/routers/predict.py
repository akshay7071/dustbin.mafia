from fastapi import APIRouter
from pydantic import BaseModel
from app.ml.predictor import predict_fill, get_feature_importance, VALID_ZONES

router = APIRouter()

class PredictRequest(BaseModel):
    area_name:            str   # e.g. "Gulmandi Market"
    last_collected_hours: int
    time_of_day:          int | None = None   # defaults to current hour
    day_of_week:          int | None = None   # defaults to today

@router.post("/predict")
def predict(data: PredictRequest):
    if data.area_name not in VALID_ZONES:
        return {
            "error": f"Unknown area: {data.area_name}",
            "valid_zones": VALID_ZONES
        }
    result = predict_fill(
        area_name            = data.area_name,
        last_collected_hours = data.last_collected_hours,
        time_of_day          = data.time_of_day,
        day_of_week          = data.day_of_week,
    )
    urgency = "high" if result > 80 else "medium" if result > 55 else "low"
    return {
        "predicted_fill_percentage": result,
        "urgency": urgency,
        "area_name": data.area_name,
    }

@router.get("/predict/zones")
def get_zones():
    """Returns all valid zone names the model understands."""
    return {"zones": VALID_ZONES}

@router.get("/predict/feature-importance")
def feature_importance():
    """Returns feature importance for dashboard chart."""
    return {"features": get_feature_importance()}