import React from "react";
import { Image, Pressable, View } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";
import { useCanvas } from "../context/canvas.context";
import { ModalEmpty } from "../../Modal/modal";
import { ColorChoice } from "../../../types/canvas.type";

export function parseColorChoice(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const cc: ColorChoice = {
        RGBA: {
            r: r,
            g: g,
            b: b,
            a: 1,
            string: `rgba(${r}, ${g}, ${b}, ${1})`,
        },
        HEX: hex,
    };
    if (!cc.RGBA.r) cc.RGBA.r = 0;
    if (!cc.RGBA.g) cc.RGBA.g = 0;
    if (!cc.RGBA.b) cc.RGBA.b = 0;
    return cc;
}

// Prevent press and drag from moving viewport on mobile devices
const body = document.getElementsByTagName("body");
const html = document.getElementsByTagName("html");
html[0].style.overflow = "hidden";
html[0].style.overscrollBehavior = "none";
body[0].style.overscrollBehavior = "none";
body[0].style.overflow = "hidden";

interface ColorSelectionProps {
    color: string;
    open: boolean;
    close: () => void;
    onChange?: (color: ColorChoice) => void;
}

const ColorSelector: React.FC<ColorSelectionProps> = (
    props: ColorSelectionProps
) => {
    const { currentColor, setCurrentColor } = useCanvas();

    function handleChange(hex: string) {
        setCurrentColor(parseColorChoice(hex));
        if (props.onChange) props.onChange(parseColorChoice(hex));
    }

    return (
        <>
            <View
                style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor:
                        !currentColor?.HEX
                            ? "#FFFFFF"
                            : currentColor?.HEX,
                    alignItems: "center",
                }}
            >
                <Image
                    source={require("../../../../assets/paintbrush.png")}
                    style={{
                        width: "70%",
                        height: "70%",
                        marginTop: 4,
                        position: "absolute",
                        zIndex: 100,
                    }}
                />
                <Image
                    source={require("../../../../assets/button.png")}
                    style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                        zIndex: 0,
                        // backgroundColor: 'red'
                    }}
                />
            </View>
            <ModalEmpty open={props.open} close={props.close}>
                <View
                    style={{
                        width: 250,
                        height: 300,
                        padding: 20,
                        backgroundColor: "white",
                        marginTop: 0,
                    }}
                >
                    <ColorPicker
                        onColorChange={handleChange}
                        onColorChangeComplete={handleChange}
                        color={currentColor?.HEX}
                        palette={["#FFFFFF"]}
                        swatches
                    />
                </View>
            </ModalEmpty>
        </>
    );
};

interface PaletteSquareProps {
    color: ColorChoice;
    onPress: (color: ColorChoice) => void;
}
const PaletteSquare: React.FC<PaletteSquareProps> = ({ color, onPress }) => {
    return (
        <Pressable onPress={() => onPress(color)}>
            <View
                style={{
                    width: 50,
                    height: 50,
                    backgroundColor: color.HEX,
                    borderColor: "black",
                    borderWidth: 1,
                }}
            />
        </Pressable>
    );
};

interface PaletteProps {
    colors: ColorChoice[];
    onPress: (color: ColorChoice) => void;
}

const Palette: React.FC<PaletteProps> = ({ colors = [], onPress }) => {
    return (
        <View>
            {colors.map((c, i) => (
                <PaletteSquare key={i} color={c} onPress={() => onPress(c)} />
            ))}
        </View>
    );
};

export { ColorSelector, PaletteSquare, Palette };
