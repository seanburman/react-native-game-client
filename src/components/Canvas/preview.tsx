import { View } from "react-native";
import { useCanvas } from "./context";

interface Props {
    width: number,
    height: number
}

export default function CanvasPreview({width, height}: Props) {
    const {pixels, canvasResolution} = useCanvas()
    if(!(pixels && canvasResolution)) {
        return
    }
    return (
        <View
        style={{
            flex: 1,
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
                    pixels?.map((p, i) => (
                        <View
                            style={{
                                width: width/canvasResolution.columns,
                                height: height/canvasResolution.rows,
                                backgroundColor: p.color?.HEX
                            }}
                            key={i}/>
                    ))
                }
            </View>
        </View>
    )
}