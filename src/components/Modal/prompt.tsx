import { Pressable, StyleSheet, Text, View } from "react-native"

interface ConfirmProps {
    message: string
    onChange: (yes: boolean) => void
}
export const ConfirmPrompt: React.FC<ConfirmProps> = ({onChange, message}) => {

    return (
        <View style={styles.container}>
            <View style={styles.messageWrapper}>
                <Text>{message}</Text>
            </View>
            <View style={styles.buttonWrapper}>
                <Pressable
                    onPress={() => onChange(true)}
                    style={styles.button}>
                        <Text>Yes</Text>
                </Pressable>
                <Pressable 
                    onPress={() => onChange(false)}
                    style={styles.button}>
                        <Text>No</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    messageWrapper: {
        marginBottom: 20
    },
    buttonWrapper: {
        flexDirection: 'row',
        gap: 20,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 40,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.4)',
        borderRadius: 10,
    }
})