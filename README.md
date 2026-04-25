# WasteWise API 🚀

WasteWise is a smart waste management backend built with **FastAPI**. It leverages Machine Learning to predict bin fill levels and provides optimized collection routes to improve urban sanitation efficiency.

---

## 🛠 Features

* **Fill Level Prediction:** Uses a Random Forest/Gradient Boosting approach to predict how full a bin is based on historical patterns, area type, and time.
* **Route Optimization:** Implements a Nearest Neighbor algorithm to sequence collections for "Urgent" bins (those exceeding 70% fill capacity).
* **Automated Scaling:** Integrates Scikit-learn scalers and encoders to ensure data consistency during inference.

---

## 📂 Project Structure

```text
├── app/
│   ├── main.py          # FastAPI application entry point
│   ├── ml/
│   │   └── predictor.py # Model loading and prediction logic
│   └── routers/
│       ├── predict.py   # Endpoint for individual bin analysis
│       └── route.py     # Endpoint for route optimization
├── models/              # Pre-trained .pkl files (Model, Scaler, Encoder)
└── requirements.txt     # Python dependencies
