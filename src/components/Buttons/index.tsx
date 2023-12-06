import React from "react";
import {
    Pressable,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";

interface Props {
    onPress?: () => void;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
}
export const ShadowButtonSmall: React.FC<React.PropsWithChildren<Props>> = ({
    children,
    onPress,
    disabled,
    style,
}) => {
    function handlePress() {
        if (onPress) {
            onPress();
        }
    }

    return (
        <Pressable
            onPress={handlePress}
            style={[styles.wrapper, { opacity: disabled ? 0.5 : 1 }]}
            disabled={disabled}
        >
            <View style={[styles.content, style]}>{children}</View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        justifyContent: "center",
        alignItems: "center",
        width: 86,
        height: 86,
    },
    content: {
        width: 66,
        height: 66,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        padding: 5,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.3)",
        shadowColor: "rgba(0,0,0,0.4)",
        shadowRadius: 4,
        shadowOpacity: 1,
        borderRadius: 16,
    },
});
