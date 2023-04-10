import { Button, Card, Col, Grid, Flex, Title, Text, TextInput } from '@tremor/react';
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

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [props.serialData]);

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
                        minHeight: '200px', // Set the desired minimum height.
                        maxHeight: '200px', // Set the desired maximum height.
                        overflowY: 'scroll',
                        whiteSpace: 'pre-wrap',
                        position: 'relative',
                    }}
                >
                    {props.serialData.map((line, index) => (
                        <Flex justifyContent="start">
                            <Text color="gray" className="font-mono tabular-nums min-w-20">{"> " + (index + 1) + " "}</Text>
                            <Col numColSpan={11}>
                                <Text>{convertUint8ArrayToString(line)}</Text>
                            </Col>
                        </Flex>
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