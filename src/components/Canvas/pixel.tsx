import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import {
    Dimensions,
    LayerState,
    useCanvas,
} from "./context";

interface PixelLayerProps {
    index?: number;
    state: LayerState;
}
const PixelLayer: React.FC<PixelLayerProps> = ({ index = 0, state }) => {
    const {
        isReady,
        isEmpty,
        pixelDimensions,
        grid,
        pixelTouched,
        selectedLayer,
        addLayer,
        selectLayer,
    } = useCanvas();
    const layerRef = useRef(state);
 
    // const [pixels, setPixels] = useState(layerRef.current.state);

    // useEffect(() => {
    //     if(layerRef.current.state) {
    //         console.log("pixel state being set")
    //         console.log(state.state)
    //     }
    //     setPixels(layerRef.current.state);
    //     console.log(selectedLayer.current?.current.state === state.state)
    // }, [layerRef.current.state, pixelTouched, grid]);

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
        <>
            {layerRef.current &&
                layerRef.current.state?.map((p, i) => (
                    <PixelMemo
                        index={i}
                        pixelDimensions={pixelDimensions}
                        color={p.color?.HEX}
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
