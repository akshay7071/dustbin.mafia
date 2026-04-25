from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from app.ml.predictor import predict_fill

router = APIRouter()   # 👈 THIS LINE IS CRITICAL


class Bin(BaseModel):
    bin_id: str
    last_collected_hours: int
    time_of_day: int
    day_of_week: int
    area_type: str
    bin_capacity: int
    x: float
    y: float


class RouteRequest(BaseModel):
    bins: List[Bin]


def distance(a, b):
    return ((a.x - b.x)**2 + (a.y - b.y)**2) ** 0.5


@router.post("/route")
def optimize_route(data: RouteRequest):
    bins = data.bins

    # Predict fill
    for b in bins:
        b.fill = predict_fill(b.dict())

    urgent_bins = [b for b in bins if b.fill > 70]

    if not urgent_bins:
        return {"message": "No urgent bins", "route": []}

    route = []
    current = urgent_bins[0]
    route.append(current)

    remaining = urgent_bins[1:]

    while remaining:
        next_bin = min(remaining, key=lambda b: distance(current, b))
        route.append(next_bin)
        remaining.remove(next_bin)
        current = next_bin

    return {
        "route": [
            {
                "bin_id": b.bin_id,
                "predicted_fill": b.fill,
                "x": b.x,
                "y": b.y
            }
            for b in route
        ]
    }