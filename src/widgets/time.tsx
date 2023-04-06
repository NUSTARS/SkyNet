import { useState, useEffect } from 'react';
import { Card, Metric, Text, Flex } from '@tremor/react';

function TimeWidget() {
    const [localTime, setLocalTime] = useState('');
    const [utcTime, setUtcTime] = useState('');

    useEffect(() => {
        const intervalId = setInterval(() => {
            const date = new Date();
            const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const localTime = date.toLocaleTimeString('en-US', { timeZone: localTimeZone });
            const utcTime = date.toUTCString().slice(0, -4);;
            setLocalTime(localTime);
            setUtcTime(utcTime);
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <Card className="max-w-xs mx-auto">
            <Text>Local Time</Text>
            <Metric>{localTime}</Metric>
            <Flex className="mt-4">
                <Text>UTC</Text>
                <Text>{utcTime}</Text>
            </Flex>
        </Card>
    );
}

export default TimeWidget;