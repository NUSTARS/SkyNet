import { Card, Col, Title, Text, LineChart, TabList, Tab, Flex, TextInput } from '@tremor/react';
import ArrowUpIcon from "@heroicons/react/24/outline/ArrowUpIcon"
import ArrowsUpDownIcon from "@heroicons/react/24/outline/ArrowsUpDownIcon"
import { useState } from 'react';
import { LocalConfig } from '@/utils/types/localConfig';

interface AltitudeChartWidgerProps {
    className?: string;
    title: string;
    text: string;
    sensorData: { Index: number; altitude: number; }[];
    localConfig: LocalConfig;
    handleLocalConfigChange: (key: string, value: any) => void;
}

const AltitudeChartWidget: React.FC<AltitudeChartWidgerProps> = ({ className, title, text, sensorData, localConfig, handleLocalConfigChange }) => {
    const [showCard, setShowCard] = useState(true);
    return (
        <Card className={className}>
            <Flex>
                <Col>
                    <Title>{title}</Title>
                    <Text>{text}</Text>
                </Col>
                <Col>
                    <Text>Target Apogee (ft)</Text>
                    <TextInput
                        className="w-42 mt-2"
                        placeholder="Set Target Apogee"
                        min={0}
                        defaultValue={localConfig.targetApogee.toString()}
                        onChange={(e) => {
                            let value = parseInt(e.target.value);
                            if (value < 0) { value = 0 };
                            handleLocalConfigChange('targetApogee', value)
                        }}
                    />
                </Col>
            </Flex>
            {/* <TabList
                defaultValue="1"
                onValueChange={(value) => setShowCard(value === "1")}
                className="mt-6"
            >
                <Tab value="1" text="Pressure Altitude" icon={ArrowUpIcon} />
                <Tab value="2" text="Absolute Altitude" icon={ArrowsUpDownIcon} />
            </TabList> */}

            {showCard === true ? (
                <LineChart
                    className="mt-4 h-80"
                    data={sensorData}
                    categories={['altitude']}
                    index={"Index"}
                    colors={['indigo']}
                    showAnimation={false}
                />) : (
                <LineChart
                    className="mt-4 h-80"
                    data={sensorData}
                    categories={['altitude']}
                    index={"Index"}
                    colors={['indigo']}
                    showAnimation={false}
                />)}
        </Card>
    );
}

export default AltitudeChartWidget;