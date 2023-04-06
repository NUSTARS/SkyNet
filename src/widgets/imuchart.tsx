import { Card, Title, Text, LineChart } from '@tremor/react';

interface MyComponentProps {
  className?: string;
  title: string;
  text: string;
  chartData: any[];
  chartIndex: string;
}

function IMUChart(props: MyComponentProps) {
  return (
    <Card className={props.className}>
      <Title>{props.title}</Title>
      <Text>{props.text}</Text>
      <LineChart
        className="mt-4 h-80"
        data={props.chartData}
        categories={['x', 'y', 'z']}
        index={props.chartIndex}
        colors={['indigo', 'fuchsia', 'emerald']}
      />
    </Card>
  );
}

export default IMUChart;