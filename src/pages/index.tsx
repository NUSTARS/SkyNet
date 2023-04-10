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

const data = [
  {
    Packet: 1,
    x: 2890,
    y: 2400,
    z: 2385
  },
  {
    Packet: 2,
    x: 1890,
    y: 1398,
    z: 2410
  },
  {
    Packet: 3,
    x: 3890,
    y: 2980,
    z: 2081
  }
];

export default function Home() {
  const [serialPortStatus, setIsSerialPortOpen] = useState(false);
  const [serialData, setSerialData] = useState<Uint8Array[]>([]);
  const [serialPort, setSerialport] = useState<Serialport | undefined>(undefined);
  const [rocketState, setRocketState] = useState<RocketState>(0);

  const handleNewSerialPort = (port: Serialport) => {
    setSerialport(port);
  }

  const handleSerialData = (data: Uint8Array) => {
    setSerialData((prevData) => [...prevData, data]);
  };

  const handlePortStatusChange = (portStatus: boolean) => {
    setIsSerialPortOpen(portStatus);
  }

  const handleRocketStateChange = (state: RocketState) => {
    setRocketState(state);
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
          <Card>
            <Text>Rocket Altitude</Text>
            <Metric>71,465 ft</Metric>
            <Flex className="mt-4">
              <Text>32% of the target apogee</Text>
              <Text>225,000 ft</Text>
            </Flex>
            <ProgressBar percentageValue={32} className="mt-2" />
          </Card>
          <DeviceStateWidget serialPortStatus={serialPortStatus} rocketState={rocketState} serialPort={serialPort}/>
          <Col numColSpan={1} numColSpanLg={2} className="gap-2">
            <IMUChartWidget
              className="mt-4"
              title="Accelerometer"
              text="LSM6DSL"
              chartData={data}
              chartIndex={"Packet"}
            />
          </Col>
          <Grid numCols={1}>
            <Card className="mt-4">
              <Text>Drogue Status</Text>
              <Metric>Not Deployed</Metric>
            </Card>
            <Card className="mt-4">
              <Text>SkyNet Transmitter Temperature</Text>
              <Metric>NaN</Metric>
            </Card>
          </Grid>
          <Col numColSpan={3}>
            <Flex className="gap-2">
              <IMUChartWidget
                className="mt-4"
                title="Gyroscope"
                text="LSM6DSL"
                chartData={data}
                chartIndex={"Packet"}
              />
              <IMUChartWidget
                className="mt-4"
                title="Magnetometer"
                text="LSM6DSL"
                chartData={data}
                chartIndex={"Packet"}
              />
            </Flex>
          </Col>
        </Grid>
        <Grid numCols={1} numColsSm={2} numColsLg={3} className="gap-2">
          <Col numColSpan={1} numColSpanLg={2}>
            <DeviceTerminal className="mt-4 min-h-full" serialPortStatus={serialPortStatus} serialData={serialData} serialPort={serialPort}/>
          </Col>
          <DynamicDevicesWidget className="mt-4 min-h-full" serialPortStatus={serialPortStatus} handlePortStatusChange={handlePortStatusChange} handleSerialData={handleSerialData} serialPort={serialPort} handleNewSerialPort={handleNewSerialPort} handleRocketStateChange={handleRocketStateChange} />
        </Grid>
      </main>
    </>
  )
}
