"""
Configuración global (CORS, DB, etc.)
"""
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Configuración de la base de datos"""
    DATABASE_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "tech_journey"

settings = Settings()
