from fastapi import APIRouter
from pydantic import BaseModel
from app.core.firebase import get_db
from app.ml.predictor import predict_fill, ZONE_TYPE
from app.core.config import URGENCY_HIGH_THRESHOLD, URGENCY_MEDIUM_THRESHOLD
import random

router = APIRouter()

class SimulateRequest(BaseModel):
    scenario: str = "random"

# Fill ranges per scenario per area_type (0=residential/industrial, 1=market/commercial)
SCENARIO_WEIGHTS = {
    "random":     {1: (20, 95), 0: (20, 90)},
    "morning":    {1: (60, 99), 0: (10, 45)},   # markets peak in morning
    "evening":    {1: (30, 70), 0: (55, 95)},   # residential peaks in evening
    "rain":       {1: (70, 99), 0: (30, 75)},   # markets overflow in rain
    "market_day": {1: (80, 99), 0: (20, 60)},   # Sunday market day
}

@router.post("/simulate")
def simulate(req: SimulateRequest):
    db = get_db()
    weights = SCENARIO_WEIGHTS.get(req.scenario, SCENARIO_WEIGHTS["random"])
    docs = list(db.collection("bins").stream())

    updated = []
    batch = db.batch()

    for doc in docs:
        data = doc.to_dict()
        area_name = data.get("area_name", "Osmanpura")
        area_type = ZONE_TYPE.get(area_name, 0)
        lo, hi = weights.get(area_type, (20, 90))

        new_fill = round(random.uniform(lo, hi), 1)
        last_hours = random.randint(2, 48)

        predicted = predict_fill(
            area_name=area_name,
            last_collected_hours=last_hours,
        )
        urgency = (
            "high"   if predicted > URGENCY_HIGH_THRESHOLD else
            "medium" if predicted > URGENCY_MEDIUM_THRESHOLD else
            "low"
        )

        updates = {
            "fill_pct":             new_fill,
            "last_collected_hours": last_hours,
            "urgency":              urgency,
            "predicted_fill":       predicted,
        }
        batch.update(doc.reference, updates)
        updated.append({"bin_id": doc.id, **data, **updates})

    batch.commit()
    return updated