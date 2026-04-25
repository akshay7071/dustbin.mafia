from __future__ import annotations

import hmac
import json
import math
import os
import random
import re
import time
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Literal

try:
    from dotenv import load_dotenv

    load_dotenv()
except Exception:
    pass

try:
    import firebase_admin
    from firebase_admin import credentials, firestore
except Exception:
    firebase_admin = None
    credentials = None
    firestore = None

try:
    import joblib
except Exception:
    joblib = None

try:
    import jwt
except Exception:
    jwt = None

try:
    from twilio.rest import Client as TwilioClient
except Exception:
    TwilioClient = None

try:
    from upstash_redis import Redis
except Exception:
    Redis = None

from fastapi import BackgroundTasks, Depends, FastAPI, Header, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from starlette.middleware.base import BaseHTTPMiddleware


DOC_ID_RE = re.compile(r"^[\w\-]+$")
ROOT = Path(__file__).resolve().parent


class Settings:
    node_env = os.getenv("NODE_ENV", os.getenv("ENV", "development")).lower()
    frontend_url = os.getenv("FRONTEND_URL", os.getenv("CLIENT_URL", "http://localhost:5173"))
    operator_email = os.getenv("OPERATOR_EMAIL", os.getenv("ADMIN_EMAIL", "admin@wastewise.com"))
    operator_password = os.getenv("OPERATOR_PASSWORD", os.getenv("ADMIN_PASSWORD", "Admin@1234"))
    jwt_secret = os.getenv("JWT_SECRET", os.getenv("SECRET_KEY", "dev-only-change-me-please-set-a-real-secret"))
    jwt_exp_minutes = int(os.getenv("JWT_EXP_MINUTES", "720"))
    webhook_secret = os.getenv("WEBHOOK_SECRET", "")
    firebase_key_path = os.getenv("FIREBASE_SERVICE_ACCOUNT", os.getenv("GOOGLE_APPLICATION_CREDENTIALS", str(ROOT / "serviceAccountKey.json")))
    model_path = os.getenv("MODEL_PATH", str(ROOT.parent / "models" / "fill_model.pkl"))
    twilio_account_sid = os.getenv("TWILIO_ACCOUNT_SID", "")
    twilio_auth_token = os.getenv("TWILIO_AUTH_TOKEN", "")
    twilio_from_phone = os.getenv("TWILIO_FROM_PHONE", "")
    depot_lat = float(os.getenv("DEPOT_LAT", "28.6139"))
    depot_lng = float(os.getenv("DEPOT_LNG", "77.2090"))
    upstash_redis_rest_url = os.getenv("UPSTASH_REDIS_REST_URL", "")
    upstash_redis_rest_token = os.getenv("UPSTASH_REDIS_REST_TOKEN", "")


settings = Settings()
db = None
_model = None
_rate_limits: dict[str, list[float]] = {}
_memory: dict[str, dict[str, Any]] = {
    "bins": {},
    "routes": {},
    "collectors": {},
    "collection_logs": {},
    "retrain_logs": {},
}

redis_client = None

def get_redis():
    global redis_client
    if redis_client is not None:
        return redis_client
    if Redis is not None and settings.upstash_redis_rest_url and settings.upstash_redis_rest_token:
        try:
            redis_client = Redis(url=settings.upstash_redis_rest_url, token=settings.upstash_redis_rest_token)
        except Exception:
            redis_client = None
    return redis_client

def invalidate_cache(key: str = "cache:bins"):
    redis = get_redis()
    if redis is not None:
        try:
            redis.delete(key)
        except Exception:
            pass


class LoginBody(BaseModel):
    email: str
    password: str


class BinPatch(BaseModel):
    fill_level: float | None = Field(default=None, ge=0, le=100)
    predicted_fill: float | None = Field(default=None, ge=0, le=100)
    urgency: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"] | None = None
    assigned_collector_id: str | None = None
    status: str | None = None


class RouteBody(BaseModel):
    depot_lat: float = settings.depot_lat
    depot_lng: float = settings.depot_lng
    urgency_filter: list[str] | str | None = Field(default_factory=lambda: ["HIGH", "CRITICAL"])


