# Deployment Guide

This document provides step-by-step instructions to deploy the TrueSight platform to production using **Render** for the backend and **Vercel** for the frontend.

---

## 1. Backend Deployment (Render)

We will deploy the FastAPI backend using Render's Web Service.

### Steps
1. Create an account on [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository: `Tanish-30-08-2006/Fake-Product-Review-Detection`.
4. Configure the service:
   - **Name**: `truesight-backend`
   - **Root Directory**: `backend` *(Critical: Must be set to backend)*
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click **Create Web Service**.

### Environment Variables
In the Render dashboard, go to the **Environment** tab and add:
- `PYTHON_VERSION`: `3.10.x` (Ensures compatibility with scikit-learn and SHAP)

### CORS Configuration
Once deployed, Render will provide a URL (e.g., `https://truesight-backend.onrender.com`).
Update the `allow_origins` in `backend/main.py` from `["*"]` to the Vercel frontend URL once you have it.

### Troubleshooting
- **Model File Errors**: Ensure `models/final_gradient_boost_model.pkl` is committed and pushed to GitHub. Git LFS might be needed if the model exceeds 100MB, but Gradient Boosting models are usually small.
- **Out of Memory (OOM)**: SHAP can consume significant memory. If Render's free tier fails, try disabling the SHAP explainer temporarily to isolate the issue.

---

## 2. Frontend Deployment (Vercel)

We will deploy the React application using Vercel.

### Steps
1. Create an account on [Vercel](https://vercel.com/).
2. Click **Add New** > **Project**.
3. Import your GitHub repository.
4. Configure the project:
   - **Project Name**: `truesight-dashboard`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` *(Critical)*
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.

### Environment Variables
Before deploying, add the following Environment Variable in the Vercel settings:
- `VITE_API_URL`: The URL of your Render backend (e.g., `https://truesight-backend.onrender.com`).

*(Note: Currently `API_URL` is hardcoded in `Dashboard.jsx` and `ModelPerformance.jsx` as `http://localhost:8000` for development. You should update those files to use `import.meta.env.VITE_API_URL || 'http://localhost:8000'` before production).*

### Troubleshooting
- **Blank Page on Refresh**: Vite handles routing via `react-router-dom`. In production, you may need a `vercel.json` file in the `frontend` directory with rewrites to handle client-side routing.
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
- **CORS Errors**: If the frontend cannot fetch data, double-check that the Render backend `main.py` allows your Vercel URL in its `allow_origins` array.
