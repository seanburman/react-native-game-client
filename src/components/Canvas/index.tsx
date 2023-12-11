import React, { useEffect } from "react";
import { View } from "react-native";
import {
    PanGestureHandler,
    TapGestureHandler,
} from "react-native-gesture-handler";
import { CanvasResolution, TouchCoords, useCanvas } from "./context";
import { LayerState } from "./context";

export interface CanvasProps extends CanvasResolution {}

export const Canvas: React.FC<CanvasResolution> = ({
    columns,
    rows,
}: CanvasResolution) => {
    const { setCanvasResolution, setCanvasLayout, setTouchCoords } =
        useCanvas();

    function handleTouchStop() {
        setTouchCoords(undefined);
    }

    function handleGestureEvent(e: TouchCoords) {
        setTouchCoords(e);
    }

    useEffect(() => {
        setCanvasResolution({ columns: columns, rows: rows });
    }, [columns, rows]);

    const Layer = new LayerState('layer one', 0)

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
                    {
                        Layer.component
                    }
                </View>
            </PanGestureHandler>
        </TapGestureHandler>
    );
};
