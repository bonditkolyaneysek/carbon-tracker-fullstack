from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from pathlib import Path

app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent
model = joblib.load(BASE_DIR / "carbon_predictor_model.pkl")
calibrator = joblib.load(BASE_DIR / "carbon_calibrator.pkl")
# Note: scaler is intentionally not applied — the original model
# was trained on raw (unscaled) features.

class PredictionInput(BaseModel):
    energy_usage_kwh_day: float
    transportation_distance_km: float
    plastic_usage_kg: float

@app.get("/")
def health_check():
    return {"status": "ML service is running"}

@app.post("/predict")
def predict(data: PredictionInput):
    input_data_raw = np.array([[
        data.energy_usage_kwh_day,
        data.transportation_distance_km,
        data.plastic_usage_kg,
    ]])

    try:
        raw_iot_prediction = model.predict(input_data_raw)
        calibrated_prediction = float(calibrator.predict(raw_iot_prediction.reshape(-1, 1))[0])
        calibrated_prediction = max(0.0, calibrated_prediction)
        return {"prediction": round(calibrated_prediction, 4), "source": "model"}
    except Exception as e:
        return {"prediction": None, "source": "fallback", "error": str(e)}