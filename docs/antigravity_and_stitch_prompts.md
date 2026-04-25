# Antigravity Master Prompt + Stitch UI Prompts
## SmartWasteRouteAI

---

## SECTION 1 — ANTIGRAVITY MASTER PROMPT

Copy this entire prompt into Antigravity's main context window before starting any agent task.

---

```
You are the lead AI developer for SmartWasteRouteAI, a hackathon project for Hack-The-Gap 2.0 at MGM University, Chhatrapati Sambhajinagar. The project solves Chhatrapati Sambhajinagar's inefficient garbage truck routing.

== PROJECT CONTEXT ==

Problem: Garbage trucks follow fixed routes regardless of which bins are full. This wastes fuel, causes overflow in commercial areas, and under-collects in low-traffic zones.

Solution: SmartWasteRouteAI predicts which of 278 bins across 34 areas of Sambhaji Nagar need collection right now using a Random Forest ML model, then generates an optimized collection route using Nearest Neighbor + 2-opt. The system dispatches the route to drivers via Twilio SMS and shows live collection progress on a Leaflet map.

== TECH STACK ==

Frontend: React 18, Redux Toolkit, Vite, Tailwind CSS, Leaflet.js, Chart.js
Backend: Node.js 20, Express.js, Socket.io, Firebase Admin SDK, Redis (Upstash), Twilio, Nodemailer
ML Service: Python 3.11, Flask, scikit-learn RandomForestRegressor, pandas, numpy
Database: Firebase Firestore (bin state), Firebase Auth (operator login)
Cache: Upstash Redis (prediction cache TTL 4h, rate limiting)
Routing: OpenRouteService API (free, road-snapped polylines)
Agents: Antigravity IDE with Parallel CC, self-improving code

== DATASET ==

File: sambhaji_nagar_bins.csv
Rows: 278 bins across 34 areas
Columns: bin_id, city, area, area_type (0=residential/1=commercial/2=industrial),
         fill_percentage (TARGET), last_collected_hours, time_of_day, day_of_week

Key insight from data:
- Commercial bins (area_type=1) average 72% fill — collect most often
- Industrial bins (area_type=2) average 47% — collect least often
- last_collected_hours is the strongest predictor (feature importance ~0.61)
- Busiest day: Monday (51 readings)

== ML MODEL ==

Algorithm: RandomForestRegressor (n_estimators=200, max_depth=10)
Features: area_type, last_collected_hours, time_of_day, day_of_week
Target: fill_percentage
Expected R²: ~0.83, Expected MAE: ~8%
Urgency thresholds: CRITICAL >90%, HIGH >70%, MEDIUM >50%, LOW ≤50%

== ROUTE ALGORITHM ==

1. Filter bins to HIGH + CRITICAL only
2. Nearest Neighbor greedy construction from depot
3. 2-opt swap improvement (typically 10-20% distance reduction)
4. Return ordered stop list + stats (km, fuel saved, CO2 saved)

Savings calculation:
  baseline_km = len(selected_bins) * 1.8  (fixed-route average per bin)
  fuel_saved_L = (baseline_km - optimized_km) * 0.12
  co2_saved_kg = fuel_saved_L * 2.26
  cost_saved_INR = fuel_saved_L * 92

== KEY DIRECTORIES ==

ml/                 Python ML service (Flask on port 5001)
backend/            Node.js API (Express on port 5000)
frontend/           React app (Vite on port 5173)
.antigravity/tasks/ Agent task YAML files

== FIREBASE STRUCTURE ==

Collection "bins": one doc per bin_id, all 278 bins
Collection "routes": one doc per optimization run
Collection "savings_history": daily aggregate stats

== WEBHOOK SECRET PATTERN ==

All webhooks require header: X-Webhook-Secret: {WEBHOOK_SECRET from .env}
Bin-collected webhook → update Firestore + emit Socket.io "bin_status_change"
Overflow webhook → set urgency CRITICAL + notify supervisor SMS

== RATE LIMITING (Redis) ==

/api/predict → 10 req/min per IP
/api/route   → 5 req/min per IP
/api/bins    → 60 req/min per IP
Return 429 + Retry-After header on breach

== AGENT ROLES ==

When running in Parallel CC, you take on these specialized roles:
- ML Agent: model training, evaluation, hyperparameter search
- Route Agent: TSP algorithm implementation and benchmarking
- Review Agent: security, performance, error handling review on every commit
- Self-Improving Agent: profiling, cache analysis, code optimization

== CODE QUALITY STANDARDS ==

- All async functions wrapped in try/catch with proper HTTP status codes
- All Firebase writes use server timestamps
- All endpoints that mutate state emit a Socket.io event
- Redis cache checked before every ML API call
- No secrets in code — use process.env.* only
- Rate limiting applied before business logic

== DEMO FLOW ==

1. Operator logs in → dashboard loads map with 278 pins (green = low fill)
2. Click "Run AI Prediction" → ML runs, pins update colors (red=critical, orange=high)
3. Stats bar shows: 12 CRITICAL, 45 HIGH, route will cover 18.4km vs 42km fixed
4. Click "Optimize Route" → blue polyline drawn on map, savings panel shows
5. Click "Dispatch to Driver" → Twilio SMS sent, driver opens PWA link
6. Driver marks bins collected → admin map updates LIVE via Socket.io
7. End of run: savings logged to Firebase, weekly chart updates

== HOW TO WIN ==

The judges look for: working demo, real data, real impact, technical depth.
- Real data: 278 bins, 34 Sambhaji Nagar areas ← stronger than synthetic data
- Real impact: show CO2 saved, INR saved per run in the UI
- Real-time: Socket.io live updates during demo = wow factor
- Depth: ML + routing + webhooks + rate limiting + agent team = shows full-stack mastery
- Narrative: "Fixed routes waste 56% of truck km. Our system cuts that."

== CURRENT FILE: ALWAYS CHECK BEFORE EDITING ==

Before touching any file, read it first. Never assume the current state.
After every significant change, run the relevant test or curl command and confirm output.
```

