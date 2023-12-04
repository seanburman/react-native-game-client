import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View} from 'react-native'; 
import { Provider } from 'react-redux';
import {store} from './src/redux/store'
import { ColorChoice, ColorSelector, Palette } from './src/components/Canvas/ColorSelection';
import { useState } from 'react';
import {isEqual} from 'lodash'
import {Canvas} from './src/components/Canvas/Canvas';
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import { CanvasProvider } from './src/components/Canvas/context';

export default function App() {
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
    <Provider store={store}>
      <SafeAreaView style={styles.container} >
        <CanvasProvider>
        <View style={{flexDirection: 'column', flex: 1, paddingTop: 20}}>
                <View style={{height: 400, width: 400, borderWidth: 1, borderColor: 'black'}}>
                    <Canvas currentColor={color} width={32} height={32}/>
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
                  onPress={() => setPickerOpen(!pickerOpen)}
                />
              {/* <Pressable style={{width: 100, height: 20, alignItems: 'center', borderColor: 'black', borderWidth: 1}} onPress={handlePaletteAdd}>
                <Text>+</Text>
              </Pressable> */}

                <ColorSelector 
                  color={color?.HEX || "transparent"}
                  open={pickerOpen}
                  onChange={setColor}
                />
              {/* <Palette
                colors={palette}
                onPress={handlePaletteRemove}
              /> */}
            </View>
        </View>
        </CanvasProvider>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
