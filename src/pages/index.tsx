import Head from 'next/head'
import { Flex, Grid, Col, Card, Title, Text, LineChart } from '@tremor/react';
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
import AltitudeChartWidget from '@/widgets/altitudechart';

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
    accel: [],
    gyro: [],
    mag: [],
    rssi: [],
  });
  const [localConfig, setLocalConfig] = useState({
    targetApogee: 1000
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

  const handleLocalConfigChange = (key: string, value: any): void => {
    setLocalConfig((prevState) => ({
      ...prevState,
      [key]: value
    }));
  }

  function formatIMUChartData(index: number, dataX: number, dataY: number, dataZ: number): { Index: number; x: number; y: number; z: number } {
    return {
      Index: index,
      x: dataX,
      y: dataY,
      z: dataZ,
    };
  }

  function formatAltitudeChartData(index: number, data: number): { Index: number; altitude: number } {
    return {
      Index: index,
      altitude: data,
    };
  }

  const appendSensorDataToTimeSeries = (parsedData: SensorData): void => {
    if (parsedData) {
      let accel = formatIMUChartData(parsedData.index, parsedData.accelX, parsedData.accelY, parsedData.accelZ);
      let gyro = formatIMUChartData(parsedData.index, parsedData.gyroX, parsedData.gyroY, parsedData.gyroZ);
      let mag = formatIMUChartData(parsedData.index, parsedData.magX, parsedData.magY, parsedData.magZ);
      let altitude = formatAltitudeChartData(parsedData.index, parsedData.altitude);
      setTimeSeriesData((prevState) => ({
        ToF: [...prevState.ToF, parsedData.ToF],
        temperature: [...prevState.temperature, parsedData.temperature],
        pressure: [...prevState.pressure, parsedData.pressure],
        altitude: [...prevState.altitude, altitude],
        accel: [...prevState.accel, accel],
        gyro: [...prevState.gyro, gyro],
        mag: [...prevState.mag, mag],
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
            targetApogee={localConfig.targetApogee}
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
              sensorData={timeSeriesData.accel}
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
                sensorData={timeSeriesData.gyro}
              />
              <IMUChartWidget
                className="mt-4"
                title="Magnetometer"
                text="LSM6DSL"
                dataType='mag'
                sensorData={timeSeriesData.mag}
              />
            </Flex>
          </Col>
        </Grid>
        <AltitudeChartWidget
          className="mt-4"
          title="Altitude"
          text="BMP388"
          sensorData={timeSeriesData.altitude}
          localConfig={localConfig}
          handleLocalConfigChange={handleLocalConfigChange}
        />
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
