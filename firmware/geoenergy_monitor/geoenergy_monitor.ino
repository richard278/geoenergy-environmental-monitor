#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h> //Asegúrate de instalar esta librería desde el Gestor de Librerías
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include "secrets.h"

// 🔧 Pines y configuración del DHT22
#define DHTPIN 4        // Pin de datos del DHT22 conectado al GPIO4
#define DHTTYPE DHT22   // Tipo de sensor

//Pines y configuracion del Higrometro
#define HIGROMETRO_DO 27  //PIN GPIO digital out, (DO) Higrometer
#define HIGROMETRO_AO 34  ///PIN GPIO analog out (AO) Higrometer

DHT dht(DHTPIN, DHTTYPE);

void setup() {

    Serial.begin(115200);//Baudios
    delay(2000); // 🔹 Pequeño retardo para estabilizar ESP32
    Serial.println("✅ ESP32 Iniciado");

    //Conectar a WiFi
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.println("Conectando a WiFi...");

    int intentos = 0;
    while (WiFi.status() != WL_CONNECTED && intentos < 20) {
        delay(1000);
        Serial.print(".");
        intentos++;
    }

    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\n✅ Conectado a WiFi!");
        Serial.print("📡 IP Local: ");
        Serial.println(WiFi.localIP());
    }
    else {
        Serial.println("\n❌ No se pudo conectar a WiFi. Verifica SSID y contraseña.");
    }

    //Inicializar sensores
    dht.begin();  // 🔹 Importante: inicializar el sensor DHT dht.begin();
    pinMode(HIGROMETRO_DO, INPUT);
    pinMode(HIGROMETRO_AO, INPUT);
}

void loop() {

    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("⚠ WiFi desconectado. Intentando reconectar...");
        WiFi.disconnect();
        WiFi.reconnect();
        delay(5000);
        return;
    }

    // 📥 Lectura del sensor DHT22(Temperatura y Humedad del Aire)
    float temperatura = dht.readTemperature();
    float humedadAire = dht.readHumidity();

    if (isnan(temperatura) || isnan(humedadAire)) {
        Serial.println("❌ Error al leer el DHT22");
        return;// Evita enviar datos inválidos
    }

    Serial.print("🌡 Temperatura: ");
    Serial.print(temperatura);
    Serial.println(" °C");

    Serial.print("💧 Humedad del Aire: ");
    Serial.print(humedadAire);
    Serial.println(" %");

    // 🔹 Lectura del Higrómetro (Humedad del Suelo)
    int humedadSueloAnalogica = analogRead(HIGROMETRO_AO);
    int humedadSueloDigital = digitalRead(HIGROMETRO_DO);
    Serial.print("🌱 Humedad del suelo (Analógica): ");
    Serial.println(humedadSueloAnalogica);

    if (humedadSueloDigital == HIGH) {
        Serial.println("🚨 Suelo seco ❌");
    } else {
        Serial.println("✅ Suelo húmedo");
    }
    // 📤 Envío de datos a FastAPI
    HTTPClient http;
    http.begin(SERVER_URL);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<200> jsonDoc;
    jsonDoc["temperatura"] = temperatura;
    jsonDoc["humedad_aire"] = humedadAire;

    jsonDoc["humedad_suelo"] = humedadSueloAnalogica;
    jsonDoc["suelo_seco"] = humedadSueloDigital;


    String jsonString;
    serializeJson(jsonDoc, jsonString);

    int httpResponseCode = http.POST(jsonString);
    if (httpResponseCode > 0) {
        Serial.print("📡 Respuesta del servidor: ");
        Serial.println(httpResponseCode);
    } else {
        Serial.print("❌ Error HTTP: ");
        Serial.println(http.errorToString(httpResponseCode).c_str());
    }

    http.end();

    Serial.println("-----------------------------");
    delay(5000);  // Esperar 5 segundos antes de la próxima lectura
}


//(.venv) D:\Proyectos\AgroSensores\backend>uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
//(.venv) D:\Proyectos\AgroSensores\backend>uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload