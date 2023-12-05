import { Text, View } from "react-native"
import { ShadowButtonSmall } from "../Buttons"
import { ColorChoice, ColorSelector } from "../ColorSelection"
import { useState } from "react"
import { useCanvas } from "./context"

export const BottomMenu: React.FC = () => {
    const {grid, setGrid, clearCanvas} = useCanvas()
    const [color, setColor] = useState<ColorChoice>({
      HEX: 'FFFFFF', RGBA: {r: 0, g: 0, b:0 ,a: 0, string: ""}
    })
    return (
        <View style={{flexDirection: 'row', marginTop: 10, gap: 10}}>        
            <ShadowButtonSmall>
                <ColorSelector
                    color={color?.HEX || "transparent"}
                    onChange={setColor}
                />
                <Text style={{position: 'absolute'}}>Color</Text>
            </ShadowButtonSmall>
            <ShadowButtonSmall
            onPress={() => setGrid(!grid)}>
                <Text>Grid</Text>
            </ShadowButtonSmall>
            <ShadowButtonSmall
            onPress={clearCanvas}>
                <Text>Clear</Text>
            </ShadowButtonSmall>
        {/* <Palette
            colors={palette}
            onPress={handlePaletteRemove}
        /> */}
        </View>
    )
}