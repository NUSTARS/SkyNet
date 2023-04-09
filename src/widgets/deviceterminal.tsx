import { Card, Title, Text } from '@tremor/react';
import { useEffect, useRef, useState } from 'react';

interface MyComponentProps {
    className?: string;
    serialPortStatus: boolean;
    serialData: Uint8Array[];
}

function DeviceTerminal(props: MyComponentProps) {
    const terminalRef = useRef<HTMLDivElement>(null);

    const convertUint8ArrayToString = (data: Uint8Array) => {
        const decoder = new TextDecoder();
        return decoder.decode(data);
    };

    if (!props.serialPortStatus) {
        return (
            <Card className={props.className}>
                <Title>Device Terminal</Title>
                <Text>Serial port is not open</Text>
            </Card>
        );
    }

    return (
        <Card className={props.className}>
            <Title>Device Terminal</Title>
            <div
                ref={terminalRef}
                style={{
                    maxHeight: '200px', // Set the desired maximum height.
                    overflowY: 'scroll',
                    whiteSpace: 'pre-wrap',
                }}
            >
                {props.serialData.map((line, index) => (
                    <Text key={index}>{convertUint8ArrayToString(line)}</Text>
                ))}
            </div>
        </Card>
    );
}

export default DeviceTerminal;