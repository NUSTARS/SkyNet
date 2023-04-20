import { message } from '@tauri-apps/api/dialog';
import { Card, Button, Text } from "@tremor/react";
import { TimeSeriesData } from '@/utils/types/sensorData';

interface SaveDataWidgetProps {
    className?: string;
    sensorData: TimeSeriesData;
}

const SaveDataWidget: React.FC<SaveDataWidgetProps> = ({ className, sensorData }) => {
    const hasData = Object.values(sensorData).some((data) => data.length > 0);

    const saveDataAsCSV = async () => {
        if (!hasData) {
            await message('No data available for export...', { title: 'SkyNet', type: 'error' });
            return;
        }

        // Generate CSV from time series data
        const headers = ['Index', 'ToF', 'Temperature', 'Pressure', 'Altitude', 'AccelX', 'AccelY', 'AccelZ', 'GyroX', 'GyroY', 'GyroZ', 'MagX', 'MagY', 'MagZ'];
        const csvData = [headers.join(',')].concat(
            sensorData.ToF.map((value, index) => {
                return [
                    index + 1,
                    sensorData.ToF[index],
                    sensorData.temperature[index],
                    sensorData.pressure[index],
                    sensorData.altitude[index],
                    sensorData.accel[index].x,
                    sensorData.accel[index].y,
                    sensorData.accel[index].z,
                    sensorData.gyro[index].x,
                    sensorData.gyro[index].y,
                    sensorData.gyro[index].z,
                    sensorData.mag[index].x,
                    sensorData.mag[index].y,
                    sensorData.mag[index].z,
                ].join(',');
            })
        ).join('\n');

        // Save CSV to a file
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'sensor-data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card className={className}>
            <Text>Save Data</Text>
            <Button className="mt-4" onClick={saveDataAsCSV}>Save Data as CSV</Button>
        </Card>
    );
};

export default SaveDataWidget;