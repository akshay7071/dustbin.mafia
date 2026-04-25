from fastapi import APIRouter
from app.core.firebase import get_db

router = APIRouter()

@router.get("/bins")
def get_all_bins():
    db = get_db()
    docs = db.collection("bins").stream()
    bins = []
    for doc in docs:
        data = doc.to_dict()
        data["bin_id"] = doc.id
        bins.append(data)
    return bins

@router.get("/bins/{bin_id}")
def get_bin(bin_id: str):
    db = get_db()
    doc = db.collection("bins").document(bin_id).get()
    if not doc.exists:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Bin not found")
    data = doc.to_dict()
    data["bin_id"] = doc.id
    return data