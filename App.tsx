import "react-native-gesture-handler";
// import "react-native-reanimated";
import { SafeAreaView, StyleSheet } from "react-native";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { NavigationContainer } from "@react-navigation/native";
import Tabs from "./src/navigation/Tabs";

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <SafeAreaView style={styles.container}>
                    <Tabs />
                </SafeAreaView>
            </NavigationContainer>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
