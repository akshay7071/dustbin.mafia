# Technology, Architecture & Implementation Guide
## SmartWasteRouteAI

---

## 1. Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| ML Model | scikit-learn RandomForestRegressor | 1.3+ | Fill level prediction |
| ML Serving | Python Flask | 3.1 | REST microservice for model |
| Optimization | Python (custom) | 3.11+ | NN + 2-opt route algorithm |
| Road Routing | OpenRouteService API | free | Actual road geometry |
| Backend Runtime | Node.js | 20 LTS | Main API server |
| Backend Framework | Express.js | 4.x | REST API |
| Real-time | Socket.io | 4.x | Live map + driver updates |
| Database | Firebase Firestore | Latest | Bin state + route history |
| Auth | Firebase Auth + JWT | - | Operator login |
| Cache / Rate limit | Redis (upstash free) | 7.x | Prediction cache, rate limiting |
| File Store | Firebase Storage | - | Route exports, reports |
| SMS | Twilio | 4.x | Driver dispatch |
| Email | Nodemailer (Gmail) | 6.x | Operator summary |
| Frontend | React | 18 | Dashboard + Driver PWA |
| State | Redux Toolkit | 2.x | Global state (bins, route) |
| Styling | Tailwind CSS | 3.x | UI |
| Maps | Leaflet.js | 1.9 | Route map |
| Heatmap | leaflet.heat | 0.2 | Fill density |
| Charts | Chart.js | 4.x | Savings analytics |
| HTTP Client | Axios | 1.x | API calls |
| Build | Vite | 5.x | Dev + production build |
| PWA | vite-plugin-pwa | - | Driver offline app |
| Agent IDE | Antigravity | latest | Parallel CC + agents |
| Code Review | CodeRabbit | - | Automated PR review |

---

## 2. Project Folder Structure

```
smartwaste/
├── ml/
│   ├── train_model.py          # Random Forest training script
│   ├── predict.py              # Flask microservice (POST /predict, POST /route)
│   ├── route_optimizer.py      # Nearest Neighbor + 2-opt algorithm
│   ├── evaluate_model.py       # Cross-validation + metrics comparison
│   ├── requirements.txt
│   └── models/
│       └── fill_model.pkl      # Trained model (auto-generated)
│
├── backend/
│   ├── server.js               # Express + Socket.io entry
│   ├── .env
│   ├── package.json
│   ├── config/
│   │   ├── firebase.js         # Firebase Admin SDK init
│   │   └── redis.js            # Upstash Redis client
│   ├── middleware/
│   │   ├── auth.js             # JWT verify
│   │   └── rateLimit.js        # Redis-backed rate limiter
│   ├── routes/
│   │   ├── auth.js             # POST /api/auth/login
│   │   ├── bins.js             # GET /api/bins, PATCH /api/bins/:id
│   │   ├── predict.js          # POST /api/predict (calls ML service)
│   │   ├── route.js            # POST /api/route (calls ML service)
│   │   ├── stats.js            # GET /api/stats
│   │   └── dispatch.js         # POST /api/dispatch (Twilio SMS)
│   ├── webhooks/
│   │   ├── binCollected.js     # POST /webhooks/bin-collected
│   │   └── overflow.js         # POST /webhooks/overflow
│   └── utils/
│       ├── mailer.js           # Nodemailer summaries
│       ├── twilio.js           # SMS dispatch
│       └── savings.js          # Fuel/CO2 calculation helpers
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── socket.js
│       ├── store/
│       │   ├── index.js        # Redux store
│       │   ├── binsSlice.js    # Bin state + predictions
│       │   └── routeSlice.js   # Optimized route state
│       ├── api/
│       │   └── axios.js
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── pages/
│       │   ├── Landing.jsx
│       │   ├── Login.jsx
│       │   ├── Dashboard.jsx       # Admin: map + optimizer
│       │   ├── Analytics.jsx       # Historical savings
│       │   ├── Driver.jsx          # PWA stop list
│       │   └── Public.jsx          # Public heatmap
│       └── components/
│           ├── Navbar.jsx
│           ├── BinMap.jsx          # Leaflet map with colored pins
│           ├── RoutePanel.jsx      # Optimize button + route stats
│           ├── StatsBar.jsx        # Summary numbers
│           ├── ZoneRanking.jsx     # Top 5 fill zones
│           ├── DriverStop.jsx      # Single stop card
│           ├── SavingsChart.jsx    # Chart.js line chart
│           └── ProtectedRoute.jsx
│
└── .antigravity/
    └── tasks/
        ├── ml-agent.yaml          # ML training + eval task
        ├── route-agent.yaml       # Route algorithm task
        ├── review-agent.yaml      # Code review task
        └── selfimprove-agent.yaml # Hyperparameter search task
```

