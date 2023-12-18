import React from "react";
import { View } from "react-native";
import { Dimensions } from "../../../types/canvas.type";

interface PixelProps {
    pixelDimensions?: Dimensions;
    color?: string;
    grid: boolean;
    index: number;
}
const Pixel: React.FC<PixelProps> = (props: PixelProps) => {
    return (
        <View
            style={{
                width: props.pixelDimensions?.width,
                height: props.pixelDimensions?.height,
                backgroundColor: props.color ? props.color : "transparent",
                borderBottomWidth: props.grid ? 1 : 0,
                borderRightWidth: props.grid ? 1 : 0,
                borderColor: "rgba(0,0,0,.25)",
            }}
        ></View>
    );
};
export default React.memo(Pixel);