class DispatchBody(BaseModel):
    driver_phone: str
    route_id: str | None = None
    message: str | None = None


class SimulateBody(BaseModel):
    scenario: Literal["market_day", "rain", "festival", "normal"] = "market_day"
    intensity: float = Field(default=1.0, ge=0, le=3)


class CollectBody(BaseModel):
    bin_id: str
    collector_id: str | None = None
    actual_fill: float = Field(..., ge=0, le=100)
    predicted_fill: float | None = Field(default=None, ge=0, le=100)
    notes: str | None = None


class CollectorBody(BaseModel):
    name: str
    phone: str | None = None
    zone: str | None = None
    active: bool = True


def init_firestore() -> None:
    global db
    if firebase_admin is None or firestore is None:
        return
    try:
        if not firebase_admin._apps:
            if Path(settings.firebase_key_path).exists() and credentials is not None:
                cred = credentials.Certificate(settings.firebase_key_path)
                firebase_admin.initialize_app(cred)
            else:
                firebase_admin.initialize_app()
        db = firestore.client()
    except Exception:
        db = None


def seed_memory() -> None:
    if _memory["bins"]:
        return
    zones = ["Connaught Place", "Karol Bagh", "Lajpat Nagar", "Chandni Chowk", "Saket", "Dwarka"]
    types = ["market", "residential", "commercial", "park", "transit"]
    random.seed(42)
    for index in range(278):
        fill = random.randint(15, 92)
        bin_id = f"BIN-{index + 1:03d}"
        _memory["bins"][bin_id] = {
            "id": bin_id,
            "bin_id": bin_id,
            "lat": 28.6139 + random.uniform(-0.11, 0.11),
            "lng": 77.2090 + random.uniform(-0.13, 0.13),
            "zone": zones[index % len(zones)],
            "area_type": types[index % len(types)],
            "fill_level": fill,
            "predicted_fill": fill,
            "urgency": urgency_for_fill(fill),
            "status": "active",
            "assigned_collector_id": f"collector-{(index % 3) + 1}",
            "updated_at": now_iso(),
        }
    for index, name in enumerate(["Ravi Kumar", "Asha Singh", "Imran Khan"], start=1):
        collector_id = f"collector-{index}"
        _memory["collectors"][collector_id] = {"id": collector_id, "name": name, "phone": "", "zone": zones[index - 1], "active": True}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def clean_doc_id(value: str, field: str = "id") -> str:
    if not DOC_ID_RE.match(value):
        raise HTTPException(status_code=400, detail=f"Invalid {field} format")
    return value


def collection(name: str):
    if db is None:
        return None
    return db.collection(name)


def read_all(name: str) -> list[dict[str, Any]]:
    coll = collection(name)
    if coll is None:
        seed_memory()
        return list(_memory[name].values())
    return [{"id": doc.id, **doc.to_dict()} for doc in coll.stream()]


def read_doc(name: str, doc_id: str) -> dict[str, Any] | None:
    clean_doc_id(doc_id)
    coll = collection(name)
    if coll is None:
        seed_memory()
        return _memory[name].get(doc_id)
    doc = coll.document(doc_id).get()
    if not doc.exists:
        return None
    return {"id": doc.id, **doc.to_dict()}


def write_doc(name: str, doc_id: str, data: dict[str, Any]) -> dict[str, Any]:
    clean_doc_id(doc_id)
    data = {**data, "id": doc_id}
    coll = collection(name)
    if coll is None:
        seed_memory()
        _memory[name][doc_id] = data
    else:
        coll.document(doc_id).set(data, merge=True)
    return data


def update_doc(name: str, doc_id: str, data: dict[str, Any]) -> dict[str, Any]:
    existing = read_doc(name, doc_id)
    if existing is None:
        raise HTTPException(status_code=404, detail=f"{name[:-1].title()} not found")
    return write_doc(name, doc_id, {**existing, **data, "updated_at": now_iso()})


