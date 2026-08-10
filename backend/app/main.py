"""
Punto de entrada de la API
"""
from fastapi import FastAPI
from app.routers import sensor  # Importamos la ruta del sensor
from app.config import settings  # Configuración global

from fastapi.middleware.cors import CORSMiddleware# Agregada para verificar que no exista conflicto de conexiones

app = FastAPI(title="API de Sensores")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas las conexiones (ajústalo según seguridad)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas
app.include_router(sensor.router)
