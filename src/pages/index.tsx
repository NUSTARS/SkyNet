import Head from 'next/head'
import { Card, Metric, Text, Flex, Grid, Title, BarList, ProgressBar, Col } from '@tremor/react';
import TimeWidget from '@/widgets/time';
import IMUChartWidget from '@/widgets/imuchart';
import DevicesWidget from '@/widgets/devices';

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
  return (
    <>
      <Head>
        <title>SkyNet Telemetry System</title>
        <meta name="description" content="SkyNet is a rocket telemetry system designed by NUSTARS." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <Grid className="mt-4 gap-3" numColsSm={2} numColsLg={3}>
          <TimeWidget />
          <Card className="max-w-xs mx-auto">
            <Text>Rocket Altitude</Text>
            <Metric>71,465 ft</Metric>
            <Flex className="mt-4">
              <Text>32% of the target apogee</Text>
              <Text>225,000 ft</Text>
            </Flex>
            <ProgressBar percentageValue={32} className="mt-2" />
          </Card>
          <Card className="max-w-xs mx-auto">
            <Text>Rocket Status</Text>
            <Metric>No Connection</Metric>
          </Card>
        </Grid>
        <Grid className="mt-4 gap-6" numCols={3}>
          <Col numColSpan={1} numColSpanLg={2}>
            <IMUChartWidget 
              className="mt-4"
              title="Accelerometer"
              text="LSM6DSL"
              chartData={data}
              chartIndex={"Packet"} 
            />
          </Col>
          <Col numColSpan={1}>
            <Card className="mt-4">
              <Text>Drogue Status</Text>
              <Metric>Not Deployed</Metric>
            </Card>
            <Card className="mt-4">
              <Text>SkyNet Temperature</Text>
              <Metric>NaN</Metric>
            </Card>
            <DevicesWidget className="mt-4" />
          </Col>
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
        </Grid>
      </main>
    </>
  )
}
