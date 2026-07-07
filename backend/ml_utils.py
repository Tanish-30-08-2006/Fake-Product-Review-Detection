import os
import joblib
import pandas as pd
import numpy as np
import shap
from sklearn.preprocessing import StandardScaler

# Define features used by the model
FEATURES = [
    'rating', 'reviewUsefulCount', 'friendCount', 'reviewCount', 'firstCount', 
    'usefulCount', 'complimentCount', 'tipCount', 'restaurantRating', 
    'ReviewLength', 'review_year', 'sentiment_score', 'reviewer_sentiment_var', 
    'lexical_diversity_ttr', 'capitalization_ratio', 'location_entropy', 
    'days_active', 'review_velocity', 'restaurant_rating_var', 
    'avg_word_length', 'has_friends', 'has_useful_votes'
]

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'final_gradient_boost_model.pkl')
DATA_PATH = os.path.join(BASE_DIR, 'data', 'feature_engineered_data.csv')

# Global state
model = None
scaler = None
explainer = None

def initialize_ml():
    global model, scaler, explainer
    print("Loading ML model...")
    model = joblib.load(MODEL_PATH)
    
    print("Fitting Scaler from training data...")
    try:
        df = pd.read_csv(DATA_PATH)
        # Assuming the model was trained on these features
        X = df[FEATURES].fillna(0)
        scaler = StandardScaler()
        scaler.fit(X)
        print("Scaler fitted successfully.")
    except Exception as e:
        print(f"Error fitting scaler: {e}")
        # Fallback if data is missing
        scaler = StandardScaler()

    print("Initializing SHAP explainer...")
    # TreeExplainer is fast for Gradient Boosting
    explainer = shap.TreeExplainer(model)
    print("ML initialization complete.")

def get_prediction(input_data: dict):
    """
    input_data is a dict containing the 22 features.
    """
    if model is None or scaler is None:
        initialize_ml()
        
    # Convert input to DataFrame for scaling (1 row)
    input_df = pd.DataFrame([input_data])[FEATURES]
    
    # Scale features
    X_scaled = scaler.transform(input_df)
    
    # Predict
    prob = model.predict_proba(X_scaled)[0]
    pred = model.predict(X_scaled)[0]
    
    # Fraud is typically class 1 (or 'Y'/'True' depending on encoding)
    # Let's assume standard: 0 = Genuine, 1 = Fraud
    # Based on notebook, check what 1 means. 
    # For now, we return probabilities for both classes.
    genuine_prob = prob[0]
    fraud_prob = prob[1] if len(prob) > 1 else 0.0
    
    # Compute SHAP values
    shap_values = explainer.shap_values(X_scaled)
    # SHAP values for Gradient Boosting Classifier binary classification 
    # typically returns a list of arrays (one for each class) or a single array if binary.
    if isinstance(shap_values, list):
        shap_vals = shap_values[1][0] # Focus on the positive class (fraud)
    else:
        shap_vals = shap_values[0]

    # Map SHAP values to features
    feature_importance = [
        {"feature": feat, "value": val} for feat, val in zip(FEATURES, shap_vals)
    ]
    # Sort by absolute magnitude for the frontend to show top contributors
    feature_importance.sort(key=lambda x: abs(x["value"]), reverse=True)
    
    return {
        "prediction": int(pred),
        "fraud_probability": round(fraud_prob * 100, 2),
        "genuine_probability": round(genuine_prob * 100, 2),
        "feature_importance": feature_importance,
        "confidence": round(max(genuine_prob, fraud_prob) * 100, 2)
    }

def get_model_metrics():
    # True metrics after fixing data leakage
    return {
        "models": [
            {"name": "ZeroR (Baseline)", "accuracy": 0.521127, "precision": 0.521127, "recall": 1.000000, "f1": 0.685185, "roc": 0.500000},
            {"name": "Logistic Regression", "accuracy": 0.839034, "precision": 0.850980, "recall": 0.837838, "f1": 0.844358, "roc": 0.915399},
            {"name": "Support Vector Machine", "accuracy": 0.798793, "precision": 0.780919, "recall": 0.853282, "f1": 0.815498, "roc": 0.894552},
            {"name": "Gaussian Naive Bayes", "accuracy": 0.736419, "precision": 0.670213, "recall": 0.972973, "f1": 0.793701, "roc": 0.863526},
            {"name": "Decision Tree", "accuracy": 0.784708, "precision": 0.806452, "recall": 0.772201, "f1": 0.788955, "roc": 0.785260},
            {"name": "Random Forest", "accuracy": 0.867203, "precision": 0.840989, "recall": 0.918919, "f1": 0.878229, "roc": 0.932870},
            {"name": "Gradient Boosting", "accuracy": 0.853119, "precision": 0.825175, "recall": 0.911197, "f1": 0.866055, "roc": 0.933057},
            {"name": "k-Nearest Neighbors", "accuracy": 0.794769, "precision": 0.783394, "recall": 0.837838, "f1": 0.809701, "roc": 0.840734}
        ]
    }
