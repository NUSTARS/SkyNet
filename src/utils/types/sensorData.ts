export interface SensorData {
    index: number;
    ToF: number;
    temperature: number;
    pressure: number;
    altitude: number;
    accelX: number;
    accelY: number;
    accelZ: number;
    gyroX: number;
    gyroY: number;
    gyroZ: number;
    magX: number;
    magY: number;
    magZ: number;
    rssi: number;
}

export interface TimeSeriesData {
    ToF: number[];
    temperature: number[];
    pressure: number[];
    altitude:{ Index: number; altitude: number }[];
    accel: { Index: number; x: number; y: number; z: number }[];
    gyro: { Index: number; x: number; y: number; z: number }[];
    mag: { Index: number; x: number; y: number; z: number }[];
    rssi: number[];
  }
