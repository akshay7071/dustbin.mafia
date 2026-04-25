from fastapi import FastAPI
from app.routers import predict, route   # 👈 add route

app = FastAPI(title="WasteWise API 🚀")

app.include_router(predict.router)
app.include_router(route.router)   # 👈 add this

@app.get("/")
def root():
    return {"message": "WasteWise backend is running"}