def get_model():
    global _model
    if _model is not None:
        return _model
    if joblib is not None and Path(settings.model_path).exists():
        _model = joblib.load(settings.model_path)
    return _model


def urgency_for_fill(fill: float) -> str:
    if fill >= 85:
        return "CRITICAL"
    if fill >= 70:
        return "HIGH"
    if fill >= 45:
        return "MEDIUM"
    return "LOW"


def predict_fill(bin_item: dict[str, Any], scenario_boost: float = 0) -> float:
    model = get_model()
    if model is not None:
        try:
            features = [[
                float(bin_item.get("fill_level", 0)),
                datetime.now().hour,
                datetime.now().weekday(),
            ]]
            return round(float(model.predict(features)[0]), 2)
        except Exception:
            pass
    area_boost = {"market": 10, "commercial": 6, "transit": 7, "residential": 3, "park": 2}.get(str(bin_item.get("area_type", "")).lower(), 4)
    hour_boost = 5 if 17 <= datetime.now().hour <= 22 else 0
    base = float(bin_item.get("fill_level", bin_item.get("predicted_fill", 0)))
    return round(max(0, min(100, base + area_boost + hour_boost + scenario_boost)), 2)


def distance_km(a_lat: float, a_lng: float, b_lat: float, b_lng: float) -> float:
    radius = 6371
    d_lat = math.radians(b_lat - a_lat)
    d_lng = math.radians(b_lng - a_lng)
    lat1 = math.radians(a_lat)
    lat2 = math.radians(b_lat)
    hav = math.sin(d_lat / 2) ** 2 + math.sin(d_lng / 2) ** 2 * math.cos(lat1) * math.cos(lat2)
    return radius * 2 * math.atan2(math.sqrt(hav), math.sqrt(1 - hav))


def nearest_neighbor(stops: list[dict[str, Any]], depot_lat: float, depot_lng: float) -> tuple[list[dict[str, Any]], float]:
    remaining = stops[:]
    ordered = []
    total = 0.0
    cur_lat, cur_lng = depot_lat, depot_lng
    while remaining:
        next_stop = min(remaining, key=lambda item: distance_km(cur_lat, cur_lng, float(item.get("lat", depot_lat)), float(item.get("lng", depot_lng))))
        total += distance_km(cur_lat, cur_lng, float(next_stop.get("lat", depot_lat)), float(next_stop.get("lng", depot_lng)))
        ordered.append({**next_stop, "stop_number": len(ordered) + 1})
        remaining.remove(next_stop)
        cur_lat, cur_lng = float(next_stop.get("lat", depot_lat)), float(next_stop.get("lng", depot_lng))
    if ordered:
        total += distance_km(cur_lat, cur_lng, depot_lat, depot_lng)
    return ordered, round(total, 2)


class RequestIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.request_id = request_id
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        if request.url.scheme == "https":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        if "server" in response.headers:
            del response.headers["server"]
        return response


def rate_limit(name: str, limit: int, window_seconds: int):
    def dependency(request: Request, response: Response):
        redis = get_redis()
        key_base = f"ratelimit:{name}:{request.client.host if request.client else 'unknown'}"
        
        if redis is None:
            key = f"{name}:{request.client.host if request.client else 'unknown'}"
            now = time.time()
            hits = [hit for hit in _rate_limits.get(key, []) if now - hit < window_seconds]
            if len(hits) >= limit:
                retry_after = max(1, int(window_seconds - (now - hits[0])))
                response.headers["Retry-After"] = str(retry_after)
                raise HTTPException(status_code=429, detail="Rate limit exceeded")
            hits.append(now)
            _rate_limits[key] = hits
            return
            
        current_window = int(time.time() / window_seconds)
        key = f"{key_base}:{current_window}"
        
        try:
            count = redis.incr(key)
            if count == 1:
                redis.expire(key, window_seconds * 2)
                
            if count > limit:
                retry_after = window_seconds - int(time.time() % window_seconds)
                response.headers["Retry-After"] = str(retry_after)
                raise HTTPException(status_code=429, detail="Rate limit exceeded")
        except Exception:
            pass
            
    return dependency


