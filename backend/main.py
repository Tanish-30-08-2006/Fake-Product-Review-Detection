from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ml_utils import get_prediction, get_model_metrics, initialize_ml
import uvicorn

app = FastAPI(title="Fake Review Detection API")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, restrict this to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReviewInput(BaseModel):
    rating: float = 5.0
    reviewUsefulCount: float = 0.0
    friendCount: float = 0.0
    reviewCount: float = 1.0
    firstCount: float = 0.0
    usefulCount: float = 0.0
    complimentCount: float = 0.0
    tipCount: float = 0.0
    restaurantRating: float = 4.0
    ReviewLength: float = 100.0
    review_year: float = 2024.0
    sentiment_score: float = 0.5
    reviewer_sentiment_var: float = 0.1
    lexical_diversity_ttr: float = 0.8
    capitalization_ratio: float = 0.05
    location_entropy: float = 0.5
    days_active: float = 10.0
    review_velocity: float = 0.1
    restaurant_rating_var: float = 0.5
    avg_word_length: float = 5.0
    has_friends: float = 0.0
    has_useful_votes: float = 0.0

@app.on_event("startup")
def startup_event():
    # Initialize model on startup so first request isn't slow
    initialize_ml()

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/model-info")
def model_info():
    return get_model_metrics()

@app.post("/predict")
def predict(data: ReviewInput):
    try:
        input_dict = data.dict()
        result = get_prediction(input_dict)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
