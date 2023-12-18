import {
    ColorChoice,
    PixelStateProps,
} from "../../../types/canvas.type";

export class Layer {
    public state = {
        index: 0,
        name: `New Layer`,
        pixels: [] as PixelStateProps[],
    };

    constructor(index: number, name: string) {
        this.state.index = index;
        this.state.name = name;
    }

    setIndex = (index: number) => {
        this.state.index = index;
    };
    setName = (name: string) => {
        this.state.name = name;
    };
    setPixels = (pixels: PixelStateProps[]) => {
        this.state.pixels = pixels;
    };
    colorPixel = (index: number, color: ColorChoice) => {
        if (!this.state.pixels) return;
        this.state.pixels[index].color = color;
    };
}
