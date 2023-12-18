import React, { useEffect } from "react";
import { View } from "react-native";
import {
    PanGestureHandler,
    TapGestureHandler,
} from "react-native-gesture-handler";
import { useCanvas } from "./context/canvas.context";
import { CanvasResolution, TouchCoords } from "../../types/canvas.type";
import Pixel from "./components/pixel.component";

export type CanvasProps = CanvasResolution & {
};
export const Canvas: React.FC<CanvasProps> = ({ columns, rows}) => {
    const {
        setCanvasResolution,
        setCanvasLayout,
        setTouchCoords,
        layers,
        selectedLayer,
        pixelDimensions,
        grid,
    } = useCanvas();

    console.log(pixelDimensions)
    function handleTouchStop() {
        setTouchCoords(undefined);
    }

    function handleGestureEvent(e: TouchCoords) {
        setTouchCoords(e);
    }

    useEffect(() => {
        setCanvasResolution({ columns: columns, rows: rows });
    }, [columns, rows]);

    return (
        <TapGestureHandler
            maxDelayMs={1}
            onGestureEvent={(e) =>
                handleGestureEvent({ x: e.nativeEvent.x, y: e.nativeEvent.y })
            }
            onBegan={(e) =>
                handleGestureEvent({
                    x: e.nativeEvent.x,
                    y: e.nativeEvent.y,
                } as TouchCoords)
            }
            onActivated={(e) =>
                handleGestureEvent({
                    x: e.nativeEvent.x,
                    y: e.nativeEvent.y,
                } as TouchCoords)
            }
            onEnded={handleTouchStop}
            onCancelled={handleTouchStop}
            onFailed={handleTouchStop}
        >
            <PanGestureHandler
                activeOffsetX={1}
                activeOffsetY={1}
                onGestureEvent={(e) =>
                    handleGestureEvent({
                        x: e.nativeEvent.x,
                        y: e.nativeEvent.y,
                    })
                }
                onEnded={handleTouchStop}
                onCancelled={handleTouchStop}
                onFailed={handleTouchStop}
            >
                <View
                    onLayout={(e) => setCanvasLayout(e.nativeEvent.layout)}
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        flexWrap: "wrap",
                    }}
                >
                    {layers.map((layer, i) => (
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    position: "absolute",
                                    zIndex: layer.state.index * -100 || 0,
                                }}
                                key={i}
                            >
                                {layer.state.pixels.map((p, i) => (
                                    <Pixel
                                        index={i}
                                        pixelDimensions={pixelDimensions}
                                        color={p.color?.HEX}
                                        // color={"red"}
                                        grid={(layer.state.index === selectedLayer && grid)}
                                        key={i}
                                    />
                                ))}
                            </View>
                        ))}
                </View>
            </PanGestureHandler>
        </TapGestureHandler>
    );
};