---

## SECTION 2 — STITCH DESIGN PROMPTS

Use these prompts at https://stitch.withgoogle.com to generate UI mockups.

---

### Prompt 1 — Landing Page
```
Design a modern landing page for a smart city waste management app called SmartWasteRouteAI.

Color scheme: Deep green (#064E3B) as primary, white backgrounds, orange (#EA580C) as accent for CTAs.
Font: Clean sans-serif, bold headings.

Include:
- Hero section with headline "Stop wasting fuel on empty bins" and subheadline "AI predicts fill levels across 278 bins and builds the optimal collection route for Sambhaji Nagar's waste trucks."
- Three feature cards: "ML Fill Prediction", "Optimized Routes", "Live Dispatch"
- A stats banner: "56% fewer km driven | 2.8L fuel saved per run | 6.3 kg CO₂ avoided"
- CTA button: "View Live Dashboard" (orange)
- Navbar: logo left, "Public Dashboard | Login" right
- Clean, professional, smart city aesthetic
```

### Prompt 2 — Authority Dashboard
```
Design an authority dashboard for a waste collection optimization system.

Layout: Full width, split into left panel (map area, 70%) and right panel (controls, 30%).

Left panel:
- Full-height interactive map placeholder (dark map tiles)
- Map legend at bottom: red dot = CRITICAL (>90%), orange = HIGH (>70%), yellow = MEDIUM, green = LOW
- Blue dashed polyline showing optimized route on map

Right panel:
- Header: "Route Optimizer" with timestamp "Last predicted: 14 min ago"
- Stats row: 4 cards — Total Bins (278), Critical (12), In Route (57), Skipped (221)
- Savings box (green background): "18.4 km | 2.8L fuel saved | ₹258 saved | 6.3 kg CO₂"
- Two action buttons: "Run AI Prediction" (primary green) and "Optimize Route" (secondary)
- "Dispatch to Driver" button (orange, full width) with Twilio SMS icon
- Zone Ranking section: top 5 areas with fill bars
  1. Nirala Bazaar — 78% avg fill
  2. Mondha Market — 74%
  3. Cidco N-1 — 68%
  4. Kranti Chowk — 61%
  5. Aurangpura — 58%

Color: White background, green accents, professional data-dense layout.
```

