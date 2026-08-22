from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import uvicorn
import os

app = FastAPI()

# Load the model
model_path = os.path.join(os.path.dirname(__file__), 'autism_model.pkl')
if os.path.exists(model_path):
    model = joblib.load(model_path)
else:
    model = None
    print("Warning: Model file not found. Prediction will fail.")

class PredictionRequest(BaseModel):
    a1Score: int
    a2Score: int
    a3Score: int
    a4Score: int
    a5Score: int
    a6Score: int
    a7Score: int
    a8Score: int
    a9Score: int
    a10Score: int
    age: int
    gender: str
    jundice: int
    austim: int

@app.post("/predict")
async def predict(data: PredictionRequest):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Map gender string to int
        gender_map = {'male': 0, 'female': 1, 'm': 0, 'f': 1}
        gender_score = gender_map.get(data.gender.lower(), 0)
        
        feature_data = {
            'A1_Score': [data.a1Score],
            'A2_Score': [data.a2Score],
            'A3_Score': [data.a3Score],
            'A4_Score': [data.a4Score],
            'A5_Score': [data.a5Score],
            'A6_Score': [data.a6Score],
            'A7_Score': [data.a7Score],
            'A8_Score': [data.a8Score],
            'A9_Score': [data.a9Score],
            'A10_Score': [data.a10Score],
            'age': [data.age],
            'gender': [gender_score],
            'jundice': [data.jundice],
            'austim': [data.austim]
        }
        
        X = pd.DataFrame(feature_data)
        
        # Ensure column order matches training
        features_order = ['A1_Score', 'A2_Score', 'A3_Score', 'A4_Score', 'A5_Score',
                          'A6_Score', 'A7_Score', 'A8_Score', 'A9_Score', 'A10_Score',
                          'age', 'gender', 'jundice', 'austim']
        X = X[features_order]
        
        prediction = model.predict(X)[0]
        # Get class probabilities
        probs = model.predict_proba(X)[0]
        # Probability for the predicted class
        confidence = probs[int(prediction)] * 100
        
        return {
            "prediction": "YES" if int(prediction) == 1 else "NO",
            "confidence": round(float(confidence), 2)
        }
    except Exception as e:
        print(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": model is not None}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
