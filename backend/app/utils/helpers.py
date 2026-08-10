"""
Lógica de almacenamiento y procesamiento
utils/ # Utilidades adicionales (ej. validaciones)
"""
def formatear_respuesta(sensor_data):
    """Metodo de formato salida"""
    return {
        "temperatura": sensor_data["temperatura"],
        "humedad_aire": sensor_data["humedad_aire"],
        "humedad_suelo": sensor_data["humedad_suelo"],
        "timestamp": sensor_data["timestamp"].strftime("%Y-%m-%d %H:%M:%S"),
    }