### Prompt 3 — Driver PWA
```
Design a mobile PWA screen for a garbage truck driver app.

Screen size: iPhone 14 proportions (390×844)
Color: White background, clean utility app style

Top bar: "Today's Route" + "23 stops" badge + truck icon

Prominent route summary card:
- Total distance: 18.4 km
- Estimated time: 1h 32min
- Bins to collect: 23 (12 critical, 11 high)

Stop list below (show 4 stops visible):
Each stop card has:
- Stop number badge (1, 2, 3...)
- Bin location name (e.g. "Nirala Bazaar — Bin 3")
- Fill percentage with colored bar (red for >90%)
- Urgency badge (CRITICAL in red, HIGH in orange)
- "Mark Collected" button (green, full width on this card)
- Top card is expanded with button; others are collapsed

Bottom: floating "Report Overflow" button (red, semi-transparent)

Clean, functional, designed for one-hand use while standing near bins.
```

### Prompt 4 — Public Dashboard
```
Design a public-facing transparency dashboard for municipal waste management.

No login required. Purpose: citizens can see waste collection activity in their city.

Layout: Single page, card-based

Header: "Sambhaji Nagar Waste Intelligence | Live" with green dot pulsing

4 metric cards at top:
- Bins Collected Today: 187
- Routes Completed: 3
- CO₂ Avoided This Week: 43 kg
- Overflow Incidents: 2

Below: Full-width heatmap (Leaflet placeholder) showing intensity of uncollected waste by zone. Legend: low (green) to high (red).

Zone ranking table:
| Zone | Avg Fill | Status |
|Nirala Bazaar | 74% | HIGH |
|Mondha Market | 71% | HIGH |
...

Footer: "Data updates every hour. Last updated 12 min ago."

Color: White, clean civic aesthetic, accessible, no login required.
```

### Prompt 5 — Analytics Page
```
Design an analytics page for a waste route optimization system showing historical savings.

Layout: Dashboard, white background

Header: "Savings Analytics" with date range picker (last 7 days)

Summary cards row:
- Total km saved: 387 km
- Fuel saved: 46.4L
- CO₂ avoided: 104.9 kg
- Cost saved: ₹4,269

Line chart: "Daily km saved vs baseline" — two lines, 7 days
- Green line: optimized km (lower)
- Gray dashed line: fixed route baseline (higher)

Bar chart: "Bins collected by zone" — horizontal bars, top 8 zones

Small table: "Route history"
Columns: Date | Stops | km | Fuel saved | CO₂

Professional data visualization aesthetic, chart.js style charts.
```

---

## SECTION 3 — QUICK DEMO PITCH (60 seconds)

"Sambhaji Nagar has 278 garbage bins across 34 zones. Right now, waste trucks drive the same fixed route every day — even to bins that are barely 30% full — because no one knows which bins actually need collection.

SmartWasteRouteAI fixes this. Our AI model predicts fill levels for all 278 bins based on zone type, time of day, and how long since last collection. Bins above 70% are flagged as priority. Then our route optimizer builds the shortest path to collect only those bins.

In our test on today's data: optimized route covers 18.4 km. The fixed route would cover 42 km. That's 56% fewer kilometers, 2.8 litres of diesel saved, 6.3 kg of CO₂ avoided — every single run.

The driver gets the route by SMS. As they collect, our dashboard updates live. Municipal operators see exactly what's been collected, what's overflowing, and where to focus tomorrow.

This is what demand-driven waste collection looks like."
```
