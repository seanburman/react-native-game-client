import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { ColorChoice } from "../ColorSelection";
import { LayoutRectangle } from "react-native";
import { cloneDeep } from "lodash";

export type PixelProps = {
    color: ColorChoice | undefined;
};

export type CanvasResolution = {
    columns: number;
    rows: number;
};

export type Dimensions = {
    width: number;
    height: number;
};

export type TouchCoords = {
    x: number;
    y: number;
};

export type PixelCoords = {
    column: number;
    row: number;
};

type CanvasContextData = {
    // Consumed by useCanvasPixel hook
    canvasResolution: CanvasResolution | undefined;
    // Consumed by useCanvasPixel hook
    pixelDimensions: Dimensions | undefined;
    // Consumed by view rendering pixels
    pixels: PixelProps[] | undefined;
    // Consumed by useCanvasPixel hook
    currentColor: ColorChoice | undefined;
    // Consumed by canvas to toggle grid view
    grid: boolean;
    // To be consumed by future implementations
    touchCoords: TouchCoords | undefined;
};

export type CanvasContextState = CanvasContextData & {
    // Set by user
    setCanvasResolution: (dimensions: CanvasResolution) => void;
    // Set with onLayout by View containing pixels
    setCanvasLayout: (layout: LayoutRectangle) => void;
    // Set by GestureHandler onGestureEvent
    setTouchCoords: (coords: TouchCoords | undefined) => void;
    // Set by ColorSelection
    setCurrentColor: (color: ColorChoice) => void;
    // Clears the canvas
    clearCanvas: () => void;
    // Toggles grid
    setGrid: (on: boolean) => void;
};

const CanvasContext = createContext<CanvasContextState | undefined>(undefined);

export function CanvasProvider({ children }: React.PropsWithChildren) {
    const [canvasResolution, _setCanvasResolution] =
        useState<CanvasResolution>();
    const [canvasLayout, setCanvasLayout] = useState<LayoutRectangle>();
    const [pixelDimensions, setPixelDimensions] = useState<Dimensions>();
    const [touchCoords, _setTouchCoords] = useState<TouchCoords>();
    const [pixels, setPixels] = useState<PixelProps[]>();
    const [currentColor, _setCurrentColor] = useState<ColorChoice>();
    const [grid, setGrid] = useState(true);

    const setCanvasResolution = useCallback((resolution: CanvasResolution) => {
        if (resolution.columns < 4 || resolution.rows < 4) {
            throw new Error(
                "CanvasResolution must be at least 4 width and 4 height"
            );
        }
        _setCanvasResolution(resolution);
    }, []);

    // TouchCoords are set by TapGesture or PanGesture wrapping the containing view
    const setTouchCoords = useCallback(
        (coords: TouchCoords | undefined) => {
            if (!canvasResolution) {
                throw new Error(`canvasResolution must be set`);
            }
            if (!canvasLayout) {
                throw new Error(`canvasLayout must be set`);
            }
            if (!pixelDimensions) {
                throw new Error(`pixelDimensions not set by CanvasProvider`);
            }
            // console.log(coords)
            // _setTouchCoords(coords)

            if (!coords) {
                return;
            }
            const touchColumn = Math.floor(coords.x / pixelDimensions.width);
            const touchRow = Math.floor(coords.y / pixelDimensions.height);

            // TODO: Use this for other feedback for user
            // setIsTouched({
            //     column: touchColumn,
            //     row: touchRow
            // })
            //
            if (!pixels) {
                return;
            }
            // Update touched pixel
            const pixelsCopy = cloneDeep(pixels);

            // make sure pan is within bounds of canvas before attempting to update
            if (
                touchColumn < canvasResolution.columns &&
                touchRow < canvasResolution.rows &&
                touchColumn >= 0 &&
                touchRow >= 0
            ) {
                pixelsCopy[
                    touchRow * canvasResolution.columns + touchColumn
                ].color = currentColor;
            }
            setPixels(pixelsCopy);
        },
        [canvasResolution, canvasLayout, pixelDimensions, pixels, currentColor]
    );

    // Set current selected color by color picker or user input
    const setCurrentColor = useCallback((color: ColorChoice) => {
        const poundHEX = /^#[0-9A-F]{6}$/i;
        const noPoundHEX = /^[0-9A-F]{6}$/i;
        const RGBA =
            /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/;
        if (!poundHEX.test(color.HEX) && !noPoundHEX.test(color.HEX)) {
            throw new Error("invalid HEX string in call to setCurrentColor");
        }
        if (!RGBA.test(color.RGBA.string)) {
            throw new Error("invalid RGBA string in call to setCurrentColor");
        }
        _setCurrentColor(color);
    }, [currentColor]);

    const clearCanvas = useCallback(() => setPixels(newPixels()), []);

    const newPixels = () => {
        if (!(canvasResolution && pixelDimensions)) {
            return;
        }
        let newPixels: PixelProps[] = [];
        for (
            let i = 0;
            i < canvasResolution.columns * canvasResolution.rows;
            i++
        ) {
            newPixels = [
                ...newPixels,
                {
                    color: undefined,
                },
            ];
        }
        return newPixels;
    };

    // Set pixel dimensions as calculated by Canvas containing View
    // and the dimensions of the canvas in pixels
    useEffect(() => {
        if (!(canvasLayout && canvasResolution)) {
            return;
        }
        setPixelDimensions({
            width: canvasLayout.width / canvasResolution.columns,
            height: canvasLayout.height / canvasResolution.rows,
        });
    }, [canvasLayout, canvasResolution]);

    // Create new PixelProps for rendering in containing view
    useEffect(() => {
        // Don't create new pixels if they already exist
        if (pixels) {
            return;
        }
        setPixels(newPixels());
    }, [pixels, canvasLayout, canvasResolution, pixelDimensions]);

    const canvasContextValue: CanvasContextState = {
        pixels,
        touchCoords,
        canvasResolution,
        pixelDimensions,
        currentColor,
        grid,
        setCanvasResolution,
        setCanvasLayout,
        setTouchCoords,
        setCurrentColor,
        clearCanvas,
        setGrid,
    };
    return (
        <CanvasContext.Provider value={canvasContextValue}>
            {children}
        </CanvasContext.Provider>
    );
}

export const useCanvas = () => {
    const context = useContext(CanvasContext);
    if (!context) {
        throw new Error(
            "useCanvas must be used within a CanvasContext provider"
        );
    }
    return context;
};
