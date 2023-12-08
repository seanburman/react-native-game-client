import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Game from "../../screens/Game";
import { StyleSheet } from "react-native";
import SpriteMaker from "../../screens/SpriteMaker";

const Tab = createBottomTabNavigator();
export default function Tabs() {
    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false, tabBarStyle: styles.tabBar }}
            initialRouteName="SpriteMaker"
        >
            <Tab.Screen name="SpriteMaker" component={SpriteMaker} />
            <Tab.Screen name="Game" component={Game} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        height: 80,
        paddingBottom: 20,
        paddingTop: 20,
    },
});
