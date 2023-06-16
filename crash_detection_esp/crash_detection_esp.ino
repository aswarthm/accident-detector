#include "FirebaseESP8266.h"  // Install Firebase ESP8266 library
#include <ESP8266WiFi.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

#define FIREBASE_HOST "idkwhatweredoing-default-rtdb.firebaseio.com/"  //Without http:// or https:// schemes
#define FIREBASE_AUTH "NN16OWbNVmnjHyHhNwY2k6A2ALe9KHSD0p9PK8lP"
#define WIFI_SSID "test"
#define WIFI_PASSWORD "12345678"

FirebaseData firebaseData;
FirebaseData Data;

FirebaseJson json;

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");
String hrMin = "", curDay = "", monthYr = "", epoch = "";

void setup() {

  Serial.begin(115200);
  pinMode(D1, INPUT);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
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
  // timeClient.setTimeOffset((5 * 60 + 30) * 60);
}
void loop() {
  //Firebase.set(firebaseData, "/users/sindhu/", 4);

  getTime();
  if (digitalRead(D0) == HIGH) {
    String msg = "1 12.902109 77.517237 1 0";
    Firebase.setString(firebaseData, "/disasters/" + epoch + "/sensors/", msg);
    Serial.print("/users/" + epoch + "/sensors/");
    Serial.println(msg);
  }
  // while (Serial.available()) {
  //   String readStr = String(Serial.readString());
  //   // Firebase.set(firebaseData, "/users/" + epoch + "/", readStr);

  // }
}

void getTime() {

  timeClient.update();

  int currentHour = timeClient.getHours();

  int currentMinute = timeClient.getMinutes();

  time_t epochTime = timeClient.getEpochTime();
  epoch = String(epochTime) + "000";
  struct tm *ptm = gmtime((time_t *)&epochTime);

  int monthDay = ptm->tm_mday;

  int currentMonth = ptm->tm_mon + 1;

  int currentYear = ptm->tm_year + 1900;

  monthYr = String(currentMonth) + "-" + String(currentYear);
  curDay = String(monthDay);
  hrMin = String(currentHour) + String(currentMinute);
  //Serial.println(monthYr + "\n" + curDay + "\n" + hrMin);


  return;
}


//Firebase.setInt(firebaseData, "temp", temp);