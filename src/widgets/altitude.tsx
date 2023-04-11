import { RocketState } from '@/utils/types/rocketState';
import { TimeSeriesData } from '@/utils/types/sensorData';
import { Card, Metric, Text, Flex, ProgressBar } from '@tremor/react';

interface AltitudeWidgetProps {
    className?: string;
    targetApogee: number;
    rocketState: RocketState;
    sensorData: TimeSeriesData;
}

const AltitudeWidget: React.FC<AltitudeWidgetProps> = ({ className, targetApogee, rocketState, sensorData }) => {
    // Get the latest altitude value
    const currentAltitude = sensorData.altitude[sensorData.altitude.length - 1] || 0;
    const percentageValue = Math.min(Math.round((currentAltitude / targetApogee) * 100), 100);

    // Display a message when the rocket state is not LAUNCHED
    if (rocketState !== RocketState.LAUNCHED) {
        return (
            <Card className={className}>
                <Text>Rocket Altitude</Text>
                <Metric>---</Metric>
                <Flex className="mt-4">
                    <Text>Waiting for launch...</Text>
                </Flex>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <Text>Rocket Altitude</Text>
            <Metric>{currentAltitude.toFixed(0)} ft</Metric>
            <Flex className="mt-4">
                <Text>{percentageValue}% of the target apogee</Text>
                <Text>{targetApogee.toLocaleString()} ft</Text>
            </Flex>
            <ProgressBar percentageValue={percentageValue} className="mt-2" />
        </Card>
    );
};

export default AltitudeWidget;
