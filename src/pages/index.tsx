import Head from 'next/head'
import { Card, Metric, Text, Flex, Grid, Title, BarList, ProgressBar, Col } from '@tremor/react';
import TimeWidget from '@/widgets/time';
import IMUChartWidget from '@/widgets/imuchart';
import dynamic from 'next/dynamic';
const DynamicDevicesWidget = dynamic(() => import('@/widgets/devices'), { ssr: false });
import { useState } from 'react';
import DeviceTerminal from '@/widgets/deviceterminal';
import DeviceStateWidget from '@/widgets/devicestate';
import { Serialport } from 'tauri-serialport';
import { RocketState } from '@/utils/types/rocketState';
import { SensorData, TimeSeriesData } from '@/utils/types/sensorData';
import AltitudeWidget from '@/widgets/altitude';
import DrogueStatusWidget from '@/widgets/droguestatus';
import DeviceTemperatureWidget from '@/widgets/devicetemperature';
import SaveDataWidget from '@/widgets/savedata';

export default function Home() {
  const [serialPortStatus, setIsSerialPortOpen] = useState(false);
  const [serialData, setSerialData] = useState<string[]>([]);
  const [serialPort, setSerialport] = useState<Serialport | undefined>(undefined);
  const [rocketState, setRocketState] = useState<RocketState>(0);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData>({
    ToF: [],
    temperature: [],
    pressure: [],
    altitude: [],
    accelX: [],
    accelY: [],
    accelZ: [],
    gyroX: [],
    gyroY: [],
    gyroZ: [],
    magX: [],
    magY: [],
    magZ: [],
    rssi: [],
  });
  const handleNewSerialPort = (port: Serialport): void => {
    setSerialport(port);
  }

  const handleSerialData = (data: string): void => {
    setSerialData((prevData) => [...prevData, data]);
  };

  const handlePortStatusChange = (portStatus: boolean): void => {
    setIsSerialPortOpen(portStatus);
  }

  const handleRocketStateChange = (state: RocketState): void => {
    setRocketState(state);
  }

  const appendSensorDataToTimeSeries = (parsedData: SensorData): void => {
    if (parsedData) {
      setTimeSeriesData((prevState) => ({
        ToF: [...prevState.ToF, parsedData.ToF],
        temperature: [...prevState.temperature, parsedData.temperature],
        pressure: [...prevState.pressure, parsedData.pressure],
        altitude: [...prevState.altitude, parsedData.altitude],
        accelX: [...prevState.accelX, parsedData.accelX],
        accelY: [...prevState.accelY, parsedData.accelY],
        accelZ: [...prevState.accelZ, parsedData.accelZ],
        gyroX: [...prevState.gyroX, parsedData.gyroX],
        gyroY: [...prevState.gyroY, parsedData.gyroY],
        gyroZ: [...prevState.gyroZ, parsedData.gyroZ],
        magX: [...prevState.magX, parsedData.magX],
        magY: [...prevState.magY, parsedData.magY],
        magZ: [...prevState.magZ, parsedData.magZ],
        rssi: [...prevState.rssi, parsedData.rssi],
      }));
    }
  }


  return (
    <>
      <Head>
        <title>SkyNet Telemetry System</title>
        <meta name="description" content="SkyNet is a rocket telemetry system designed by NUSTARS." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <Grid numCols={1} numColsSm={2} numColsLg={3} className="gap-2">
          <TimeWidget />
          <AltitudeWidget
            targetApogee={1000}
            rocketState={rocketState}
            sensorData={timeSeriesData}
          />
          <DeviceStateWidget serialPortStatus={serialPortStatus} rocketState={rocketState} serialPort={serialPort} />
          <Col numColSpan={1} numColSpanLg={2} className="gap-2">
            <IMUChartWidget
              className="mt-4"
              title="Accelerometer"
              text="LSM6DSL"
              dataType='accel'
              sensorData={timeSeriesData}
            />
          </Col>
          <Grid numCols={1}>
            <DrogueStatusWidget
              className="mt-4"
              drogueThreshold={100}
              sensorData={timeSeriesData}
              rocketState={rocketState}
            />
            <DeviceTemperatureWidget
              className="mt-2"
              sensorData={timeSeriesData}
            />
            <SaveDataWidget
              className="mt-2"
              sensorData={timeSeriesData}
            />
          </Grid>
          <Col numColSpan={3}>
            <Flex className="gap-2">
              <IMUChartWidget
                className="mt-4"
                title="Gyroscope"
                text="LSM6DSL"
                dataType='gyro'
                sensorData={timeSeriesData}
              />
              <IMUChartWidget
                className="mt-4"
                title="Magnetometer"
                text="LSM6DSL"
                dataType='mag'
                sensorData={timeSeriesData}
              />
            </Flex>
          </Col>
        </Grid>
        <Grid numCols={1} numColsSm={2} numColsLg={3} className="gap-2">
          <Col numColSpan={1} numColSpanLg={2}>
            <DeviceTerminal
              className="mt-4 min-h-full"
              serialPortStatus={serialPortStatus}
              serialData={serialData}
              serialPort={serialPort} />
          </Col>
          <DynamicDevicesWidget
            className="mt-4 min-h-full"
            serialPortStatus={serialPortStatus}
            handlePortStatusChange={handlePortStatusChange}
            handleSerialData={handleSerialData}
            serialPort={serialPort}
            handleNewSerialPort={handleNewSerialPort}
            handleRocketStateChange={handleRocketStateChange}
            appendSensorDataToTimeSeries={appendSensorDataToTimeSeries}
          />
        </Grid>
      </main>
    </>
  )
}
