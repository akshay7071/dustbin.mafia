# WasteWise API

WasteWise is a smart waste management backend built with **FastAPI**. It leverages Machine Learning to predict bin fill levels and provides optimized collection routes to improve urban sanitation efficiency.

---

## Features

* **Fill Level Prediction:** Uses a cached Python ML model when present, with a deterministic heuristic fallback for demos.
* **Route Optimization:** Implements a Nearest Neighbor route for high/critical bins.
* **Firestore First:** Uses Firebase Firestore when credentials are available, otherwise runs from seeded in-memory demo data.
* **Security:** Restricted CORS, timing-safe login checks, document ID validation, security headers, request IDs, JWT `iat`, docs hidden in production, and rate limits on heavy endpoints.

---

## Local Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The API defaults to `http://localhost:8000`. Login defaults are `admin@wastewise.com` / `Admin@1234` unless overridden in `backend/.env`.

## Project Structure

```text
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── requirements.txt     # Python dependencies
│   └── scripts/seed_bins.py # Optional Firestore seeding helper
├── frontend/                # Vite React app
└── ml/                      # Legacy ML placeholder
