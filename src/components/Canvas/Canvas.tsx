import { LayoutRectangle, Text, View } from "react-native";
import { createContext, useEffect, useState } from "react";
import { PanGestureHandler, TapGestureHandler } from 'react-native-gesture-handler'
import { ColorChoice, PaletteSquare } from "./ColorSelection";
import { useCanvas, useCanvasPixel } from "./context";

export interface CanvasProps {
    currentColor: ColorChoice,
    width: number,
    height: number,
}

export const Canvas: React.FC<CanvasProps>= (props: CanvasProps) => {
    const [pixelMap, setPixelMap] = useState<number[]>()
    const {
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

    useEffect(() => {
        let range: number[] = []
        for(let i=0; i<props.width*props.height; i++) {
            range.push(i)
        }
        setPixelMap(range)
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
                onGestureEvent={(e) => handleGestureEvent({x: e.nativeEvent.x, y: e.nativeEvent.y})}
                // onBegan={handlePanStart}
                // onActivated={handlePanStart}
                onEnded={handleTouchStop}
                onCancelled={handleTouchStop}
                onFailed={handleTouchStop}>
                <View
                    onLayout={(e) => setCanvasLayout(e.nativeEvent.layout)}
                    style={{
                    width: '100%',
                    height: '100%',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    // backgroundColor: 'red'
                    }}>
                    {
                        pixelMap &&
                        pixelMap.map((p) => (
                            <Pixel index={p} key={p}/>
                        ))
                    }
                </View>
            </PanGestureHandler>
        </TapGestureHandler>
    )
}

const Pixel: React.FC<{index: number}> = ({index}) => {
    // const {pixelDimensions, touched, currentColor} = useCanvasPixel(index)
    // const {isTouched, currentColor, canvasResolution ,pixelDimensions} = useCanvas()
    const canvasPixel = useCanvasPixel(index)
    const [color, setColor] = useState("transparent")

    const {
        isTouched,
        currentColor,
        pixelDimensions
    } = canvasPixel

    useEffect(() => {
    }, [canvasPixel])

    useEffect(() => {
        console.log("isTouched changed")
        if(currentColor.current) {
            console.log("new color")
            setColor(currentColor.current.HEX)
        }
    },[isTouched])
    
    console.log("rendered")
    if(color !== "transparent")
    console.log(color)
    return (
        <View
            style={{
                // borderWidth: 1,
                borderColor: 'black',
                width: pixelDimensions.current?.width || 0,
                height: pixelDimensions.current?.height || 0,
                backgroundColor: color,
            }}></View>
    )
}