import {
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerScreenProps,
} from "@react-navigation/drawer";
import { Text, TextInput, View } from "react-native";
import { ShadowButtonSmall } from "../../Buttons/buttons";
import LayerList from "./right.layers.menu";
import { useState } from "react";
import { useCanvas } from "../context/canvas.context";
import { Layer } from "../context/layer.context";

export default function RightMenu(props: DrawerContentComponentProps) {
    const [newLayerName, setNewLayerName] = useState("");
    const {addLayer, layers} = useCanvas();

    function handleAddLayer() {
        if (newLayerName === "") {
            alert("Please supply a name for the new layer");
            return;
        }
        addLayer(new Layer(layers.length, newLayerName))
    }

    return (
        <DrawerContentScrollView>
            <LayerList />
            <TextInput
                value={newLayerName}
                onChangeText={setNewLayerName}
                style={{ borderWidth: 1, borderColor: "black" }}
            />
            <ShadowButtonSmall onPress={handleAddLayer}>
                <Text>+</Text>
            </ShadowButtonSmall>
        </DrawerContentScrollView>
    );
}

export const RightMenuButton = (props: DrawerScreenProps<any, any>) => {
    return (
        <View>
            <ShadowButtonSmall onPress={() => props.navigation.openDrawer()}>
                <Text>Layers</Text>
            </ShadowButtonSmall>
        </View>
    );
};
