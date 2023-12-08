import { createDrawerNavigator } from "@react-navigation/drawer";
import MainCanvas from "./mainCanvas";
import { useWindowDimensions } from "react-native";
import RightMenu from "../../components/Canvas/menu/right";
const Drawer = createDrawerNavigator();

export default function SpriteMaker() {
    const { width } = useWindowDimensions();
    return (
        <Drawer.Navigator

            initialRouteName="MainCanvas"
            drawerContent={(props) => <RightMenu {...props} />}
            screenOptions={{
                drawerType: width < 750 ? "front" : "permanent",
                drawerPosition: "right",
                overlayColor: "rgba(0,0,0,0.1)",
                headerShown: false
            }}
        >
            {/* TODO: Layers can use draggable flat list:
            https://www.npmjs.com/package/react-native-draggable-flatlist */}
            <Drawer.Screen name="MainCanvas" component={MainCanvas} />
        </Drawer.Navigator>
    );
}
