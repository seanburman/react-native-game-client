import { createDrawerNavigator } from "@react-navigation/drawer";
import CanvasScreen from "../screens/canvas.screen";
import { useWindowDimensions } from "react-native";
import RightMenu from "../components/Canvas/menu/right.content.menu";
import { CanvasProvider } from "../components/Canvas/context/canvas.context";
const Drawer = createDrawerNavigator();

export default function SpriteMaker() {
    const { width } = useWindowDimensions();
    return (
        <CanvasProvider>
            <Drawer.Navigator
                initialRouteName="CanvasScreen"
                drawerContent={(props) => <RightMenu {...props} />}

                screenOptions={{
                    // TODO: make these dimensions constant with theme hook
                    drawerType: width < 750 ? "front" : "permanent",
                    drawerPosition: "right",
                    overlayColor: "rgba(0,0,0,0.1)",
                    headerShown: false,
                    drawerStyle: {
                        borderColor: "#000000",
                        borderLeftWidth: 1,
                        paddingTop: 0,
                        marginTop: -4,
                    },
                }}
            >
                <Drawer.Screen name="CanvasScreen" component={CanvasScreen} options={{}}/>
            </Drawer.Navigator>
        </CanvasProvider>
    );
}
