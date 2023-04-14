import { Button, Card, Col, Flex, Title, Text, TextInput } from '@tremor/react';
import { useEffect, useRef, useState } from 'react';
import { Serialport } from 'tauri-serialport'

interface MyComponentProps {
    className?: string;
    serialPortStatus: boolean;
    serialData: string[];
    serialPort: Serialport | undefined;
}

function DeviceTerminal(props: MyComponentProps) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const [serialCommand, setSerialCommand] = useState('');

    function readFromSerialPort() {
        if (props.serialPort === undefined) {
            console.error("Serial port is not open");
            return;
        }
        console.log("Reading from serial port", props.serialPort);
        props.serialPort.read({ timeout: 250 })
            .then((data) => {
                console.log('Read data: ', data);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    const writeToSerialPort = (command: string) => {
        if (props.serialPort === undefined) {
            console.error("Serial port is not open");
            return;
        }
        props.serialPort.cancelRead();
        props.serialPort.write(command + "\n")
            .then((data) => {
                console.log('Wrote data to serial: ', data);
                readFromSerialPort();
            })
            .catch((err) => {
                console.error(err);
            });
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
                        <Flex justifyContent="start" key={"tline" + index}>
                            <Text color="gray" className="font-mono tabular-nums min-w-20">{"> " + (index + 1) + " "}</Text>
                            <Col numColSpan={11}>
                                <Text>{line}</Text>
                            </Col>
                        </Flex>
                    ))}
                </div>
            </Card>
            <Flex justifyContent="end" className="mt-4 space-x-2">
                <TextInput placeholder="Input serial command" onChange={(e) => { setSerialCommand(e.target.value) }} />
                <Button onClick={() => writeToSerialPort(serialCommand)}>Send</Button>
            </Flex>
        </Card>
    );
}

export default DeviceTerminal;