// Basic demo for accelerometer readings from Adafruit MPU6050

#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
#include <math.h>

#define ZSENSITIVITY 3.5
#define RZSENSITIVITY 0.2


Adafruit_MPU6050 mpu;

void setup(void) {
  Serial.begin(115200);
  pinMode(13, OUTPUT);
  pinMode(12, OUTPUT);

  // Try to initialize!
  Wire.begin();
  if (!mpu.begin(104, &Wire, 0)) {
    Serial.println("Failed to find MPU6050 chip");
    while (1) {
      delay(10);
    }
  }

  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
  buzz();
}

float prevZ;
float prevRZ;


void loop() {

  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  // Serial.print(a.acceleration.x);
  // Serial.print(",");
  // Serial.print(a.acceleration.y);
  // Serial.print(",");
  // Serial.print(a.acceleration.z);
  // Serial.print(",");
  // Serial.print(g.gyro.x);
  // Serial.print(",");
  // Serial.print(g.gyro.y);
  // Serial.print(",");
  // Serial.print(g.gyro.z);

  if(a.acceleration.z > 5){
    Serial.println("ACCIDENT_ROLL");
    buzz();
    digitalWrite(12, HIGH);
    delay(500);
    digitalWrite(12, LOW);
  }
  else if(a.acceleration.x > 15){
    Serial.println("ACCIDENT_HEADON");
    buzz();
    digitalWrite(12, HIGH);
    delay(500);
    digitalWrite(12, LOW);
  }
  // else{
  //   Serial.println("NO_ACCIDENT");
  // }



  // if (abs(prevZ - a.acceleration.z) > ZSENSITIVITY) {
  //   Serial.print("POTHOLEEEE  UP DOWN");
  //   delay(1000);
  // }

  // if (abs(prevRZ - g.gyro.z) > RZSENSITIVITY) {
  //   Serial.print("POTHOLEEEE  ROLL ROLL");
  //   delay(1000);
  // }

  // prevZ = a.acceleration.z;

  // prevRZ = g.gyro.z;

  delay(50);
}

void buzz(){
  int val = 300;
  for(int i = 0; i < 5; i++){
    digitalWrite(13, LOW);
    delay(val);
    digitalWrite(13, HIGH);
    delay(val);
  }
}