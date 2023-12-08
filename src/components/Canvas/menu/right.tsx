import { DrawerScreenProps } from "@react-navigation/drawer";
import { Text, View } from "react-native";
import { ShadowButtonSmall } from "../../Buttons";

export default function RightMenuButton(props: DrawerScreenProps<any, any>) {
    return (
        <View>
            <ShadowButtonSmall onPress={() => props.navigation.openDrawer()}>
                <Text>Layers</Text>
            </ShadowButtonSmall>
        </View>
    )
}