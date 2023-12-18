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

export type RGBA = {
    r: number;
    g: number;
    b: number;
    a: number;
    string: string;
};

export type ColorChoice = {
    RGBA: RGBA;
    HEX: string;
};


export type PixelStateProps = {
    color: ColorChoice | undefined;
};

export type PixelCoords = {
    column: number;
    row: number;
};