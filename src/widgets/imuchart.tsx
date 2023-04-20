import { Card, Title, Text, LineChart } from '@tremor/react';

interface MyComponentProps {
  className?: string;
  title: string;
  text: string;
  sensorData: { Index: number; x: number; y: number; z: number }[];
  dataType: 'accel' | 'gyro' | 'mag';
}

function IMUChart(props: MyComponentProps) {
  const dataFormatter = (number: number) => {
    // for accel, the number is in m/s^2
    if (props.dataType === 'accel') {
      return `${number.toFixed(2)} °/s^2`;
    }
    // for gyro, the number is in degree/s
    if (props.dataType === 'gyro') {
      return `${number.toFixed(2)} °/s`;
    }
    // for mag, the number is in uT
    if (props.dataType === 'mag') {
      return `${number.toFixed(2)} uT`;
    }
    return `${number}`;
  }

  return (
    <Card className={props.className}>
      <Title>{props.title}</Title>
      <Text>{props.text}</Text>
      <LineChart
        className="mt-4 h-80"
        data={props.sensorData}
        categories={['x', 'y', 'z']}
        index={"Index"}
        colors={['indigo', 'fuchsia', 'emerald']}
        valueFormatter={dataFormatter}
        showAnimation={false}
      />
    </Card>
  );
}

export default IMUChart;