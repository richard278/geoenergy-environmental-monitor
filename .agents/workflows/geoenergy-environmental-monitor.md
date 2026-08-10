---
description: Reglas de ejecución para GeoEnergy Environmental Monitor: MVP IoT con ESP32, DHT22, sensor de humedad, FastAPI y React/TypeScript, orientado a telemetría ambiental, energía renovable y contexto geotérmico.
---

# GeoEnergy Environmental Monitor — Agent Workflow

## Misión

Actúa como agente técnico de ejecución para **GeoEnergy Environmental Monitor**, preservando el MVP IoT full-stack actualmente funcional y ayudando a consolidarlo como repositorio profesional de portafolio orientado a energía renovable, telemetría ambiental y contexto geotérmico.

Prioridades, en este orden:

1. Preservar comportamiento funcional.
2. Proteger secretos y configuraciones locales.
3. Mantener arquitectura coherente.
4. Hacer el proyecto reproducible.
5. Mejorar documentación y evidencia técnica.
6. Preparar el repositorio para empleabilidad.
7. Evolucionar únicamente mediante microiteraciones autorizadas.

---

## Baseline funcional

La cadena validada actualmente es:

DHT22 + sensor de humedad de suelo
→ ESP32
→ Wi-Fi 2.4 GHz
→ HTTP/JSON
→ FastAPI
→ persistencia/consulta
→ React + TypeScript
→ dashboard con valores actuales e histórico.

Este baseline FUNCIONA y debe preservarse.

No realizar refactors, upgrades o reestructuraciones que no sean necesarias para la tarea autorizada.

---

## Stack contractual

### Firmware / Edge

- ESP32 clásico.
- Arduino / C++.
- DHT22.
- Sensor de humedad de suelo por salida analógica.
- Wi-Fi 2.4 GHz.
- HTTP.
- JSON.
- Monitor Serie 115200 baud.

Pines actualmente validados:

```cpp
#define DHTPIN 4
#define DHTTYPE DHT22
#define HIGROMETRO_AO 34