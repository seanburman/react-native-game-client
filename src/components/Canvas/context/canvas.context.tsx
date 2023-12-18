import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { LayoutRectangle } from "react-native";
import {
    CanvasResolution,
    ColorChoice,
    Dimensions,
    PixelCoords,
    PixelStateProps,
    TouchCoords,
} from "../../../types/canvas.type";
import { Layer } from "./layer.context";
import { indexOf } from "lodash";

type CanvasContextData = {
    canvasResolution: CanvasResolution | undefined;
    pixelDimensions: Dimensions | undefined;
    currentColor: ColorChoice | undefined;
    // Consumed by canvas to toggle grid view
    grid: boolean;
    // To be consumed by future implementations
    touchCoords: TouchCoords | undefined;
    // Indicates that canvas is intialized with appropriate dimensions
    // and ready to accept pixels
    isReady: boolean;
    layers: Layer[];
    selectedLayer: number;
};

export type CanvasContextState = CanvasContextData & {
    // Set by user
    setCanvasResolution: (dimensions: CanvasResolution) => void;
    // Set with onLayout by View containing pixels
    setCanvasLayout: (layout: LayoutRectangle) => void;
    // Set by GestureHandler onGestureEvent
    // Set by ColorSelection
    setCurrentColor: (color: ColorChoice) => void;
    // Toggles grid
    setGrid: (on: boolean) => void;
    setTouchCoords: (coords: TouchCoords | undefined) => void;
    addLayer: (layer: Layer) => void;
    selectLayer: (index: number) => void;
    sortLayers: (items: Layer[]) => void;
    clearLayer: (index: number) => void;
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
    const [layers, setLayers] = useState<Layer[]>([]);
    const [selectedLayer, setSelectedLayer] = useState(0);

    const setCanvasResolution = useCallback((resolution: CanvasResolution) => {
        if (resolution.columns < 8 || resolution.rows < 8) {
            throw new Error(
                "CanvasResolution must be at least 8 width and 8 height"
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
                    color: {
                        HEX: "transparent",
                        RGBA: {
                            r: 0,
                            g: 0,
                            b: 0,
                            a: 0,
                            string: "rgba(0,0,0,0)",
                        },
                    },
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
        if (!layers[selectedLayer]) {
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
            if (currentColor && layers[selectedLayer]) {
                layers[selectedLayer].colorPixel(index, currentColor);
                setLayers((prev) => [...prev])
            }
        }
    };

    const addLayer = useCallback(
        (layer: Layer) => {
            const emptyPixels = newPixels();
            if (!emptyPixels) return;
            layer.setPixels(emptyPixels);
            // Update order of layer states and components
            setSelectedLayer(0)
            setLayers((prev) => [layer, ...prev]);
        },
        [layers, newPixels]
    );

    const selectLayer = useCallback(
        (index: number) => {
            if (layers.length === 0) {
                setLayers([new Layer(0, "New Layer")]);
            }
            setSelectedLayer(index);
        },
        [layers]
    );

    const sortLayers = useCallback(
        (items: Layer[]) => {
            setLayers(
                items.map((item, i) => {
                    if(item.state.index === selectedLayer) {
                        setSelectedLayer(i)
                    }
                    item.setIndex(i);
                    return item;
                })
            );
        },
        [layers]
    );

    const clearLayer = useCallback(
        (index: number) => {
            const emptyPixels = newPixels();
            if (!emptyPixels || !layers[index]) return;
            layers[index].setPixels(emptyPixels);
            setLayers((prev) => [...prev])
        },
        [layers, newPixels]
    );

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

    useEffect(() => {
        if(layers.length === 0) {
            addLayer(new Layer(0, "New Layer"))
        }
    },[layers, newPixels])

    const canvasContextValue: CanvasContextState = {
        canvasResolution,
        pixelDimensions,
        currentColor,
        grid,
        touchCoords,
        isReady,
        layers,
        selectedLayer,
        setCanvasResolution,
        setCanvasLayout,
        setCurrentColor,
        setGrid,
        setTouchCoords,
        addLayer,
        selectLayer,
        sortLayers,
        clearLayer,
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

// export class LayerState {
//     public name: string;
//     public index: number;
//     public state: PixelStateProps[] | undefined;
//     public component: ReactElement;
//     private history: PixelStateProps[][];
//     private historyIndex: number;
//     constructor(name: string, index: number) {
//         this.name = name;
//         this.index = index;
//         this.component = <PixelLayer index={this.index} state={this}/>;
//         this.history = [];
//         this.historyIndex = 0;
//     }

//     setIndex(index: number) {
//         this.index = index;
//     }

//     setState(state: PixelStateProps[]) {
//         this.state = state;
//         // When updating state, remove trailing history items and continue history
//         this.history = this.history.slice(0, this.historyIndex);
//         this.history.push(this.state);
//         this.historyIndex = this.history.length - 1;
//     }
//     colorPixel(index: number, color: ColorChoice) {
//         if (!this.state) {
//             throw new Error("state not initialized before coloring pixel");
//         }
//         this.state[index].color = color;
//     }

//     getHistory = () => this.history;
//     historyPrev() {
//         // At beginning of history
//         if (this.historyIndex === 0) return;
//         this.historyIndex--;
//         if (this.state) {
//             this.state = this.history[this.historyIndex];
//         }
//     }
//     historyNext() {
//         // At end of history
//         if (this.historyIndex === this.history.length - 1 || !this.state)
//             return;
//         this.historyIndex++;
//         this.state = this.history[this.historyIndex];
//     }
// }
