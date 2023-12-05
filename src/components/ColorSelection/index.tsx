import { LayoutRectangle, Pressable, View } from 'react-native'
import ColorPicker from 'react-native-wheel-color-picker'
import { useCanvas } from '../Canvas/context'
import { Modal } from 'react-native'
import { useState } from 'react'

export type RGBA = {
    r: number,
    g: number,
    b: number,
    a: number,
    string: string
}

export type ColorChoice = {
  RGBA: RGBA
  HEX: string
}

export function parseColorChoice(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
   
    const cc: ColorChoice = {
      RGBA: {
        r: r,
        g: g,
        b: b,
        a: 1,
        string: `rgba(${r}, ${g}, ${b}, ${1})`,
      },
      HEX: hex
    }
    if(!cc.RGBA.r) cc.RGBA.r = 0
    if(!cc.RGBA.g) cc.RGBA.g = 0
    if(!cc.RGBA.b) cc.RGBA.b = 0
    return cc
}

// Prevent press and drag from moving viewport on mobile devices
const body = document.getElementsByTagName("body")
const html = document.getElementsByTagName("html")
html[0].style.overflow = "hidden"
html[0].style.overscrollBehavior = "none"
body[0].style.overscrollBehavior = "none"
body[0].style.overflow = "hidden"

interface ColorSelectionProps {
  color: string,
  onPress?: () => void,
  onChange?: (color: ColorChoice) => void,
}

const ColorSelector: React.FC<ColorSelectionProps> = (props: ColorSelectionProps) => {
  const [modalLayout, setModalLayout] = useState<LayoutRectangle>()
  const {currentColor, setCurrentColor} = useCanvas()
  const [open, setOpen] = useState(false)

  function handleChange(hex: string) {
    setCurrentColor(parseColorChoice(hex))
    if(props.onChange)
    props.onChange(parseColorChoice(hex))
  }

  function handlePress() {
    if (props.onPress) {
      props.onPress()
    }
  }

  return (
    <>
    <Pressable
      style={{
        width: '100%',
        height: '100%'
      }}
      onPress={handlePress}>
      <Pressable
        style={{
          flex: 1,
          borderRadius: 12,
          backgroundColor: currentColor?.HEX,
        }} 
        onPress={() => setOpen(!open)}/>
    </Pressable>
      {
            open &&
            <Modal
              onLayout={(e) => setModalLayout(e.nativeEvent.layout)}
              visible={open}
              transparent
              onRequestClose={() => setOpen(false)}
              style={{
              flex: 1,
              padding: 10,
              borderRadius: 10,
              marginTop: 0}}>
                { modalLayout &&
                  <Pressable
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(0,0,0,0.2)'
                    }}
                    onPressOut={() => {}}
                    onPress={() => setOpen(false)}>
                      <Pressable
                        style={{
                          position: 'absolute',
                          top: modalLayout.height/2-150,
                          left: modalLayout.width/2-125,
                        }}>
                        <View
                        style={{
                          width: 250,
                          height: 300,
                          padding: 20,
                          //TODO: extract shadow into a theme
                          borderColor:'rgba(0,0,0,0.15)',
                          borderWidth:1,
                          shadowColor: 'rgba(0,0,0,0.3)',
                          shadowRadius: 10,
                          shadowOpacity: 1,
                          borderRadius: 16,
                          backgroundColor: 'white',
                          marginTop: 0}}>
                        <ColorPicker
                            onColorChange={handleChange}
                            onColorChangeComplete={handleChange}
                            color={currentColor?.HEX}
                            palette={["#FFFFFF"]}
                            swatches/>
                        </View>
                      </Pressable>
                  </Pressable>}
            </Modal>
      }
    </>
  )
}

interface PaletteSquareProps {
  color: ColorChoice, 
  onPress: (color: ColorChoice) => void
}
const PaletteSquare: React.FC<PaletteSquareProps> = ({color, onPress}) => {
  return (
    <Pressable onPress={() => onPress(color)}>
        <View
          style={{
            width: 50, 
            height: 50, 
            backgroundColor: color.HEX, 
            borderColor: 'black', 
            borderWidth: 1
          }} 
        />
    </Pressable>
  )
}

interface PaletteProps {
  colors: ColorChoice[],
  onPress: (color: ColorChoice) => void
}

const Palette: React.FC<PaletteProps> = ({colors = [], onPress}) => {
  return (
    <View>
      {
        colors.map((c, i) => (
          <PaletteSquare key={i} color={c} onPress={() => onPress(c)}/> 
        ))
      }
    </View>
  )
}

export {
  ColorSelector,
  PaletteSquare,
  Palette
}