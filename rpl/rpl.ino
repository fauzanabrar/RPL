/*********
  VCC = 3.3 V
  GND = GND
  DAT = D2
*********/

#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>


//Define Algoritma Millis
unsigned long interval_1 = 1000;
unsigned long interval_2 = 5000;
unsigned long previousMillis_1 = 0;
unsigned long previousMillis_2 = 0;

//Define Wifi
const char* ssid = "HUAWEI-Ukq2";
const char* password = "323383Fmzr";

//Define temp variabel
float temp, sensorData;

//define MQTT configuration
const char* mqttBroker = "test.mosquitto.org";
WiFiClient client;
PubSubClient mqtt(client);

//Define Json Document
DynamicJsonDocument doc(100);

// GPIO where the DS18B20 is connected to
const int oneWireBus = 4;   //GPIO4 (D2)   

// Setup a oneWire instance to communicate with any OneWire devices
OneWire oneWire(oneWireBus);

// Pass our oneWire reference to Dallas Temperature sensor 
DallasTemperature sensors(&oneWire);


//function connect wifi
void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  Serial.println();
  Serial.print("Menghubungkan : ");

  while(WiFi.status() !=WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  Serial.println();
  Serial.println("WiFi Connected Succes!");
  Serial.println("NodeMCU IP Address : ");
  Serial.println(WiFi.localIP());
}

//function connet mqtt
void connectMqtt() {
  while(!mqtt.connected()) {
    Serial.println("Connecting MQTT ...");
    if(mqtt.connect("famz")) {
    }
  }
}

void setup() {
  // Start the Serial Monitor
  Serial.begin(115200);

  connectWiFi();
  mqtt.setServer(mqttBroker, 1883);
  
  // Start the DS18B20 sensor
  sensors.begin();
}

void loop() {
  unsigned long currentTime = millis();

//Event 1
  if (currentTime-previousMillis_1 >= interval_1) {
    sensors.requestTemperatures(); 
    temp = sensors.getTempCByIndex(0);
    while(isnan(temp)) {
      sensors.requestTemperatures(); 
      temp = sensors.getTempCByIndex(0);
    }
    Serial.print(temp);
    Serial.println("ºC");
    
    previousMillis_1 = currentTime;
  }
//Event 2
  if (currentTime-previousMillis_2 >= interval_2) {
    if (!mqtt.connected()) {
      connectMqtt();
      Serial.println();
      Serial.println("mqtt Connected");
    }

    sensorData = temp;
    doc["temp"] = sensorData;

    char buff[50];
    serializeJson(doc, buff);
    mqtt.publish("mosuha", buff);
    Serial.print("Data suhu terkirim : ");
    Serial.println(sensorData);
    memset(buff, 0 , sizeof(buff));

    previousMillis_2 = currentTime;
  }
}
