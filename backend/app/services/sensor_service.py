"""Lógica de almacenamiento y procesamiento"""
from app.database import sensor_collection
from app.models.sensor import SensorData

async def guardar_datos(sensor: SensorData):
    """Metodo save sensor data"""
    sensor_dict = sensor.dict()
    resultado = await sensor_collection.insert_one(sensor_dict)  # Guardar en MongoDB
    sensor_dict["_id"] = str(resultado.inserted_id)  # Convertir ObjectId en string
    return sensor_dict
