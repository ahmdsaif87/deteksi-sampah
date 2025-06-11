from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.routes import predict  # pastikan path ini sesuai struktur

app = FastAPI(title="Deteksi Sampah API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ini akan memanggil semua route di /api/v1/predict
app.include_router(predict.router, prefix="/api/v1")
