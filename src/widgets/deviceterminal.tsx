import { Button, Card, Flex, Title, Text, TextInput } from '@tremor/react';
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
                <Text>Waiting for serial port to open...</Text>
            </Card>
        );
    }

    return (
        <Card className={props.className}>
            <Title>Device Terminal</Title>
            <Card className="mt-2" decoration="left" decorationColor="gray">
                <div
                    ref={terminalRef}
                    style={{
                        minHeight: '200px', // Set the desired minimun height.
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
            <Flex justifyContent="end" className="mt-4 space-x-2">
                <TextInput placeholder="Input serial command" />
                <Button>Send</Button>
            </Flex>
        </Card>
    );
}

export default DeviceTerminal;