---

## 3. Backend API Endpoints

### Auth
```
POST /api/auth/login
  Body: { email, password }
  Response: { token, user }
```

### Bins
```
GET /api/bins
  Auth: JWT
  Response: { bins: [...all 278 with current status] }

PATCH /api/bins/:id
  Auth: JWT or webhook secret
  Body: { status: "collected" | "overflow", collected_at: ISO }
  Response: { success: true, bin }
  Side effects: Socket.io "bin_status_change", Firestore update
```

### Predict (calls Python ML service)
```
POST /api/predict
  Auth: JWT
  Rate limit: 10/min per IP (Redis)
  Body: { bins: [...] } OR {} to use all bins from Firestore
  Response: { predictions: [{ bin_id, predicted_fill, urgency, lat, lng }] }
  Cache: Redis TTL 4h (skip ML call if cached)
```

### Route (calls Python ML service)
```
POST /api/route
  Auth: JWT
  Rate limit: 5/min per IP (Redis)
  Body: { depot_lat, depot_lng, urgency_filter: "HIGH" | "CRITICAL" }
  Response: {
    route: [{ bin_id, stop_order, lat, lng, fill%, urgency }],
    total_km: 18.4,
    estimated_minutes: 92,
    bins_skipped: 134,
    baseline_km: 42.0,
    fuel_saved_L: 2.7,
    co2_saved_kg: 6.1
  }
```

### Stats
```
GET /api/stats
  No auth
  Response: {
    total_bins: 278,
    critical: 12, high: 45, medium: 89, low: 132,
    today_collected: 23,
    weekly_co2_kg: 48.3,
    top_5_zones: [{ zone, avg_fill, bin_count }]
  }
```

### Dispatch
```
POST /api/dispatch
  Auth: JWT
  Body: { driver_phone, route_id }
  Response: { sms_sid, message_preview }
  Side effects: Twilio SMS to driver
```

### Webhooks
```
POST /webhooks/bin-collected
  Secret: X-Webhook-Secret header
  Body: { bin_id, driver_id, collected_at }
  Response: { success: true }
  Side effects: Firestore update + Socket.io emit

POST /webhooks/overflow
  Secret: X-Webhook-Secret header
  Body: { bin_id, driver_id, reported_at }
  Response: { success: true }
  Side effects: Firestore CRITICAL flag + re-notify supervisor
```

---

## 4. Python ML Service (Flask)

### train_model.py (run once before hackathon demo)
```python
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_absolute_error, r2_score
import pickle, json

df = pd.read_csv("../data/sambhaji_nagar_bins.csv")

# Features: area_type encodes zone (0=residential, 1=commercial, 2=industrial)
# last_collected_hours is the best proxy for current fill level
# time_of_day and day_of_week capture waste generation patterns
FEATURES = ["area_type", "last_collected_hours", "time_of_day", "day_of_week"]
TARGET = "fill_percentage"

X = df[FEATURES]
y = df[TARGET]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Compare three models
models = {
    "RandomForest": RandomForestRegressor(n_estimators=200, max_depth=10, random_state=42),
    "GradientBoosting": GradientBoostingRegressor(n_estimators=100, random_state=42),
    "LinearRegression": LinearRegression()
}

results = {}
for name, model in models.items():
    cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring="r2")
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    results[name] = {
        "cv_r2_mean": cv_scores.mean().round(4),
        "cv_r2_std": cv_scores.std().round(4),
        "test_r2": r2_score(y_test, y_pred).round(4),
        "test_mae": mean_absolute_error(y_test, y_pred).round(2)
    }

print(json.dumps(results, indent=2))

# Save best model (Random Forest wins)
best = RandomForestRegressor(n_estimators=200, max_depth=10, random_state=42)
best.fit(X_train, y_train)
with open("models/fill_model.pkl", "wb") as f:
    pickle.dump(best, f)

print("\nFeature importances:")
for feat, imp in zip(FEATURES, best.feature_importances_):
    print(f"  {feat}: {imp:.3f}")
```

