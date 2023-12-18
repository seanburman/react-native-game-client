import { Text, TouchableOpacity, View } from "react-native";
import {
    NestableScrollContainer,
    NestableDraggableFlatList,
    RenderItemParams,
    ScaleDecorator,
    DragEndParams,
} from "react-native-draggable-flatlist";
import { useCanvas } from "../context/canvas.context";
import { Layer } from "../context/layer.context";

const renderItem = ({
    item,
    isActive,
    drag,
}: RenderItemParams<Layer>) => {
    const { selectLayer, selectedLayer } = useCanvas();
    console.log(selectedLayer)
    return (
        <ScaleDecorator>
            <TouchableOpacity
                delayLongPress={100}
                activeOpacity={1}
                onPress={() => selectLayer(item.state.index)}
                onLongPress={drag}
                disabled={isActive}
            >
                <View
                    style={{
                        width: "100%",
                        height: 50,
                        justifyContent: "center",
                        paddingTop: 0,
                        paddingLeft: 20,
                        backgroundColor: isActive
                            ? "rgba(0,0,0,0.5)"
                            : "rgba(0,0,0,0.25)",
                        borderColor: "black",
                        borderWidth: selectedLayer === item.state.index ? 1 : 0,
                    }}
                >
                    <Text>{item.state.name}</Text>
                </View>
            </TouchableOpacity>
        </ScaleDecorator>
    );
};

export default function LayerList() {
    const { layers, sortLayers } = useCanvas();

    console.log(layers)
    function handleDragEnd({ data }: DragEndParams<Layer>) {
        sortLayers(data);
    }

    return (
        <View>
            <NestableScrollContainer style={{ padding: 0 }}>
                <NestableDraggableFlatList
                    ItemSeparatorComponent={() => (
                        <View
                            style={{
                                width: "100%",
                                height: 1,
                                backgroundColor: "grey",
                            }}
                        ></View>
                    )}
                    dragItemOverflow={false}
                    data={layers}
                    renderItem={renderItem}
                    keyExtractor={(i) => i.state.index.toString()}
                    onDragEnd={handleDragEnd}
                />
            </NestableScrollContainer>
        </View>
    );
}
