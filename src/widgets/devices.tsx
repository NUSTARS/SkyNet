import { Dropdown, DropdownItem, Card, Text } from "@tremor/react";
import { CubeIcon, CubeTransparentIcon } from "@heroicons/react/solid";

interface MyComponentProps {
    className?: string;
  }

function DevicesWidget(props: MyComponentProps) {
    return (
        <Card className={props.className}>
        <Text>Select render mode</Text>
        <Dropdown
            className="mt-2"
            onValueChange={(value) => console.log("The selected value is", value)}
            placeholder="Render mode"
        >
            <DropdownItem value="1" text="Transparent" icon={CubeTransparentIcon} />
            <DropdownItem value="2" text="Outline" icon={CubeIcon} />
        </Dropdown>
        </Card>
    )
};

export default DevicesWidget;