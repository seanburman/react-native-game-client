import { LayoutRectangle, Text, View } from "react-native";
import { createContext, useEffect, useState } from "react";
import { PanGestureHandler, TapGestureHandler } from 'react-native-gesture-handler'
import { ColorChoice, PaletteSquare } from "./ColorSelection";

export interface CanvasProps {
    currentColor: ColorChoice,
    width: number,
    height: number,
}

const CanvasContext = createContext(undefined)

export const Canvas: React.FC<CanvasProps>= (props: CanvasProps) =>{
    const [canvasTouched, setCanvasTouched] = useState(false)
    const [canvasDimensions, setCanvasDimensions] = useState<{columns: number, rows: number}>()
    const [pixelDimensions, setPixelDimensions] = useState<{width: number, height: number}>()
    const [panCoords, setPanCoords] = useState<{x: number, y: number}>()
    const [pixelProps, setPixelProps] = useState<PixelProps[]>();
    console.log(panCoords)

    useEffect(() => {
        if(!props.currentColor || !canvasDimensions || !pixelDimensions) {
            return
        }
        const pixels: PixelProps[] = []
        for (let i = 0; i < (props.width * props.height); i++) {
            pixels.push({
                index: i, 
                canvasTouched: canvasTouched, 
                panCoords: panCoords,
                currentColor: props.currentColor,
                canvasDimensions: canvasDimensions,
                pixelDimensions: pixelDimensions,
            })
        }
        setPixelProps(pixels)
    },[canvasTouched, panCoords, props.currentColor, canvasDimensions, pixelDimensions])

    function handlePanStart(){
        setCanvasTouched(true)
    }

    function handlePanStop(){
        setCanvasTouched(false)
    }

    function handleGestureEvent(e: {x: number, y: number}) {
        setPanCoords(e)
    }

    function handleLayoutChange({width, height}: LayoutRectangle) {
        setPixelDimensions({width: width/props.width, height: height/props.height})
    }

    useEffect(() => {
        setCanvasDimensions({columns: props.width, rows: props.height})
    },[props.width, props.height])

    return (
        <TapGestureHandler
            maxDelayMs={1}
            onGestureEvent={(e) => handleGestureEvent({x: e.nativeEvent.x, y: e.nativeEvent.y})}
            onBegan={handlePanStart}
            onActivated={handlePanStart}
            onEnded={handlePanStop}
            onCancelled={handlePanStop}
            onFailed={handlePanStop}>
            <PanGestureHandler
                activeOffsetX={4}
                onGestureEvent={(e) => handleGestureEvent({x: e.nativeEvent.x, y: e.nativeEvent.y})}
                onBegan={handlePanStart}
                onActivated={handlePanStart}
                onEnded={handlePanStop}
                onCancelled={handlePanStop}
                onFailed={handlePanStop}>
                <View
                    onLayout={(e) => handleLayoutChange(e.nativeEvent.layout)}
                    style={{
                    width: '100%',
                    height: '100%',
                    flexDirection: 'row',
                    flexWrap: 'wrap'
                    // backgroundColor: 'red'
                    }}>
                        {
                            pixelProps &&
                            pixelProps.map((props, i) => (
                                <Pixel {...props} key={i}/>
                            ))
                        }
                </View>
            </PanGestureHandler>
        </TapGestureHandler>
    )
}

interface PixelProps {
    index: number,
    canvasTouched: boolean,
    panCoords: {x: number, y: number} | undefined
    currentColor: ColorChoice | undefined 
    canvasDimensions: {columns: number, rows: number}
    pixelDimensions: {width: number, height: number}
}

interface TouchMap {
    coords: {column: number, row: number}
    bounds: {minX: number, maxX: number, minY: number, maxY: number}
}

const Pixel: React.FC<PixelProps> = ({
    index, canvasTouched, panCoords, canvasDimensions, pixelDimensions, currentColor
}) => {
    const [touchMap, setTouchMap] = useState<TouchMap | undefined>()
    const [color, setColor] = useState("transparent")

    useEffect(() => {
        if(
            canvasDimensions.columns === 0 || canvasDimensions.rows === 0 ||
            pixelDimensions.width === 0 || pixelDimensions.height === 0
        ) return 

        const row = Math.floor(index/canvasDimensions.columns)
        const column = Math.floor(index - row * canvasDimensions.columns)
        setTouchMap({
            coords: {
            column: column, 
            row: row,
            },
            bounds: {
                minX: column * pixelDimensions.width,
                maxX: column * pixelDimensions.width + pixelDimensions.width,
                minY: row * pixelDimensions.height,
                maxY: row * pixelDimensions.height + pixelDimensions.height,
            }
        })
    },[canvasDimensions, pixelDimensions])

    useEffect(() => {
        if(!canvasTouched || !touchMap || !currentColor || !panCoords) {
            return
        }
        if(
            panCoords.x >= touchMap.bounds.minX &&
            panCoords.x <= touchMap.bounds.maxX &&
            panCoords.y >= touchMap.bounds.minY &&
            panCoords.y <= touchMap.bounds.maxY
        ) {
            setColor(currentColor.HEX)
        }
    },[canvasTouched, panCoords, currentColor])

    return (
        <View
            style={{
                // borderWidth: 1,
                borderColor: 'black',
                width: pixelDimensions.width,
                height: pixelDimensions.height,
                backgroundColor: color,
            }}></View>
    )
}