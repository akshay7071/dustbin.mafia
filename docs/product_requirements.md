# Product Requirements Document
## SmartWasteRouteAI — AI-Based Waste Collection Route Optimizer
**Hackathon:** Hack-The-Gap 2.0 | MGM University IEEE × CSN Municipal Corporation
**Problem Statement:** AI-Based Waste Collection Route Optimizer
**Theme:** Public Safety & Intelligent Surveillance / Smart City

---

## 1. Executive Summary

SmartWasteRouteAI predicts which garbage bins across Chhatrapati Sambhajinagar need urgent collection and generates the most fuel-efficient pickup route for waste trucks. Instead of following fixed schedules, the system uses a Random Forest ML model trained on 278 real bins across 34 local areas to decide *which* bins to collect *when* — cutting fuel costs, preventing overflow, and giving municipal operators a live dashboard to act on.

**Win condition:** This isn't just an idea. You have real data (278 bins, 34 zones), a trained ML model, a working route optimizer, and a full-stack app with live webhooks, SMS alerts, and agent-reviewed code. That combination wins.

---

## 2. User Roles

### 2.1 Municipal Operator (Admin)
- Logs in to authority dashboard
- Views predicted fill levels across all 278 bins on a live map
- Triggers route optimization with one click
- Sees fuel savings, CO₂ estimates, time saved vs fixed route
- Receives email summary after each collection run

### 2.2 Truck Driver
- Receives optimized route via SMS (Twilio) before each shift
- Opens PWA on phone — sees stop-by-stop navigation on map
- Marks bins as collected — triggers webhook that updates Firebase
- Can report a bin as overflow (manual override)

### 2.3 System (ML Agent)
- Python Flask microservice running Random Forest predictions
- Runs on schedule (every 4 hours) or on-demand via API
- Returns bin scores, urgency flags, and route data

### 2.4 Public (Read-only)
- Views anonymized public dashboard
- Sees heatmap of high-fill zones (no bin IDs)
- Sees stats: bins collected today, CO₂ saved this week

---

## 3. Core Features

