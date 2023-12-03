type CanvasData = {
    canvasTouched: boolean,
    canvasDimensions: {
        columns: number, 
        rows: number
    },
    pixelDimensions: {
        width: number, 
        height: number
    },
    panCoords: {
        x: number, 
        y: number
    }
}