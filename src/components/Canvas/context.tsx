import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { ColorChoice, RGBA } from "./ColorSelection"
import { LayoutRectangle } from "react-native"

export type SavedCanvas = {
    data: Map<number, Omit<RGBA, "string">>
}

export type CanvasResolution = {
    columns: number, 
    rows: number,
}

export type Dimensions = {
    width: number, 
    height: number,
}

export type TouchCoords = {
    x: number, 
    y: number,
}

export type PixelCoords = {
    column: number,
    row: number,
}

type CanvasContextData = {
    // To be consumed by future implementations
    touchCoords: TouchCoords | undefined
    // Consumed by useCanvasPixel hook
    canvasResolution: CanvasResolution | undefined
    // Consumed by useCanvasPixel hook
    pixelDimensions: Dimensions | undefined,
    // Consumed by useCanvasPixel hook
    isTouched: PixelCoords | undefined,
    // Consumed by useCanvasPixel hook
    currentColor: ColorChoice | undefined,
}

export type CanvasContextState = CanvasContextData & {
    // Set by user
    setCanvasResolution: (dimensions: CanvasResolution) => void,
    // Set with onLayout by View containing pixels
    setCanvasLayout: (layout: LayoutRectangle) => void,
    // Set by GestureHandler onGestureEvent
    setTouchCoords: (coords: TouchCoords | undefined) => void,
    // Set by ColorSelection
    setCurrentColor: (color: ColorChoice) => void,
}

const CanvasContext = createContext<CanvasContextState | undefined>(undefined)

export function CanvasProvider({children}: React.PropsWithChildren) {
    const [canvasResolution, _setCanvasResolution] = useState<CanvasResolution>()
    const [canvasLayout, _setCanvasLayout] = useState<LayoutRectangle>()
    const [pixelDimensions, setPixelDimensions] = useState<Dimensions>()
    const [touchCoords, _setTouchCoords] = useState<TouchCoords>()
    const [isTouched, setIsTouched] = useState<PixelCoords>()
    const [currentColor, _setCurrentColor] = useState<ColorChoice>()

    const setCanvasResolution = useCallback((resolution: CanvasResolution) => {
        if(resolution.columns < 4 || resolution.rows < 4) {
            throw new Error("CanvasResolution must be at least 4 width and 4 height")
        }
        _setCanvasResolution(resolution)
    },[])

    const setCanvasLayout = useCallback((layout: LayoutRectangle) => {
        if(layout.height <= 0 || layout.width <= 0) {
            throw new Error(`canvas is hidden by parent with dimensions: ${layout}`)
        }
        _setCanvasLayout(layout)
    },[])

    const setTouchCoords = useCallback((coords: TouchCoords | undefined) => {
        if(!canvasResolution) {
            throw new Error(`canvasResolution must be set`)
        }
        if(!canvasLayout) {
            throw new Error(`canvasLayout must be set`)
        }
        if(!pixelDimensions) {
            throw new Error(`pixelDimensions not set by CanvasProvider`)
        }
        _setTouchCoords(coords)
        if(coords) {
            setIsTouched({
                column: Math.floor(coords.x/pixelDimensions.width), 
                row: Math.floor(coords.y/pixelDimensions.height)
            })
        }
    },[canvasResolution, canvasLayout, pixelDimensions])

    const setCurrentColor = useCallback((color: ColorChoice) => {
        const poundHEX = /^#[0-9A-F]{6}$/i
        const noPoundHEX = /^[0-9A-F]{6}$/i;
        const RGBA = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
        if(!poundHEX.test(color.HEX) && !noPoundHEX.test(color.HEX)) {
            throw new Error("invalid HEX string in call to setCurrentColor")
        }
        if(!RGBA.test(color.RGBA.string)) {
            throw new Error("invalid RGBA string in call to setCurrentColor")
        }
        _setCurrentColor(color)
    },[])
    
    useEffect(() => {
        if(!canvasLayout || !canvasResolution) {
            return
        }
        setPixelDimensions({
            width: canvasLayout.width/canvasResolution.columns, 
            height: canvasLayout.height/canvasResolution.rows
        })
    }, [canvasLayout, canvasResolution])

    const canvasContextValue: CanvasContextState = {
        touchCoords,
        canvasResolution,
        pixelDimensions,
        isTouched,
        currentColor,
        setCanvasResolution,
        setCanvasLayout,
        setTouchCoords,
        setCurrentColor,
    }
    return <CanvasContext.Provider value={canvasContextValue}>{children}</CanvasContext.Provider>
}

export const useCanvas = () => {
    const context = useContext(CanvasContext)
    if(!context) {
        throw new Error("useCanvas must be used within a CanvasContext provider")
    }
    return context
}
export const useCanvasPixel = (index: number) => {
    const context = useContext(CanvasContext)
    if(!context) {
        throw new Error("useCanvasPixel must be used within a CanvasContext provider")
    }

    
    const touchCallback = useCallback(() => {
        return (context.canvasResolution && context.isTouched &&
            context.isTouched.column === index%context.canvasResolution.columns &&
            context.isTouched.row === Math.floor(index/context.canvasResolution.columns))
        }, [context.isTouched])

    if(touchCallback() === true) {
        console.log(context.isTouched)
    }
    
    const colorRef = useRef<ColorChoice | undefined>(undefined)
    const pixelDimensionsRef = useRef(context.pixelDimensions)

    useEffect(() => {
        // console.log(index)
        // console.log(context.currentColor)
        colorRef.current = context.currentColor 
        // console.log(colorTest)
    }, [touchCallback()])
    // if(context.isTouched && context.canvasResolution &&
    //     context.isTouched.column === index%context.canvasResolution.columns &&
    //     context.isTouched.row === Math.floor(index/context.canvasResolution.columns)
    // ) {
        
    // }

    return {
        isTouched: touchCallback()?.valueOf(), 
        currentColor: colorRef, 
        pixelDimensions: pixelDimensionsRef
    }

}