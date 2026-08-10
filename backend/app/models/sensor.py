"""
 Modelos de datos con Pydantic para MongoDB
"""
from datetime import datetime
from pydantic import BaseModel, Field

class SensorData(BaseModel):
    """Clase modelo"""
    temperatura: float
    humedad_aire: float
    humedad_suelo: int
    timestamp: datetime = Field(default_factory=datetime.now)