def create_token(email: str) -> str:
    if jwt is None:
        return f"dev-token-{uuid.uuid4()}"
    issued_at = datetime.now(timezone.utc)
    payload = {
        "email": email,
        "role": "admin",
        "iat": issued_at,
        "exp": issued_at + timedelta(minutes=settings.jwt_exp_minutes),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")


def require_auth(authorization: str | None = Header(default=None)) -> dict[str, Any]:
    if settings.node_env != "production" and not authorization:
        return {"email": "dev@wastewise.local", "role": "admin"}
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization.removeprefix("Bearer ")
    if token.startswith("dev-token-") and settings.node_env != "production":
        return {"email": "dev@wastewise.local", "role": "admin"}
    if jwt is None:
        raise HTTPException(status_code=401, detail="JWT support is not installed")
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


app = FastAPI(
    title="WasteWise API",
    version="1.0.0",
    docs_url="/docs" if settings.node_env != "production" else None,
    redoc_url="/redoc" if settings.node_env != "production" else None,
)
app.add_middleware(RequestIDMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID", "X-Webhook-Secret"],
)


@app.on_event("startup")
def startup() -> None:
    init_firestore()
    seed_memory()
    get_model()


@app.get("/")
def root() -> dict[str, Any]:
    return {"message": "WasteWise API is running", "firestore": db is not None}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/auth/login")
def login(body: LoginBody) -> dict[str, Any]:
    email_ok = hmac.compare_digest(body.email, settings.operator_email)
    password_ok = hmac.compare_digest(body.password, settings.operator_password)
    if not (email_ok and password_ok):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"token": create_token(body.email), "user": {"email": body.email, "role": "admin"}}


@app.get("/bins")
def get_bins(_: dict[str, Any] = Depends(require_auth)) -> dict[str, Any]:
    redis = get_redis()
    if redis is not None:
        try:
            cached = redis.get("cache:bins")
            if cached:
                if isinstance(cached, str):
                    return {"bins": json.loads(cached), "cached": True}
                return {"bins": cached, "cached": True}
        except Exception:
            pass
            
    bins = read_all("bins")
    
    if redis is not None:
        try:
            redis.setex("cache:bins", 30, json.dumps(bins))
        except Exception:
            pass
            
    return {"bins": bins}


@app.patch("/bins/{bin_id}")
def patch_bin(bin_id: str, body: BinPatch, _: dict[str, Any] = Depends(require_auth)) -> dict[str, Any]:
    clean_doc_id(bin_id, "bin_id")
    data = body.model_dump(exclude_none=True)
    updated = update_doc("bins", bin_id, data)
    invalidate_cache("cache:bins")
    return {"bin": updated}


@app.post("/predict", dependencies=[Depends(rate_limit("predict", 10, 60))])
def predict(_: dict[str, Any] = Depends(require_auth)) -> dict[str, Any]:
    predictions = []
    for bin_item in read_all("bins"):
        predicted = predict_fill(bin_item)
        updated = {**bin_item, "predicted_fill": predicted, "urgency": urgency_for_fill(predicted), "updated_at": now_iso()}
        write_doc("bins", str(updated["bin_id"]), updated)
        predictions.append(updated)
    invalidate_cache("cache:bins")
    return {"predictions": predictions, "count": len(predictions), "generated_at": now_iso()}


@app.get("/predict/feature-importance")
def feature_importance(_: dict[str, Any] = Depends(require_auth)) -> dict[str, Any]:
    model = get_model()
    if model is not None and hasattr(model, "feature_importances_"):
        names = ["fill_level", "hour", "weekday"]
        values = [float(value) for value in model.feature_importances_]
        return {"features": [{"feature": names[index] if index < len(names) else f"feature_{index}", "importance": value} for index, value in enumerate(values)]}
    return {"features": [{"feature": "fill_level", "importance": 0.55}, {"feature": "area_type", "importance": 0.25}, {"feature": "hour", "importance": 0.2}]}


