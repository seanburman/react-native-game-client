import { View } from "react-native";
import { useEffect } from "react";
import { PanGestureHandler, TapGestureHandler } from 'react-native-gesture-handler'
import { ColorChoice } from "../ColorSelection";
import { useCanvas } from "./context";

export interface OldCanvasProps {
    currentColor: ColorChoice,
    width: number,
    height: number,
}

export const Canvas: React.FC<OldCanvasProps>= (props: OldCanvasProps) => {
    const {
        pixels,
        pixelDimensions,
        setCanvasResolution, 
        setCanvasLayout,
        setTouchCoords,
    } = useCanvas()

    function handleTouchStop(){
        setTouchCoords(undefined)
    }

    function handleGestureEvent(e: {x: number, y: number}) {
        setTouchCoords(e)
    }

    useEffect(() => {
        setCanvasResolution({columns: props.width, rows: props.height})
    },[props.width, props.height])

    return (
        <TapGestureHandler
            maxDelayMs={1}
            onGestureEvent={(e) => handleGestureEvent({x: e.nativeEvent.x, y: e.nativeEvent.y})}
            onBegan={(e) => handleGestureEvent({x: e.nativeEvent.x as number, y: e.nativeEvent.y as number})}
            onActivated={(e) => handleGestureEvent({x: e.nativeEvent.x as number, y: e.nativeEvent.y as number})}
            onEnded={(handleTouchStop)}
            onCancelled={handleTouchStop}
            onFailed={handleTouchStop}>
            <PanGestureHandler
                activeOffsetX={1}
                activeOffsetY={1}
                onGestureEvent={(e) => handleGestureEvent({x: e.nativeEvent.x, y: e.nativeEvent.y})}
                // onBegan={handlePanStart}
                // onActivated={handlePanStart}
                onEnded={handleTouchStop}
                onCancelled={handleTouchStop}
                onFailed={handleTouchStop}>
                <View
                    onLayout={(e) => setCanvasLayout(e.nativeEvent.layout)}
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        flexWrap: 'wrap'}}>
                    {
                        pixels?.map((p, i) => (
                            <View
                                style={{
                                    width: pixelDimensions?.width,
                                    height: pixelDimensions?.height,
                                    backgroundColor: p.color?.HEX
                                }}
                                key={i}/>
                        ))
                    }
                </View>
            </PanGestureHandler>
        </TapGestureHandler>
    )
}