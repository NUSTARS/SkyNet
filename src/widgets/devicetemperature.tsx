import { TimeSeriesData } from '@/utils/types/sensorData';
import { Card, Metric, Text } from '@tremor/react';

interface DeviceTemperatureWidgetProps {
    className?: string;
    sensorData: TimeSeriesData;
}

const DeviceTemperatureWidget: React.FC<DeviceTemperatureWidgetProps> = ({ className, sensorData }) => {
    // Get the latest temperature value
    const currentTemperature = sensorData.temperature[sensorData.temperature.length - 1] || NaN;

    return (
        <Card className={className}>
            <Text>SkyNet Transmitter Temperature</Text>
            <Metric>{isNaN(currentTemperature) ? '---' : `${currentTemperature.toFixed(1)}°C`}</Metric>
        </Card>
    );
};

export default DeviceTemperatureWidget;
