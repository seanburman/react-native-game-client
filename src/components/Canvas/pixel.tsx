import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { Dimensions, LayerState, useCanvas } from "./context";

interface PixelLayerProps {
    index?: number;
    state: LayerState;
}

const PixelLayer: React.FC<PixelLayerProps> = ({ index = 0, state }) => {
    const { isReady, isEmpty, pixelDimensions, grid, addLayer, selectLayer } =
        useCanvas();
    const layerRef = useRef(state);

    useEffect(() => {
        if (!isReady) return;
        addLayer(layerRef, index);
    }, [isReady]);

    useEffect(() => {
        if (!isEmpty) {
            selectLayer(index);
        }
    }, [isEmpty]);

    return (
        <View
        style={{
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
            position: 'absolute'
        }}
        >
            {layerRef.current &&
                layerRef.current.state?.map((p, i) => (
                    <PixelMemo
                        index={i}
                        pixelDimensions={pixelDimensions}
                        color={p.color?.HEX}
                        grid={index === 0 ? grid : false}
                        key={i}
                    />
                ))}
        </View>
    );
};

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
const PixelMemo = React.memo(Pixel);

export default PixelLayer;
