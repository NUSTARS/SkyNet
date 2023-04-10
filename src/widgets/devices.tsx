import { Card, Button, Dropdown, DropdownItem, Flex, Title, Text, TextInput } from "@tremor/react";
import { Serialport, SerialPortInfo } from 'tauri-serialport'
import { useEffect, useState } from "react";
import { message } from '@tauri-apps/api/dialog';
import { RocketState } from "@/utils/types/rocketState";

/* Warning: This widget can only be loaded dynamically. 
   For more information, see: 
   https://nextjs.org/docs/advanced-features/dynamic-import */

interface MyComponentProps {
    className?: string;
    handleSerialData: (data: Uint8Array) => void;
    serialPortStatus: boolean;
    handlePortStatusChange: (portStatus: boolean) => void;
    serialPort: Serialport | undefined;
    handleNewSerialPort: (serialPort: Serialport) => void;
    handleRocketStateChange: (state: RocketState) => void;
};

function generatePortOutputString(port: SerialPortInfo): string {
    let output = port.port_name;

    if (port.vid !== null && port.pid !== null && port.product !== null) {
        output = `${port.port_name} ${port.vid}:${port.pid} ${port.product}`;
    }

    return output;
}

function DevicesWidget(props: MyComponentProps) {
    const [ports, setPorts] = useState<SerialPortInfo[]>([]);

    useEffect(() => {
        // retrieve the available ports on mount
        Serialport.available_ports()
            .then((ports) => {
                console.log(ports)
                setPorts(ports);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    const refreshPorts = () => {
        Serialport.available_ports()
            .then((ports) => {
                console.log(ports)
                setPorts(ports);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    function openSerialPort(port: string, baud: number) {
        if (port === "") {
            message('Please select a serial port device!', { title: 'SkyNet', type: 'error' });
            console.error("Port is empty");
            return;
        } else if (!isBaudRateValid) {
            message('Please enter a valid baud rate!', { title: 'SkyNet', type: 'error' });
            console.error("Baud rate is invalid");
            return;
        }

        // Create a new serialport instance
        const newSerialport = new Serialport({ path: port, baudRate: baud, flowControl: "Software"});
        // Set the serialport state
        props.handleNewSerialPort(newSerialport);
        console.log("Opening serial port", newSerialport);
        newSerialport.open()
            .then((port) => {
                console.log('Opened serialport', port);
                // Begin reading from the serial port
                readFromSerialPort(newSerialport);
                // Start listener for incoming data
                listenToSerialPort(newSerialport);
                props.handlePortStatusChange(true);
            })
            .catch((err) => {
                console.error("Error opening the serial port", err);
            });
    }

    function closeSerialPort() {
        console.log("Closing serial port", props.serialPort)
        props.serialPort?.close()
            .then((res) => {
                console.log("Closed")
                props.handlePortStatusChange(false);
            })
            .catch((err) => {
                console.error("Error closing the serial port", err);
            });
    }

    function getStatusFromData(latestData: string): RocketState {
        if (latestData.includes("ARMD")) {
          return RocketState.ARMED;
        } else if (latestData.includes("RECY")) {
          return RocketState.RECOVERY;
        } else if (latestData.includes("IDLE") || latestData.includes("SA")) {
          return RocketState.IDLE;
        } else if (latestData.includes("/*")) {
          return RocketState.LAUNCHED;
        } else {
          return RocketState.UNKNOWN; // Default to unknown if the data doesn't match any state
        }
      }

      function listenToSerialPort(serialport: Serialport) {
        if (serialport === undefined) {
          console.error("Serial port is not open");
          return;
        }
      
        console.log("Listening to serial port", serialport);
      
        let buffer = "";
      
        serialport.listen((data: Uint8Array) => {
          // Use TextDecoder to convert the Uint8Array to a string
          const decoder = new TextDecoder();
          const decodedString = decoder.decode(data);
          console.log("Incoming data", decodedString);
      
          // Append the incoming data to the buffer
          buffer += decodedString;
      
          // Split the buffer into an array of strings using the '\n' delimiter
          const lines = buffer.split('\n');
      
          // Iterate over the array and call handleSerialData and handleRocketStateChange with each line of data
          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i];
            const encoder = new TextEncoder();
            const lineData = encoder.encode(line);
            props.handleSerialData(lineData);
            props.handleRocketStateChange(getStatusFromData(line));
          }
      
          // Keep the last line in the buffer in case it is incomplete
          buffer = lines[lines.length - 1];
        }, false)
        .then((res) => {
          console.log('Listening to serial port', res);
        })
        .catch((err) => {
          console.error(err);
        });
      }      

    function readFromSerialPort(serialport: Serialport) {
        if (serialport === undefined) {
            console.error("Serial port is not open");
            return;
        }
        console.log("Reading from serial port", serialport);
        serialport.read({ timeout: 1 * 1000 })
            .then((data) => {
                console.log('Read data: ', data);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    const [isBaudRateValid, setIsBaudRateValid] = useState<boolean>(true);
    function setBaudRate(baudRateString: string): void {
        const validBaudRates: string[] = ['9600', '19200', '38400', '57600', '115200'];
        if (validBaudRates.includes(baudRateString)) {
            setIsBaudRateValid(true);
            const baudRate = parseInt(baudRateString, 10);
            setSerialBaudRate(baudRate);
        } else {
            setIsBaudRateValid(false);
        }
    }

    const [serialBaudRate, setSerialBaudRate] = useState<number>(115200);
    const [serialDevicePath, setSerialDevicePath] = useState<string>("");

    return (
        <Card className={props.className}>
            <Title>Devices</Title>
            {ports.length === 0 ? (
                <>
                    <Text>No serial ports found.</Text>
                    <Flex justifyContent="end" className="mt-2 space-x-2">
                        <Button
                            size="xs"
                            variant="primary"
                            onClick={refreshPorts}
                        >
                            Refresh
                        </Button>
                    </Flex>
                </>
            ) : (
                <>
                    <Text>Receiver Serial Port</Text>
                    <Dropdown
                        className="mt-2"
                        onValueChange={(value) => setSerialDevicePath(value)}
                        placeholder="Select a Port"
                    >
                        {ports.map((port) => (
                            <DropdownItem key={port.port_name} value={port.port_name} text={generatePortOutputString(port)} />
                        ))}
                    </Dropdown>
                    <Text className="mt-2">Receiver Baud Rate</Text>
                    <TextInput className="mt-2" placeholder="Input Baud Rate" defaultValue="115200" onChange={(e) => { setBaudRate(e.target.value) }} error={!isBaudRateValid} />
                    <Flex justifyContent="end" className="mt-4 space-x-2">
                        <Button
                            size="xs"
                            variant="secondary"
                            onClick={refreshPorts}
                        >
                            Refresh
                        </Button>
                        <Button
                            size="xs"
                            variant="primary"
                            onClick={() => openSerialPort(serialDevicePath, serialBaudRate)}
                        >
                            Connect
                        </Button>
                    </Flex>
                    <Text className="mt-2">Serial Control Options</Text>
                    <Flex justifyContent="end" className="mt-4 space-x-2">
                        <Button
                            size="xs"
                            variant="primary"
                            onClick={closeSerialPort}
                        >
                            Close
                        </Button>
                    </Flex>
                </>
            )}
        </Card>
    );
}


export default DevicesWidget;