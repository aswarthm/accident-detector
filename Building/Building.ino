#include "FirebaseESP8266.h"  // Install Firebase ESP8266 library
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <NTPClient.h>
#define DHTPIN D3
#define DHTTYPE DHT11
#define Fire D0
int Gas_analog=A0;
int Gas_digital=D1;
int ldr=D2;
int relay=D5;
DHT dht(DHTPIN, DHTTYPE);
#define FIREBASE_HOST "https://idkwhatweredoing-default-rtdb.firebaseio.com/" //Without http:// or https:// schemes
#define FIREBASE_AUTH "AIzaSyB-1FSGQ_9xuWCcswCNIVaHFvnKb0ehrGo"
FirebaseData Data;

FirebaseJson json;
#define WIFI_SSID "test"
#define WIFI_PASSWORD "12345678"
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");
String epoch = "";
void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  pinMode(Gas_digital, INPUT);
  pinMode(Fire,INPUT);
  pinMode(relay,OUTPUT);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
  timeClient.begin();
  //timeClient.setTimeOffset((5 * 60 + 30) * 60);
  delay(1);
}

void loop() {
  // put your main code here, to run repeatedly:
  String current_time=getTime();
  Serial.println(current_time);
  int gassensorAnalog = analogRead(Gas_analog);
  int gassensorDigital = digitalRead(Gas_digital);
  int ldrvalue= digitalRead(ldr);
  int fire=digitalRead(Fire);
  int gasdigital;
  int latitude=12.9022;
  int longitude=77.5186;
  if(gassensorAnalog>400)
  {
    gasdigital=1;
  }
  else
  {
    gasdigital=0;
  }
  digitalWrite(relay, LOW);
  delay(2000);
  digitalWrite(relay, HIGH);
  delay(2000);
  Serial.println(gassensorDigital);
  Serial.println(fire);
  if(gasdigital==1|| fire==1)
  {
    int lock =1;
    Firebase.setString(Data,"/disasters/"+current_time+"/sensors","0 "+String(latitude)+" "+String(longitude)+" "+String(gasdigital)+"0 "+" "+String(fire)+" "+String(lock));
  }
  
  delay(20000);
}
String getTime() {

  timeClient.update();
  time_t epochTime = (timeClient.getEpochTime());
  epoch = String(epochTime)+"000";
  return epoch;
}