### F1 — ML Fill Prediction Engine
- **Model:** Random Forest Regressor (scikit-learn, saved as .pkl)
- **Inputs:** area_type (0/1/2), last_collected_hours, time_of_day, day_of_week
- **Output:** predicted_fill_percentage (0–100)
- **Urgency logic:**
  - fill > 90% → CRITICAL (red pin, immediate dispatch)
  - fill > 70% → HIGH (orange pin, include in today's route)
  - fill > 50% → MEDIUM (yellow, optional if route passes by)
  - fill ≤ 50% → LOW (green, skip)
- **Endpoint:** `POST /api/predict` → returns scored bin list
- **Dataset:** sambhaji_nagar_bins.csv (278 bins, 8 columns)
- **Model accuracy target:** R² > 0.82 on test split

### F2 — Route Optimization
- **Algorithm:** Nearest Neighbor (greedy TSP approximation)
- **Enhancement:** 2-opt swap for local improvement (~15% better than pure NN)
- **Input:** list of HIGH + CRITICAL bins from F1
- **Output:** ordered stop sequence with estimated distance
- **Road routing:** OpenRouteService API (free, no key for demo) or OSRM
- **Shows:** total km, estimated time, bins collected, bins skipped
- **Savings calc:** compare optimized km vs fixed-route baseline

### F3 — Live Authority Dashboard
- **Route:** `/dashboard` — JWT protected
- **Map:** Leaflet.js with OpenStreetMap tiles
  - Colored pins per urgency level (red/orange/yellow/green)
  - Heatmap layer showing density zones
  - Route polyline drawn on map after optimization
  - Click any pin → bin detail popup (area, fill%, last collected, urgency)
- **Stats panel:** total bins, critical count, route distance, fuel saved, CO₂ saved
- **Zone ranking:** top 5 highest-fill zones (from stats API)
- **One-click "Optimize Route" button** → calls predict + route API, draws result

### F4 — Driver PWA
- **Route:** `/driver` — accessible via Twilio SMS link
- **Simple stop list:** bin address, fill%, urgency badge
- **"Collected" button** per stop → PATCH /api/bins/:id → updates Firebase → broadcasts via Socket.io
- **Works offline** (service worker caches route on load)
- **GPS tracking** optional: driver location shown on admin map

### F5 — Twilio SMS Dispatch
- After route optimization, admin clicks "Dispatch to Driver"
- SMS sent to driver's registered number via Twilio
- Message includes: number of stops, start point, deep link to PWA
- Format: `"SmartWaste Route Ready: 23 bins, starting Kranti Chowk. Open: https://app/driver/route/abc123"`

### F6 — Webhooks
- **Bin collected webhook:** Driver marks stop → POST to `/webhooks/bin-collected`
  - Updates Firestore: bin.status = "collected", bin.last_collected = now()
  - Emits Socket.io event `bin_status_change` → admin map updates pin color live
- **Overflow webhook:** Driver reports overflow → POST to `/webhooks/overflow`
  - Forces bin into CRITICAL pool
  - Triggers re-optimization if route not started
  - Sends SMS alert to supervisor

### F7 — Rate Limiting (Redis)
- Redis-backed rate limiter on all API endpoints
- `/api/predict` → max 10 req/min per IP (heavy computation)
- `/api/route` → max 5 req/min per IP
- `/api/bins` → max 60 req/min per IP (real-time polling)
- Returns 429 with `Retry-After` header on breach
- Redis also used for: prediction cache (TTL 4h), session store

### F8 — Public Dashboard
- **Route:** `/public` — no auth
- Stats only: bins collected today, routes completed, CO₂ saved
- Zone heatmap (no individual bin data)
- "Last updated" timestamp, auto-refreshes every 60s
- Shareable link for press/demo

### F9 — Stats API
- `GET /api/stats` → no auth
- Returns: { total_bins, critical_count, high_count, today_collected, weekly_co2_saved, top_5_zones }
- `GET /api/stats/savings` → historical fuel/time/CO₂ savings per week

### F10 — AI Agent Team (Antigravity)
- **ML Agent:** writes and iterates on model training code
- **Route Agent:** implements and benchmarks TSP algorithms
- **Review Agent:** CodeRabbit-style PR review on every push
- **Self-improving Agent:** runs with different hyperparameters, picks best model
- All agents run in parallel via Antigravity Parallel CC

---

## 4. Pages / Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page with problem + solution |
| `/public` | Public | Anonymized stats + heatmap |
| `/login` | Public | JWT auth |
| `/dashboard` | Operator (JWT) | Full admin map + route optimizer |
| `/driver` | Driver (SMS link) | PWA stop-by-stop route |
| `/analytics` | Operator (JWT) | Historical savings charts |

---

## 5. Non-Functional Requirements

- Dashboard loads in < 3 seconds
- ML prediction for 278 bins < 500ms
- Route optimization for 50 bins < 200ms
- Socket.io event delivery < 500ms
- Rate limiting prevents API abuse
- Firebase offline persistence for driver PWA
- All routes return proper HTTP status codes

---

## 6. Dataset Analysis (sambhaji_nagar_bins.csv)

| Metric | Value |
|---|---|
| Total bins | 278 |
| Areas | 34 |
| Zone types | Residential (191), Commercial (65), Industrial (22) |
| Avg fill % | 61.5% |
| Fill range | 6% – 99% |
| Avg commercial fill | 72% (highest — collect most often) |
| Avg residential fill | 59.6% |
| Avg industrial fill | 47.3% (lowest — collect least often) |
| Avg hours since collection (commercial) | 15.2 hrs |
| Avg hours since collection (industrial) | 32.1 hrs |
| Busiest day | Monday (51 readings) |

### Model Flaws Identified & Fixed

| Previous ChatGPT Plan Flaw | Fix Applied |
|---|---|
| Only used hour, day, previous fill as inputs | Added area_type (0/1/2) as key feature — commercial bins fill 12% faster |
| No feature encoding described | Label encode area_type, include as categorical int |
| No baseline comparison | Compare RF vs Linear Regression vs Gradient Boosting |
| No cross-validation | 5-fold CV on training set, evaluate with R² + MAE |
| "previous fill %" as input doesn't exist in CSV | Use last_collected_hours as proxy for fill accumulation |
| No cooldown logic | Add 4-hour prediction cache in Redis |
| Route was "Nearest Neighbor OR Map API" | Use NN + 2-opt improvement, then ORS for road-snapped polyline |

---

## 7. Out of Scope (MVP)

- IoT bin sensors (simulated via CSV)
- Multi-truck routing (single truck for MVP)
- Automated scheduled dispatch (manual trigger for demo)
- Payment / penalty system
