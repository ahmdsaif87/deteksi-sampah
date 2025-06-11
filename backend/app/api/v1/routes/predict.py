from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.prediction import predict_image
from app.services.recommendation import get_recommendation

router = APIRouter()

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File harus berupa gambar")

    image_bytes = await file.read()
    label = predict_image(image_bytes)
    recommendation = get_recommendation(label)

    return {
        "prediction": label,
        "recommendation": recommendation
    }
