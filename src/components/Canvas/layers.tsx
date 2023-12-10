import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
    NestableScrollContainer,
    NestableDraggableFlatList,
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";

type layer = {
    key: number;
    name: string;
    value: string;
};

const dataSource: layer[] = [
    {
        key: 0,
        name: "layer 0",
        value: "layer content 0",
    },
    {
        key: 1,
        name: "layer 1",
        value: "layer content 1",
    },
    {
        key: 2,
        name: "layer 2",
        value: "layer content 2",
    },
    {
        key: 3,
        name: "layer 3",
        value: "layer content 3",
    },
];

const renderItem = ({ item, isActive, drag }: RenderItemParams<layer>) => {
    return (
        <ScaleDecorator>
            <TouchableOpacity
                delayLongPress={100}
                activeOpacity={1}
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
                    }}
                >
                    <Text>{item.value}</Text>
                </View>
            </TouchableOpacity>
        </ScaleDecorator>
    );
};

export default function Layers() {
    const [data, setData] = useState<layer[]>(dataSource);
    return (
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
                data={data}
                renderItem={renderItem}
                keyExtractor={(i) => i.key.toString()}
                onDragEnd={({ data }) => setData(data)}
            />
        </NestableScrollContainer>
    );
}
