export interface SensorData {
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
    altitude: number[];
    accelX: number[];
    accelY: number[];
    accelZ: number[];
    gyroX: number[];
    gyroY: number[];
    gyroZ: number[];
    magX: number[];
    magY: number[];
    magZ: number[];
    rssi: number[];
  }