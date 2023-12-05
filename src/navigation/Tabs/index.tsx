import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import SpriteMaker from '../../views/SpriteMaker'
import Game from '../../views/Game'

export default function Tabs() {
    const Tab = createBottomTabNavigator()
    return (
        <Tab.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName='SpriteMaker'>
            <Tab.Screen 
            name="SpriteMaker"
            component={SpriteMaker}/>
            <Tab.Screen 
            name="Game"
            component={Game}/>
        </Tab.Navigator>
    )
}