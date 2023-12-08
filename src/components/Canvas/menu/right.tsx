import { DrawerContentComponentProps, DrawerContentScrollView, DrawerScreenProps } from "@react-navigation/drawer";
import { Text, View } from "react-native";
import { ShadowButtonSmall } from "../../Buttons";
import Layers from "../layers";

export default function RightMenu(props: DrawerContentComponentProps) {
    return (
        <DrawerContentScrollView>
            <Layers />
        </DrawerContentScrollView>
    )
}

export const RightMenuButton = (props: DrawerScreenProps<any, any>) => {
    return (
        <View>
            <ShadowButtonSmall onPress={() => props.navigation.openDrawer()}>
                <Text>Layers</Text>
            </ShadowButtonSmall>
        </View>
    )
}