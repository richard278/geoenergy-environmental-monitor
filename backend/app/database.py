# Conexión a la base de datos (Opcional)
import motor.motor_asyncio
from app.config import settings

client = motor.motor_asyncio.AsyncIOMotorClient(settings.DATABASE_URL)
database = client[settings.DATABASE_NAME]
sensor_collection = database["sensor_data"]
