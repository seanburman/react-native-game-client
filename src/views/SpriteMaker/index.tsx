import { Pressable, View } from "react-native";
import { CanvasProvider } from "../../components/Canvas/context";
import { Canvas } from "../../components/Canvas";
import { ColorChoice, ColorSelector } from "../../components/ColorSelection";
import { useState } from "react";
import { isEqual } from "lodash";

export default function SpriteMaker() {
    const [pickerOpen, setPickerOpen] = useState(false)
    const [color, setColor] = useState<ColorChoice>({
      HEX: 'FFFFFF', RGBA: {r: 0, g: 0, b:0 ,a: 0, string: ""}
    })
    const [palette, setPalette] = useState<ColorChoice[]>([])
  
    function handlePaletteAdd() {
      if(!color) return
      if(palette.find(c => isEqual(c, color))) return 
      setPalette([...palette, color])
    }
  
    function handlePaletteRemove(color: ColorChoice) {
      const newPalette = palette.filter(c => !isEqual(c, color))
      setPalette(newPalette)
    }
    return (
        <CanvasProvider>
          <View style={{flexDirection: 'column', flex: 1, paddingTop: 20}}>
                  <View style={{height: 400, width: 400, borderWidth: 1, borderColor: 'black'}}>
                      <Canvas currentColor={color} width={16} height={16}/>
                  </View>
              <View style={{flexDirection: 'column', marginTop: 10}}>
                  <Pressable
                    style={{
                      width: 50, 
                      height: 50, 
                      backgroundColor: color?.HEX, 
                      borderColor: 'black', 
                      borderWidth: 1
                    }} 
                    onPress={() => setPickerOpen(!pickerOpen)}/>
                {/* <Pressable style={{width: 100, height: 20, alignItems: 'center', borderColor: 'black', borderWidth: 1}} onPress={handlePaletteAdd}>
                  <Text>+</Text>
                </Pressable> */}

                  <ColorSelector
                    color={color?.HEX || "transparent"}
                    open={pickerOpen}
                    onChange={setColor}
                    close={() => setPickerOpen(false)}
                  />
                {/* <Palette
                  colors={palette}
                  onPress={handlePaletteRemove}
                /> */}
              </View>
          </View>
          </CanvasProvider>
    )
}