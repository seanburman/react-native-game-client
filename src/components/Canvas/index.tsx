import React, { useEffect } from "react";
import { View } from "react-native";
import {
    PanGestureHandler,
    TapGestureHandler,
} from "react-native-gesture-handler";
import { useCanvas } from "./context";
import Pixel from "./pixel";

export interface CanvasProps {
    columns: number;
    rows: number;
}

export const Canvas: React.FC<CanvasProps> = (props: CanvasProps) => {
    const {
        pixels,
        pixelDimensions,
        grid,
        setCanvasResolution,
        setCanvasLayout,
        setTouchCoords,
    } = useCanvas();

    function handleTouchStop() {
        setTouchCoords(undefined);
    }

    function handleGestureEvent(e: { x: number; y: number }) {
        setTouchCoords(e);
    }

    useEffect(() => {
        setCanvasResolution({ columns: props.columns, rows: props.rows });
    }, [props.columns, props.rows]);

    return (
        <TapGestureHandler
            maxDelayMs={1}
            onGestureEvent={(e) =>
                handleGestureEvent({ x: e.nativeEvent.x, y: e.nativeEvent.y })
            }
            onBegan={(e) =>
                handleGestureEvent({
                    x: e.nativeEvent.x as number,
                    y: e.nativeEvent.y as number,
                })
            }
            onActivated={(e) =>
                handleGestureEvent({
                    x: e.nativeEvent.x as number,
                    y: e.nativeEvent.y as number,
                })
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
                    {pixels?.map((p, i) => (
                        <Pixel
                            index={i}
                            pixelDimensions={pixelDimensions}
                            color={p.color?.HEX}
                            grid={grid}
                            key={i}
                        />
                    ))}
                </View>
            </PanGestureHandler>
        </TapGestureHandler>
    );
};