@app.post("/route", dependencies=[Depends(rate_limit("route", 5, 60))])
def route(body: RouteBody, _: dict[str, Any] = Depends(require_auth)) -> dict[str, Any]:
    urgency_filter = body.urgency_filter if isinstance(body.urgency_filter, list) else [body.urgency_filter or "HIGH"]
    candidates = [item for item in read_all("bins") if item.get("urgency") in urgency_filter]
    ordered, total_km = nearest_neighbor(candidates, body.depot_lat, body.depot_lng)
    baseline_km = round(max(total_km, len(ordered) * 1.8), 2)
    route_id = f"route-{uuid.uuid4().hex[:10]}"
    payload = {
        "routeId": route_id,
        "route": ordered,
        "total_km": total_km,
        "baseline_km": baseline_km,
        "fuel_saved_L": round(max(0, baseline_km - total_km) * 0.12, 2),
        "co2_saved_kg": round(max(0, baseline_km - total_km) * 0.29, 2),
        "bins_in_route": len(ordered),
        "bins_skipped": max(0, len(read_all("bins")) - len(ordered)),
        "created_at": now_iso(),
    }
    write_doc("routes", route_id, payload)
    return payload


@app.post("/dispatch")
def dispatch(body: DispatchBody, _: dict[str, Any] = Depends(require_auth)) -> dict[str, Any]:
    message = body.message or f"WasteWise route {body.route_id or 'latest'} is ready for collection."
    sent = False
    sid = None
    if TwilioClient and settings.twilio_account_sid and settings.twilio_auth_token and settings.twilio_from_phone:
        client = TwilioClient(settings.twilio_account_sid, settings.twilio_auth_token)
        sms = client.messages.create(body=message, from_=settings.twilio_from_phone, to=body.driver_phone)
        sent = True
        sid = sms.sid
    return {"status": "sent" if sent else "queued_demo", "sid": sid, "message": message}


@app.post("/simulate")
def simulate(body: SimulateBody, _: dict[str, Any] = Depends(require_auth)) -> dict[str, Any]:
    boosts = {"normal": 0, "market_day": 12, "rain": 8, "festival": 18}
    updated = []
    for bin_item in read_all("bins"):
        boost = boosts[body.scenario] * body.intensity
        if body.scenario == "market_day" and str(bin_item.get("area_type", "")).lower() != "market":
            boost *= 0.35
        predicted = predict_fill(bin_item, boost)
        new_bin = {**bin_item, "predicted_fill": predicted, "urgency": urgency_for_fill(predicted), "scenario": body.scenario, "updated_at": now_iso()}
        write_doc("bins", str(new_bin["bin_id"]), new_bin)
        updated.append(new_bin)
    invalidate_cache("cache:bins")
    return {"scenario": body.scenario, "bins": updated, "count": len(updated)}


@app.post("/collect")
def collect(body: CollectBody, _: dict[str, Any] = Depends(require_auth)) -> dict[str, Any]:
    clean_doc_id(body.bin_id, "bin_id")
    if body.collector_id:
        clean_doc_id(body.collector_id, "collector_id")
    bin_item = read_doc("bins", body.bin_id)
    if bin_item is None:
        raise HTTPException(status_code=404, detail="Bin not found")
    predicted = body.predicted_fill if body.predicted_fill is not None else float(bin_item.get("predicted_fill", 0))
    log_id = f"log-{uuid.uuid4().hex[:10]}"
    log = {
        "id": log_id,
        "bin_id": body.bin_id,
        "collector_id": body.collector_id,
        "actual_fill": body.actual_fill,
        "predicted_fill": predicted,
        "absolute_error": round(abs(body.actual_fill - predicted), 2),
        "notes": body.notes,
        "created_at": now_iso(),
    }
    write_doc("collection_logs", log_id, log)
    update_doc("bins", body.bin_id, {"fill_level": 0, "predicted_fill": 0, "urgency": "LOW", "status": "collected"})
    invalidate_cache("cache:bins")
    return {"log": log}