### predict.py (Flask service)
```python
from flask import Flask, request, jsonify
import pickle, numpy as np, math

app = Flask(__name__)

with open("models/fill_model.pkl", "rb") as f:
    model = pickle.load(f)

URGENCY = lambda fill: (
    "CRITICAL" if fill > 90 else
    "HIGH"     if fill > 70 else
    "MEDIUM"   if fill > 50 else "LOW"
)

@app.route("/predict", methods=["POST"])
def predict():
    bins = request.json.get("bins", [])
    features = [[b["area_type"], b["last_collected_hours"],
                  b["time_of_day"], b["day_of_week"]] for b in bins]
    preds = model.predict(features)
    result = []
    for b, fill in zip(bins, preds):
        result.append({
            "bin_id": b["bin_id"],
            "predicted_fill": round(float(fill), 1),
            "urgency": URGENCY(fill),
            "lat": b["lat"], "lng": b["lng"],
            "area": b["area"]
        })
    return jsonify({"predictions": result})

@app.route("/route", methods=["POST"])
def route():
    data = request.json
    bins = [b for b in data["bins"] if b["urgency"] in ("HIGH", "CRITICAL")]
    depot = {"lat": data["depot_lat"], "lng": data["depot_lng"]}

    # Nearest Neighbor
    unvisited = bins[:]
    route = []
    current = depot
    while unvisited:
        nearest = min(unvisited, key=lambda b: haversine(current, b))
        route.append(nearest)
        current = nearest
        unvisited.remove(nearest)

    # 2-opt improvement
    route = two_opt(route)

    total_km = sum(haversine(route[i], route[i+1]) for i in range(len(route)-1))
    total_km += haversine(depot, route[0]) + haversine(route[-1], depot)
    baseline_km = len(bins) * 1.8  # fixed-route avg per bin

    return jsonify({
        "route": [{"bin_id": b["bin_id"], "stop": i+1,
                   "lat": b["lat"], "lng": b["lng"],
                   "fill": b["predicted_fill"], "urgency": b["urgency"]}
                  for i, b in enumerate(route)],
        "total_km": round(total_km, 1),
        "baseline_km": round(baseline_km, 1),
        "fuel_saved_L": round((baseline_km - total_km) * 0.12, 1),
        "co2_saved_kg": round((baseline_km - total_km) * 0.12 * 2.26, 1),
        "bins_in_route": len(route),
        "bins_skipped": len(data["bins"]) - len(route)
    })

def haversine(a, b):
    R = 6371
    lat1, lon1, lat2, lon2 = map(math.radians, [a["lat"], a["lng"], b["lat"], b["lng"]])
    dlat, dlon = lat2-lat1, lon2-lon1
    h = math.sin(dlat/2)**2 + math.cos(lat1)*math.cos(lat2)*math.sin(dlon/2)**2
    return 2*R*math.asin(math.sqrt(h))

def two_opt(route):
    best = route[:]
    improved = True
    while improved:
        improved = False
        for i in range(len(best)-1):
            for j in range(i+2, len(best)):
                new = best[:i+1] + best[i+1:j+1][::-1] + best[j+1:]
                if total_dist(new) < total_dist(best):
                    best = new
                    improved = True
    return best

def total_dist(route):
    return sum(haversine(route[i], route[i+1]) for i in range(len(route)-1))

if __name__ == "__main__":
    app.run(port=5001, debug=False)
```

---

## 5. Redux State Shape

```javascript
// store/binsSlice.js
{
  bins: [],              // all 278 bins with current status
  predictions: [],       // ML-predicted fills + urgency
  loading: false,
  lastPredicted: null    // timestamp of last ML run
}

// store/routeSlice.js
{
  route: [],             // ordered stop list
  stats: {
    total_km: 0,
    baseline_km: 0,
    fuel_saved_L: 0,
    co2_saved_kg: 0,
    bins_in_route: 0,
    bins_skipped: 0
  },
  dispatched: false,
  loading: false
}
```

