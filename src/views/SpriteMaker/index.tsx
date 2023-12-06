import { createDrawerNavigator } from '@react-navigation/drawer';
import MainCanvas from './mainCanvas';
const Drawer = createDrawerNavigator()

export default function SpriteMaker() {
    return (
        <Drawer.Navigator initialRouteName="MainCanvas">
            <Drawer.Screen name="MainCanvas" component={MainCanvas}/>
        </Drawer.Navigator>
    )
}