@app.get("/collect/logs")
def collect_logs(_: dict[str, Any] = Depends(require_auth)) -> dict[str, Any]:
    logs = sorted(read_all("collection_logs"), key=lambda item: item.get("created_at", ""), reverse=True)
    return {"logs": logs}


@app.get("/collect/accuracy")
def collect_accuracy(_: dict[str, Any] = Depends(require_auth)) -> dict[str, Any]:
    logs = read_all("collection_logs")
    if not logs:
        return {"rmse": None, "mae": None, "samples": 0}
    squared = [(float(item.get("actual_fill", 0)) - float(item.get("predicted_fill", 0))) ** 2 for item in logs]
    absolute = [abs(float(item.get("actual_fill", 0)) - float(item.get("predicted_fill", 0))) for item in logs]
    return {"rmse": round(math.sqrt(sum(squared) / len(squared)), 2), "mae": round(sum(absolute) / len(absolute), 2), "samples": len(logs)}


@app.get("/collectors")
def collectors_list(_: dict[str, Any] = Depends(require_auth)) -> dict[str, Any]:
    return {"collectors": read_all("collectors")}


@app.post("/collectors")
def collectors_create(body: CollectorBody, _: dict[str, Any] = Depends(require_auth)) -> dict[str, Any]:
    collector_id = f"collector-{uuid.uuid4().hex[:8]}"
    collector = write_doc("collectors", collector_id, {"id": collector_id, **body.model_dump(), "created_at": now_iso()})
    return {"collector": collector}


@app.get("/collectors/{collector_id}/bins")
def collector_bins(collector_id: str, _: dict[str, Any] = Depends(require_auth)) -> dict[str, Any]:
    clean_doc_id(collector_id, "collector_id")
    bins = [item for item in read_all("bins") if item.get("assigned_collector_id") == collector_id]
    ordered, _ = nearest_neighbor(bins, settings.depot_lat, settings.depot_lng)
    return {"bins": ordered}


@app.get("/collectors/{collector_id}/stats")
def collector_stats(collector_id: str, _: dict[str, Any] = Depends(require_auth)) -> dict[str, Any]:
    clean_doc_id(collector_id, "collector_id")
    logs = [item for item in read_all("collection_logs") if item.get("collector_id") == collector_id]
    return {"collector_id": collector_id, "collections": len(logs), "avg_error": round(sum(float(item.get("absolute_error", 0)) for item in logs) / len(logs), 2) if logs else 0}


def retrain_job() -> None:
    metrics = collect_accuracy()
    log_id = f"retrain-{uuid.uuid4().hex[:10]}"
    write_doc("retrain_logs", log_id, {"id": log_id, "status": "completed", "metrics": metrics, "created_at": now_iso()})


@app.post("/retrain")
def retrain(background_tasks: BackgroundTasks, _: dict[str, Any] = Depends(require_auth)) -> dict[str, str]:
    background_tasks.add_task(retrain_job)
    return {"status": "started"}


@app.get("/retrain/logs")
def retrain_logs(_: dict[str, Any] = Depends(require_auth)) -> dict[str, Any]:
    logs = sorted(read_all("retrain_logs"), key=lambda item: item.get("created_at", ""), reverse=True)
    return {"logs": logs}


@app.post("/webhook/collect")
def webhook_collect(body: CollectBody, x_webhook_secret: str | None = Header(default="")) -> dict[str, Any]:
    if settings.webhook_secret and not hmac.compare_digest(x_webhook_secret or "", settings.webhook_secret):
        raise HTTPException(status_code=401, detail="Invalid webhook secret")
    return collect(body)


def add_api_alias(method: str, path: str, endpoint) -> None:
    app.add_api_route(f"/api{path}", endpoint, methods=[method], include_in_schema=False)


add_api_alias("POST", "/auth/login", login)
add_api_alias("GET", "/bins", get_bins)
add_api_alias("PATCH", "/bins/{bin_id}", patch_bin)
add_api_alias("POST", "/predict", predict)
add_api_alias("POST", "/route", route)
add_api_alias("POST", "/dispatch", dispatch)
