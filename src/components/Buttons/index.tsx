import { Pressable } from "react-native"
interface Props {
    sx?: StyleSheet
    onPress?: () => void
}
export const ShadowButtonSmall: React.FC<React.PropsWithChildren<Props>>= ({children, sx, onPress}) => {
    function handlePress() {
        if(onPress) {
            onPress()
        }
    }

    return (
        <Pressable
            onPress={handlePress}
            style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: 66,
            height: 66,
            overflow: 'hidden',
            padding: 5,
            borderWidth: 1,
            borderColor:'rgba(0,0,0,0.3)',
            shadowColor: 'rgba(0,0,0,0.4)',
            shadowRadius: 4,
            shadowOpacity: 1,
            borderRadius: 16,
            ...sx
        }}>
            {children}
        </Pressable>
    )
}