---

## 6. Redis Usage

```javascript
// config/redis.js - Upstash Redis (free tier, works from serverless)
import { Redis } from "@upstash/redis";
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

// Rate limiting middleware
export async function rateLimit(key, maxReq, windowSec) {
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, windowSec);
  return count <= maxReq;
}

// Prediction cache
export async function getCachedPrediction() {
  return redis.get("prediction:latest");
}
export async function setCachedPrediction(data) {
  return redis.set("prediction:latest", JSON.stringify(data), { ex: 14400 }); // 4hr TTL
}
```

---

## 7. Environment Variables (.env)

```bash
PORT=5000
ML_SERVICE_URL=http://localhost:5001

# Firebase
FIREBASE_PROJECT_ID=smartwaste-xxx
FIREBASE_CLIENT_EMAIL=xxx
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_STORAGE_BUCKET=smartwaste-xxx.appspot.com

# JWT
JWT_SECRET=your_64_char_hex_here
JWT_EXPIRES_IN=8h

# Redis (Upstash free tier)
UPSTASH_REDIS_URL=https://xxx.upstash.io
UPSTASH_REDIS_TOKEN=xxx

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxx
TWILIO_PHONE_FROM=+1xxxxxxxxxx
DRIVER_PHONE_DEFAULT=+91xxxxxxxxxx

# Webhooks
WEBHOOK_SECRET=your_webhook_secret_here

# Email
GMAIL_USER=youremail@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
OPERATOR_EMAIL=operator@example.com
```

---

## 8. Socket.io Events

| Event | Direction | Payload | Trigger |
|---|---|---|---|
| `bin_status_change` | Server→Client | `{ bin_id, status, collected_at }` | Bin marked collected |
| `prediction_ready` | Server→Client | `{ predictions, urgency_counts }` | ML run complete |
| `route_ready` | Server→Client | `{ route, stats }` | Route optimization done |
| `overflow_alert` | Server→Client | `{ bin_id, area, reported_by }` | Driver reports overflow |

---

## 9. Firebase Firestore Schema

```
Collection: bins
  Document: {bin_id}
    bin_id: string
    city: string
    area: string
    area_type: 0 | 1 | 2
    lat: number
    lng: number
    status: "pending" | "collected" | "overflow"
    last_collected_at: timestamp
    predicted_fill: number (updated by ML)
    urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
    updatedAt: timestamp

Collection: routes
  Document: {route_id}
    created_at: timestamp
    stops: [{ bin_id, stop_order, collected: bool, collected_at }]
    stats: { total_km, fuel_saved_L, co2_saved_kg }
    dispatched: bool
    driver_phone: string

Collection: savings_history
  Document: {date}
    date: string
    routes_completed: number
    bins_collected: number
    total_km: number
    fuel_saved_L: number
    co2_saved_kg: number
```

---

## 10. React Router

```jsx
<Routes>
  <Route path="/"          element={<Landing />} />
  <Route path="/public"    element={<Public />} />
  <Route path="/login"     element={<Login />} />
  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
  <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
  <Route path="/driver"    element={<Driver />} />
</Routes>
```

---

## 11. Package Dependencies

### Backend
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.6.1",
    "firebase-admin": "^12.0.0",
    "@upstash/redis": "^1.28.0",
    "jsonwebtoken": "^9.0.2",
    "nodemailer": "^6.9.4",
    "twilio": "^4.18.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "axios": "^1.5.0",
    "express-rate-limit": "^7.1.5"
  }
}
```

### Frontend
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.16.0",
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0",
    "axios": "^1.5.0",
    "socket.io-client": "^4.6.1",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "react-hot-toast": "^2.4.1",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0"
  },
  "devDependencies": {
    "vite-plugin-pwa": "^0.17.0"
  }
}
```

### Python
```
flask==3.0.0
scikit-learn==1.3.2
pandas==2.1.0
numpy==1.24.4
requests==2.31.0
gunicorn==21.2.0
```
