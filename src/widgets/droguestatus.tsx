import { Card, Metric, Text } from '@tremor/react';
import { TimeSeriesData } from '@/utils/types/sensorData';
import { RocketState } from '@/utils/types/rocketState';

interface DrogueStatusWidgetProps {
  className?: string;
  drogueThreshold: number;
  sensorData: TimeSeriesData;
  rocketState: RocketState;
}

const DrogueStatusWidget: React.FC<DrogueStatusWidgetProps> = ({ className, drogueThreshold, sensorData, rocketState }) => {
  // Get the latest ToF value
  const currentToF = sensorData.ToF[sensorData.ToF.length - 1] || 0;

  // Determine if the drogue is deployed based on the ToF value
  const drogueDeployed = currentToF > drogueThreshold;
  const drogueStatus = drogueDeployed ? 'Deployed' : 'Not Deployed';

  // Display a message when the rocket state is not LAUNCHED
  if (rocketState !== RocketState.LAUNCHED) {
    return (
        <Card className={className}>
            <Text>Drogue Status</Text>
            <Metric>---</Metric>
        </Card>
    );
}

  return (
    <Card className={className}>
      <Text>Drogue Status</Text>
      <Metric>{drogueStatus}</Metric>
    </Card>
  );
};

export default DrogueStatusWidget;
