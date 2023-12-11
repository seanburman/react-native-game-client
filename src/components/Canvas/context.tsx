import React, {
    MutableRefObject,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { ColorChoice } from "../ColorSelection";
import { LayoutRectangle } from "react-native";

export class PixelLayerState {
    public name: string;
    private state: PixelStateProps[];
    private history: PixelStateProps[][];
    private historyIndex: number;
    constructor(name: string) {
        this.name = name;
        this.state = [];
        this.history = [];
        this.historyIndex = 0;
    }

    getState = () => this.state;
    setState(state: PixelStateProps[]) {
        this.state = state;
        this.history = this.history.slice(0, this.historyIndex);
        this.history.push(state);
        this.historyIndex = this.history.length - 1;
    }

    getHistory = () => this.history;
    historyPrev() {
        if (this.historyIndex === 0) return;
        this.historyIndex--;
        this.state = this.history[this.historyIndex];
    }
    historyNext() {
        if (this.historyIndex === this.history.length - 1) return;
        this.historyIndex++;
        this.state = this.history[this.historyIndex];
    }
}

export type PixelStateProps = {
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
    // Indicates that canvas is intialized with appropriate dimensions
    // and ready to accept pixels
    isReady: boolean;
    // Indicates that the canvas is empty
    isEmpty: boolean;
    // Consumed by view rendering pixels
    selectedRef: React.MutableRefObject<
        React.MutableRefObject<PixelStateProps[] | undefined> | undefined
    >;
    selectedPixels: PixelStateProps[] | undefined;
    pixelLayers: React.MutableRefObject<
        React.MutableRefObject<PixelStateProps[] | undefined>[] | undefined
    >;
    // Consumed by useCanvasPixel hook
    currentColor: ColorChoice | undefined;
    // Consumed by canvas to toggle grid view
    grid: boolean;
    // To be consumed by future implementations
    touchCoords: TouchCoords | undefined;
    // Coordinates column and row of last touched pixel
    pixelTouched: PixelCoords | undefined;
};

export type CanvasContextState = CanvasContextData & {
    // Set by user
    setCanvasResolution: (dimensions: CanvasResolution) => void;
    // Set with onLayout by View containing pixels
    setCanvasLayout: (layout: LayoutRectangle) => void;
    // Set by GestureHandler onGestureEvent
    setTouchCoords: (coords: TouchCoords | undefined) => void;
    addPixelLayer: (
        ref: React.MutableRefObject<PixelStateProps[] | undefined>,
        index: number
    ) => void;
    selectPixelLayer: (index: number) => void;
    movePixelLayer: (prevIndex: number, newIndex: number) => void;
    clearPixelLayer: () => void;
    // Set by ColorSelection
    setCurrentColor: (color: ColorChoice) => void;
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
    const [currentColor, _setCurrentColor] = useState<ColorChoice>();
    const [grid, setGrid] = useState(true);
    const [isReady, setIsReady] = useState(false);
    const selectedRef =
        useRef<MutableRefObject<PixelStateProps[] | undefined>>();
    const selectedPixels = useMemo(
        () => selectedRef.current?.current,
        [selectedRef.current?.current]
    );
    const pixelLayers =
        useRef<MutableRefObject<PixelStateProps[] | undefined>[]>();
    const [isEmpty, setIsEmpty] = useState(true);
    const [pixelTouched, setPixelTouched] = useState<PixelCoords>();

    const setCanvasResolution = useCallback((resolution: CanvasResolution) => {
        if (resolution.columns < 4 || resolution.rows < 4) {
            throw new Error(
                "CanvasResolution must be at least 4 width and 4 height"
            );
        }
        _setCanvasResolution(resolution);
    }, []);

    const newPixels = useCallback(() => {
        if (!(canvasResolution && pixelDimensions)) {
            return;
        }
        let newPixels: PixelStateProps[] = [];
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
    }, [canvasResolution, pixelDimensions]);

    // TouchCoords are set by TapGesture or PanGesture wrapping the containing view
    const setTouchCoords = useCallback(
        (coords: TouchCoords | undefined) => {
            if (!pixelDimensions) {
                throw new Error(`pixelDimensions not set by CanvasProvider`);
            }
            // console.log(coords)
            // _setTouchCoords(coords)

            if (!coords) return;

            const column = Math.floor(coords.x / pixelDimensions.width);
            const row = Math.floor(coords.y / pixelDimensions.height);

            // TODO: Use this for other feedback for user
            // setIsTouched({column, row})
            //

            drawPixel({ column, row });
        },
        [canvasResolution, canvasLayout, pixelDimensions, currentColor]
    );

    const drawPixel = ({ column, row }: PixelCoords) => {
        if (!canvasResolution) {
            throw new Error(`canvasResolution must be set`);
        }
        if (!canvasLayout) {
            throw new Error(`canvasLayout must be set`);
        }
        if (!selectedRef.current?.current) {
            return;
        }

        // make sure touch coords is within bounds of canvas before attempting to update
        if (
            column < canvasResolution.columns &&
            column >= 0 &&
            row < canvasResolution.rows &&
            row >= 0
        ) {
            const index = row * canvasResolution.columns + column;
            selectedRef.current.current[index].color = currentColor;
            setPixelTouched({ column, row });
        }
    };

    const addPixelLayer = useCallback(
        (
            ref: React.MutableRefObject<PixelStateProps[] | undefined>,
            index: number
        ) => {
            const emptyPixels = newPixels();
            if (!emptyPixels) return;
            if (!pixelLayers.current) {
                pixelLayers.current = [];
            }
            ref.current = emptyPixels;
            if (emptyPixels) {
                pixelLayers.current.splice(index, 0, ref);
            }
        },
        [pixelLayers, newPixels]
    );

    const selectPixelLayer = useCallback(
        (index: number) => {
            if (!pixelLayers.current) {
                throw new Error("pixelLayers is not initialized");
            }
            selectedRef.current = pixelLayers.current[index];
        },
        [pixelLayers.current, selectedPixels]
    );

    const movePixelLayer = useCallback(
        (prevIndex: number, newIndex: number) => {
            if (!pixelLayers.current) {
                throw new Error("pixelLayers is not initialized");
            }
            pixelLayers.current.splice(
                newIndex,
                0,
                pixelLayers.current.splice(prevIndex, 1)[0]
            );
        },
        []
    );

    const clearPixelLayer = useCallback(() => {
        const emptyPixels = newPixels();
        if (!emptyPixels) return;
        if (!selectedRef.current) return;
        selectedRef.current.current = emptyPixels;
        console.log(selectedRef.current.current);
    }, [selectedRef.current?.current]);

    // Set current selected color by color picker or user input
    const setCurrentColor = useCallback(
        (color: ColorChoice) => {
            const poundHEX = /^#[0-9A-F]{6}$/i;
            const noPoundHEX = /^[0-9A-F]{6}$/i;
            const RGBA =
                /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/;
            if (!poundHEX.test(color.HEX) && !noPoundHEX.test(color.HEX)) {
                throw new Error(
                    "invalid HEX string in call to setCurrentColor"
                );
            }
            if (!RGBA.test(color.RGBA.string)) {
                throw new Error(
                    "invalid RGBA string in call to setCurrentColor"
                );
            }
            _setCurrentColor(color);
        },
        [currentColor]
    );

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

    // Flag when context is ready to accept pixels
    useEffect(() => {
        if (pixelDimensions) {
            setIsReady(true);
        }
    }, [pixelDimensions]);

    // Flag if canvas is empty
    useEffect(() => {
        if (!pixelLayers.current) {
            setIsEmpty(true);
            return;
        }
        setIsEmpty(false);
    });

    const canvasContextValue: CanvasContextState = {
        canvasResolution,
        pixelDimensions,
        isReady,
        isEmpty,
        selectedRef,
        selectedPixels,
        pixelLayers,
        touchCoords,
        pixelTouched,
        currentColor,
        grid,
        clearPixelLayer,
        setCanvasResolution,
        setCanvasLayout,
        setTouchCoords,
        addPixelLayer,
        selectPixelLayer,
        movePixelLayer,
        setCurrentColor,
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

export const useCanvasLayer = (
    ref: React.MutableRefObject<PixelStateProps[] | undefined>
) => {
    const { selectedRef, pixelTouched, grid } = useCanvas();
    const [layerState, setLayerState] = useState(ref.current);

    useEffect(() => {
        if (selectedRef.current && !(ref == selectedRef.current)) return;
        setLayerState(ref.current);
    }, [ref.current, pixelTouched, grid]);

    return layerState;
};
