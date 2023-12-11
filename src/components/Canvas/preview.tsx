import React from "react";
import { View } from "react-native";
import { useCanvas } from "./context";

interface Props {
    width: number;
    height: number;
}

export default function CanvasPreview({ width, height }: Props) {
    const { selectedPixels, canvasResolution } = useCanvas();

    return (
        <View
            style={{
                borderWidth: 2,
                borderColor: '#000000'
            }}
        >
            <View
                style={{
                    width: width,
                    height: height,
                    backgroundColor: "#c5c7c4",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        width: width,
                        height: height,
                    }}
                >
                    {canvasResolution &&
                        selectedPixels &&
                        selectedPixels.map((p, i) => (
                            <View
                                style={{
                                    width: width / canvasResolution?.columns,
                                    height: height / canvasResolution?.rows,
                                    backgroundColor: p.color?.HEX,
                                }}
                                key={i}
                            />
                        ))}
                </View>
            </View>
        </View>
    );
}
