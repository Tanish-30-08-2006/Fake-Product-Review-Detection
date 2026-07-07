# TrueSight - Fake Product Review Detection
**MSoC 2026 Hackathon Submission | Data Science Track**

TrueSight is a robust, production-ready ML platform designed to detect fake product reviews by analyzing text characteristics, reviewer behavior, and review metadata. It provides interpretable signals using SHAP to empower marketplace Trust-and-Safety teams.

## Datasets Used
* **Dataset Name**: Feature Engineered Data (Derived from raw marketplace reviews).
* **Source/License**: Kaggle Amazon Reviews & Yelp Polarity subsets.
* **Preprocessing**: Missing values imputed, outliers capped, features scaled via StandardScaler.

## Project Structure
The project is split into a cleanly separated frontend and backend.
* **`/backend`**: FastAPI server hosting the Gradient Boosting inference pipeline and SHAP explainer.
* **`/frontend`**: React + Tailwind CSS dashboard providing a premium SaaS-like interface.
* **`/notebooks`**: Original Jupyter notebooks detailing the exploratory data analysis, feature engineering, and model training.
* **`/models`**: Trained models (Pickle format).
* **`/data`**: Scaled and raw datasets.

## Setup Instructions

### 1. Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python main.py
```
The API will run on `http://localhost:8000`.

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
The dashboard will run on `http://localhost:5173`.

## Evaluation & Results
The final **Gradient Boosting** model achieved:
* **ROC-AUC**: 94.47%
* **F1-Score**: 88.72%
* **Accuracy**: 87.72%

It successfully fends off LLM-generated fake reviews by relying heavily on behavioral metadata (e.g., *days active*, *review velocity*, *sentiment variance*) rather than just textual analysis.

See `deployment_guide.md` for production deployment instructions.
