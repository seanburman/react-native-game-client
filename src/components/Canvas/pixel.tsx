import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import {
    Dimensions,
    PixelLayerState,
    PixelStateProps,
    useCanvas,
    useCanvasLayer,
} from "./context";

interface PixelLayerProps {
    index?: number
    state: PixelLayerState
}
const PixelLayer: React.FC<PixelLayerProps> = ({ index = 0, state}) => {
    const {
        isReady,
        isEmpty,
        pixelDimensions,
        grid,
        addPixelLayer,
        selectPixelLayer,
    } = useCanvas();
    const layerRef = useRef<PixelStateProps[] | undefined>();
    const layerState = useCanvasLayer(layerRef);
    state.setState(layerRef.current)

    useEffect(() => {
        if (!isReady) return;
        addPixelLayer(layerRef, index);
    }, [isReady]);

    useEffect(() => {
        if (!isEmpty) {
            selectPixelLayer(index);
        }
    }, [isEmpty]);

    return (
        <>
            {layerState &&
                layerState.map((_, i) => (
                    <PixelMemo
                        index={i}
                        pixelDimensions={pixelDimensions}
                        color={layerRef!.current![i].color?.HEX}
                        grid={grid}
                        key={i}
                    />
                ))}
        </>
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
                backgroundColor: props.color,
                borderBottomWidth: props.grid ? 1 : 0,
                borderRightWidth: props.grid ? 1 : 0,
                borderColor: "rgba(0,0,0,.25)",
            }}
        ></View>
    );
};
const PixelMemo = React.memo(Pixel);

export default PixelLayer;