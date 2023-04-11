import { Button, Card, Metric, Text } from "@tremor/react";
import { RocketState } from "@/utils/types/rocketState";
import RocketLaunchIcon from "@heroicons/react/24/outline/RocketLaunchIcon"
import { confirm } from "@tauri-apps/api/dialog";
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
        const confirmed = await confirm('This will arm the SkyNet transmitter for launch. Are you sure?', { title: 'SkyNet', type: 'warning' });
        if (confirmed) {
            console.log("Arming rocket");
            setIsArming(true);
            // Write to serial port "SA" for STATE_ARMED
            writeToSerialPort("SA");
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
              <Button icon={RocketLaunchIcon} color="red" className="mt-4" onClick={armRocket} loadingText="Arming..." loading={isArming}>
                  ARM
              </Button>
            )}
        </Card>
    );
}

export default DeviceStateWidget;