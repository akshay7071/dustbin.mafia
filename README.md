#  SMARTWASTE AI

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
# ⚡ React + Vite Project Template

This project is built using React + Vite for fast development with Hot Module Replacement (HMR) and modern tooling.

---

## 🚀 Features
- ⚡ Fast build with Vite
- ⚛️ React support (JSX)
- 🔥 Hot Module Replacement (HMR)
- 🧹 ESLint for clean code
- 📦 Lightweight and scalable setup

---

## 📦 Plugins

- @vitejs/plugin-react (Babel + Fast Refresh)
- @vitejs/plugin-react-swc (SWC - faster performance)

---

## 🛠️ Setup

### Install dependencies
npm install

### Run development server
npm run dev

App runs at:
http://localhost:5173/

---

## 🏗️ Build

### Production build
npm run build

### Preview build
npm run preview

---

## 📁 Folder Structure

project/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js

---

## ⚙️ ESLint
Used for code quality and consistency.

For TypeScript support:
npm install -D typescript eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

---

## ⚛️ React Compiler
Not enabled by default due to performance impact.

Docs: https://react.dev/learn/react-compiler/installation

---

## 📜 Scripts

npm run dev      → Start dev server  
npm run build    → Build for production  
npm run preview  → Preview build  
npm run lint     → Run ESLint  

---

## ❤️ Tech Stack
React • Vite • JavaScript • ESLint

---

## 📄 License
MIT License

---

Made with ❤️ using React + Vite
