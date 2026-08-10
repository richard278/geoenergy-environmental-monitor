from fastapi import APIRouter, HTTPException
from app.models.sensor import SensorData
from app.database import sensor_collection

router = APIRouter()

# ✅ Ruta para recibir datos desde el ESP32
@router.post("/sensor-data")
async def recibir_datos(data: SensorData):
    """Recibe los datos del ESP32 y los guarda en MongoDB"""
    try:
        sensor_doc = data.dict()
        result = await sensor_collection.insert_one(sensor_doc)  # Guardar en MongoDB
        return {"message": "Datos recibidos correctamente", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ✅ Ruta para obtener datos en el frontend
@router.get("/get-sensor-data")
async def obtener_datos():
    """Devuelve los últimos 10 datos de sensores"""
    try:
        datos = await sensor_collection.find().sort("_id", -1).limit(10).to_list(10)
        for d in datos:
            d["_id"] = str(d["_id"])  # Convertir ObjectId a string
        return datos
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
