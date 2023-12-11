import React, {
    ReactElement,
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
import PixelLayer from "./pixel";

export type PixelStateProps = {
    color: ColorChoice | undefined;
};

export class LayerState {
    public name: string;
    public state: PixelStateProps[] | undefined;
    public component: ReactElement;
    private history: PixelStateProps[][];
    private historyIndex: number;
    constructor(name: string, index: number) {
        this.name = name;
        this.history = [];
        this.historyIndex = 0;
        this.component = <PixelLayer index={index} state={this} />;
    }

    getState = () => this.state;
    setState(state: PixelStateProps[]) {
        this.state = state;
        // When updating state, remove trailing history items and continue history
        this.history = this.history.slice(0, this.historyIndex);
        this.history.push(this.state);
        this.historyIndex = this.history.length - 1;
    }
    colorPixel(index: number, color: ColorChoice) {
        if (!this.state) {
            throw new Error("state not initialized before coloring pixel");
        }
        this.state[index].color = color;
        console.log(this.state[index]);
        console.log(this.state[index]);
    }

    getHistory = () => this.history;
    historyPrev() {
        // At beginning of history
        if (this.historyIndex === 0) return;
        this.historyIndex--;
        if (this.state) {
            this.state = this.history[this.historyIndex];
        }
    }
    historyNext() {
        // At end of history
        if (this.historyIndex === this.history.length - 1 || !this.state)
            return;
        this.historyIndex++;
        this.state = this.history[this.historyIndex];
    }
}

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
    selectedLayer: React.MutableRefObject<
        React.MutableRefObject<LayerState> | undefined
    >;
    selectedPixels: PixelStateProps[] | undefined;
    layers: React.MutableRefObject<React.MutableRefObject<LayerState>[] | undefined>
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
    addLayer: (
        layerRef: React.MutableRefObject<LayerState>,
        index: number
    ) => void;
    selectLayer: (index: number) => void;
    moveLayer: (prevIndex: number, newIndex: number) => void;
    clearLayer: () => void;
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
    const selectedLayer = useRef<React.MutableRefObject<LayerState>>();
    const selectedPixels = useMemo(
        () => selectedLayer.current?.current.state,
        [selectedLayer.current?.current.state]
    );
    const layers = useRef<React.MutableRefObject<LayerState>[]>();
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
        if (!selectedLayer) {
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
            console.log(index);
            if (selectedLayer.current?.current && currentColor) {
                selectedLayer.current?.current.colorPixel(index, currentColor);
            }
            setPixelTouched({ column, row });
        }
    };

    const addLayer = useCallback(
        (layerRef: React.MutableRefObject<LayerState>, index: number) => {
            const emptyPixels = newPixels();
            if (!emptyPixels) return;
            if (!layers.current) {
                layers.current = [];
            }
            if (emptyPixels) {
                layerRef.current.setState(emptyPixels);
                layers.current.splice(index, 0, layerRef);
            }
        },
        [layers, newPixels]
    );

    const selectLayer = useCallback(
        (index: number) => {
            if (!layers.current) {
                throw new Error("pixelLayers is not initialized");
            }
            selectedLayer.current = layers.current[index];
        },
        [layers.current, selectedPixels]
    );

    const moveLayer = useCallback(
        (prevIndex: number, newIndex: number) => {
            if (!layers.current) {
                throw new Error("pixelLayers is not initialized");
            }
            layers.current.splice(
                newIndex,
                0,
                layers.current.splice(prevIndex, 1)[0]
            );
        },
        []
    );

    const clearLayer = useCallback(() => {
        const emptyPixels = newPixels();
        if (!emptyPixels) return;
        if (!selectedLayer) return;
        selectedLayer.current?.current.setState(emptyPixels);
        console.log(selectedLayer);
    }, [selectedLayer]);

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
        if (!layers.current) {
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
        selectedLayer,
        selectedPixels,
        layers,
        touchCoords,
        pixelTouched,
        currentColor,
        grid,
        clearLayer,
        setCanvasResolution,
        setCanvasLayout,
        setTouchCoords,
        addLayer,
        selectLayer,
        moveLayer,
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

// export const useCanvasLayer = (
//     ref: React.MutableRefObject<PixelStateProps[] | undefined>
// ) => {
//     const { selectedLayer, pixelTouched, grid } = useCanvas();
//     const [layerState, setLayerState] = useState(ref.current);

//     useEffect(() => {
//         if (selectedLayer && !(ref == selectedRef)) return;
//         setLayerState(ref.current);
//     }, [ref.current, pixelTouched, grid]);

//     return layerState;
// };
