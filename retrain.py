import json
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
import joblib
import os

print("Fixing notebook...")
with open('notebooks/04_modelling_and_evaluation.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

for cell in nb['cells']:
    if cell['cell_type'] == 'code':
        for i, line in enumerate(cell['source']):
            if "pd.read_csv('../data/X_train_scaled.csv')" in line:
                cell['source'][i] = line.replace("pd.read_csv('../data/X_train_scaled.csv')", "pd.read_csv('../data/X_train_scaled.csv', index_col=0)")
            if "pd.read_csv('../data/X_test_scaled.csv')" in line:
                cell['source'][i] = line.replace("pd.read_csv('../data/X_test_scaled.csv')", "pd.read_csv('../data/X_test_scaled.csv', index_col=0)")

with open('notebooks/04_modelling_and_evaluation.ipynb', 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=1)
    
print("Notebook fixed.")

print("Loading data for retraining...")
# load scaled matrices and target arrays with index_col=0
X_train = pd.read_csv('data/X_train_scaled.csv', index_col=0)
X_test = pd.read_csv('data/X_test_scaled.csv', index_col=0)

y_train = pd.read_csv('data/y_train.csv').squeeze()
y_test = pd.read_csv('data/y_test.csv').squeeze()

# define the 8 models
models = {
    "ZeroR (Baseline)": DummyClassifier(strategy="most_frequent"),
    "Logistic Regression": LogisticRegression(random_state=42),
    "Support Vector Machine": SVC(probability=True, random_state=42),
    "Gaussian Naive Bayes": GaussianNB(),
    "Decision Tree": DecisionTreeClassifier(random_state=42),
    "Random Forest": RandomForestClassifier(random_state=42),
    "Gradient Boosting": GradientBoostingClassifier(random_state=42),
    "k-Nearest Neighbors": KNeighborsClassifier()
}

results_list = []

print("Training models (this might take a minute)...")
for name, model in models.items():
    print(f"Training {name}...")
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]
    
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    auc = roc_auc_score(y_test, y_proba)
    
    results_list.append({
        "name": name,
        "accuracy": acc,
        "precision": prec,
        "recall": rec,
        "f1": f1,
        "roc": auc
    })

print("Saving Gradient Boosting model...")
joblib.dump(models["Gradient Boosting"], 'models/final_gradient_boost_model.pkl')

print("Saving metrics...")
with open('backend/true_metrics.json', 'w') as f:
    json.dump({"models": results_list}, f, indent=4)

print("Retraining completed successfully!")
