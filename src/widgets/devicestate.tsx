import { Card, Metric, Text } from "@tremor/react";

interface MyComponentProps {
  className?: string;
  serialPortStatus: boolean;
  serialData: Uint8Array[];
}

function DeviceStateWidget(props: MyComponentProps) {
  const convertUint8ArrayToString = (data: Uint8Array) => {
    const decoder = new TextDecoder();
    return decoder.decode(data);
  };

  const getRocketState = () => {
    if (!props.serialPortStatus) {
      return "No Connection";
    }

    if (props.serialData.length > 0) {
      const latestData = convertUint8ArrayToString(
        props.serialData[props.serialData.length - 1]
      );

      if (latestData.includes("ARMD")) {
        return "Armed";
      } else if (latestData.includes("RECY")) {
        return "Recovery";
      } else if (latestData.includes("IDLE")) {
        return "Idle";
      } else if (latestData.includes("/*/")) {
        return "Launched";
      }
    }

    return "Unknown State";
  };

  return (
    <Card>
      <Text>Device State</Text>
      <Metric>{getRocketState()}</Metric>
    </Card>
  );
}

export default DeviceStateWidget;