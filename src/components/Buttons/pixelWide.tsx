import { useState } from "react";
import { Image, Pressable, View } from "react-native";

interface Props {
    onPress: () => void;
}

export const PixelButtonWide: React.FC<React.PropsWithChildren & Props> = (
    { children },
    props: Props
) => {
    const [hover, setHover] = useState(false)
    return (
        <Pressable
            onPress={props.onPress}
            onHoverIn={() => setHover(true)}
            onHoverOut={() => setHover(false)}
            style={{
                width: 166,
                height: 64,
                overflow: "hidden",
                opacity: hover ? 0.9 : 1
            }}
        >
            <View
                style={{
                    width: "100%",
                    height: "100%",
                    alignItems: 'center',
                }}
            >
                <View
                    style={{
                        width: "70%",
                        height: "70%",
                        paddingTop: 10,
                        position: "absolute",
                        zIndex: 100,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {children}
                </View>
                <Image
                    source={require("../../../assets/button_wide.png")}
                    resizeMode="center"
                    style={{
                        width: '100%',
                        height: '100%',
                        position: "relative",
                        zIndex: 0,
                    }}
                />
            </View>
        </Pressable>
    );
};
