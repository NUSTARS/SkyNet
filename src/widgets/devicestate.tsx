import { Button, Card, Flex, Metric, Text, TextInput } from "@tremor/react";
import { RocketState } from "@/utils/types/rocketState";
import RocketLaunchIcon from "@heroicons/react/24/outline/RocketLaunchIcon"
import { confirm, message } from "@tauri-apps/api/dialog";
import { Serialport } from "tauri-serialport";
import { useEffect, useState } from "react";
interface MyComponentProps {
    className?: string;
    serialPortStatus: boolean;
    rocketState: RocketState;
    serialPort: Serialport | undefined;
}

function DeviceStateWidget(props: MyComponentProps) {

    const [isArming, setIsArming] = useState(false);
    const [seaLevelPressure, setSeaLevelPressure] = useState(0);

    function getStateText(state: RocketState) {
        if (!props.serialPortStatus) {
            return "No Connection";
        }
        switch (state) {
            case RocketState.IDLE:
                return "Idle";
            case RocketState.ARMED:
                return "Armed";
            case RocketState.LAUNCHED:
                return "Launched";
            case RocketState.RECOVERY:
                return "Recovery";
            case RocketState.UNKNOWN:
                return "Unknown";
            default:
                return "";
        }
    }

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

    const writeToSerialPort = (command: String) => {
        if (props.serialPort === undefined) {
            console.error("Serial port is not open");
            return;
        }
        props.serialPort.cancelRead();
        props.serialPort.write(command + "\n")
            .then((data) => {
                console.log('Wrote data: ', data);
                readFromSerialPort();
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const armRocket = async () => {
        // Check if sea level pressure is set and valid
        // It must be between 850 and 1100 HPa in integer form
        let seaLevelPressureString: string;
        if (seaLevelPressure === 0) {
            console.error("Sea level pressure is not set");
            message("Sea level pressure is not set", { title: 'SkyNet', type: 'error' });
            return;
        } else if (seaLevelPressure < 900 || seaLevelPressure > 1100) {
            console.error("Sea level pressure is not valid");
            message("Sea level pressure is not valid", { title: 'SkyNet', type: 'error' });
            return;
        } else if (Number.isInteger(seaLevelPressure) === false) {
            console.error("Sea level pressure is not an integer");
            message("Sea level pressure is not an integer", { title: 'SkyNet', type: 'error' });
            return;
        } else {
            seaLevelPressureString = seaLevelPressure.toString().padStart(4, '0');
        }
        const confirmed = await confirm('This will arm the SkyNet transmitter for launch. Are you sure?', { title: 'SkyNet', type: 'warning' });
        if (confirmed) {
            console.log("Arming rocket");
            console.log("SA" + seaLevelPressureString);
            setIsArming(true);
            // Write to serial port "SA" for STATE_ARMED
            writeToSerialPort("SA" + seaLevelPressureString);
        } else {
            console.log("Cancelled arming rocket");
        }
    }

    useEffect(() => {
        if (props.rocketState === RocketState.ARMED) {
            setIsArming(false);
        }
    }, [props.rocketState]);

    return (
        <Card>
            <Text>Device State</Text>
            <Metric>{getStateText(props.rocketState)}</Metric>
            {props.serialPortStatus && props.rocketState === RocketState.IDLE && (
                <Flex className="space-x-2 mt-4">
                    <TextInput placeholder="Sea Level Pressure (HPa)" onChange={(e) => setSeaLevelPressure(Number(e.target.value))} />
                    <Button icon={RocketLaunchIcon}
                        color="red"
                        onClick={armRocket}
                        loadingText="Arming..."
                        loading={isArming}>
                        ARM
                    </Button>
                </Flex>
            )}
        </Card>
    );
}

export default DeviceStateWidget;