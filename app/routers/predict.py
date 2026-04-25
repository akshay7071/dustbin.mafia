from fastapi import APIRouter
from pydantic import BaseModel
from app.ml.predictor import predict_fill

router = APIRouter()

class PredictRequest(BaseModel):
    last_collected_hours: int
    time_of_day: int
    day_of_week: int
    area_type: str   # keep as str if you used label encoder
    bin_capacity: int

@router.post("/predict")
def predict(data: PredictRequest):
    result = predict_fill(data.dict())
    return {"predicted_fill_percentage": result}