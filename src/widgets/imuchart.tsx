import { TimeSeriesData } from '@/utils/types/sensorData';
import { Card, Title, Text, LineChart } from '@tremor/react';

interface MyComponentProps {
  className?: string;
  title: string;
  text: string;
  sensorData: TimeSeriesData;
  dataType: 'accel' | 'gyro' | 'mag';
}

function formatChartData(dataX: number[], dataY: number[], dataZ: number[]): Array<{ Index: number; x: number; y: number; z: number }> {
  const dataLength = Math.min(dataX.length, dataY.length, dataZ.length);
  const formattedData = Array.from({ length: dataLength }, (_, index) => ({
    Index: index + 1,
    x: dataX[index],
    y: dataY[index],
    z: dataZ[index],
  }));

  return formattedData;
}


function IMUChart(props: MyComponentProps) {
  // Extract the appropriate data from the sensorData prop based on the dataType prop
  let dataX, dataY, dataZ;
  switch (props.dataType) {
    case 'accel':
      dataX = props.sensorData.accelX;
      dataY = props.sensorData.accelY;
      dataZ = props.sensorData.accelZ;
      break;
    case 'gyro':
      dataX = props.sensorData.gyroX;
      dataY = props.sensorData.gyroY;
      dataZ = props.sensorData.gyroZ;
      break;
    case 'mag':
      dataX = props.sensorData.magX;
      dataY = props.sensorData.magY;
      dataZ = props.sensorData.magZ;
      break;
  }

  // Format the data for the LineChart component
  const chartData = formatChartData(dataX, dataY, dataZ);

  return (
    <Card className={props.className}>
      <Title>{props.title}</Title>
      <Text>{props.text}</Text>
      <LineChart
        className="mt-4 h-80"
        data={chartData}
      categories={['x', 'y', 'z']}
      index={"Index"}
      colors={['indigo', 'fuchsia', 'emerald']}
      />
    </Card>
  );
}

export default IMUChart;