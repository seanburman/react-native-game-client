import { Pressable, Text, View } from "react-native";
import { CanvasProvider } from "../../components/Canvas/context";
import { Canvas } from "../../components/Canvas";
import CanvasPreview from "../../components/Canvas/preview";
import { BottomMenu } from "../../components/Canvas/menu";

export default function SpriteMaker() {
    // const [palette, setPalette] = useState<ColorChoice[]>([])
  
    // function handlePaletteAdd() {
    //   if(!color) return
    //   if(palette.find(c => isEqual(c, color))) return 
    //   setPalette([...palette, color])
    // }
  
    // function handlePaletteRemove(color: ColorChoice) {
    //   const newPalette = palette.filter(c => !isEqual(c, color))
    //   setPalette(newPalette)
    // }
    return (
      <CanvasProvider>
        <View
          style={{
            width: '100%',
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            paddingTop: 10,
          }}>
            <View style={{width: 400, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
              </View>
              <View>
                <CanvasPreview width={54} height={54}/>
              </View>
            </View>
        </View>
          <View style={{
            flex: 1,
            flexDirection: 'column', 
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            paddingTop: 10}}>
              <View style={{
                height: 400, 
                width: 400, 
                borderWidth: 1, 
                // borderColor: 'black',
                borderColor:'rgba(0,0,0,0.4)',
                shadowColor: 'rgba(0,0,0,0.4)',
                shadowRadius: 4,
                shadowOpacity: 1,
                }}>
                  <Canvas
                    columns={16} 
                    rows={16}/>
              </View>
            <BottomMenu />
          </View>
      </CanvasProvider>
    )
}