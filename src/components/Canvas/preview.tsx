import { View } from "react-native";
import { useCanvas } from "./context";

interface Props {
    width: number,
    height: number
}

export default function CanvasPreview({width, height}: Props) {
    const {pixels, canvasResolution} = useCanvas()

    return (
        <View
        style={{
            width: width + 2,
            height: height + 2,
            borderWidth: 1,
            borderColor: '#000000',
        }}>
            <View
            style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                width: width,
                height: height,
            }}>
                {
                    canvasResolution && pixels &&
                    pixels.map((p, i) => (
                        <View
                            style={{
                                width: width/canvasResolution?.columns,
                                height: height/canvasResolution?.rows,
                                backgroundColor: p.color?.HEX
                            }}
                            key={i}/>
                    ))
                }
            </View>
        </View>
    )
}