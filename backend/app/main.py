from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import predict, route, bins, simulate, metrics, collect, collectors

app = FastAPI(title="WasteWise API 🚀")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router,     tags=["Predict"])
app.include_router(route.router,       tags=["Route"])
app.include_router(bins.router,        tags=["Bins"])
app.include_router(simulate.router,    tags=["Simulate"])
app.include_router(metrics.router,     tags=["Metrics"])
app.include_router(collect.router,     tags=["Collect"])
app.include_router(collectors.router,  tags=["Collectors"])

@app.get("/")
def root():
    return {"message": "WasteWise backend is running 🚀"}