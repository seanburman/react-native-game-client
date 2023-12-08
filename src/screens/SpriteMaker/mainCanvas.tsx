import React from "react";
import { DrawerScreenProps } from "@react-navigation/drawer/lib/typescript/src/types";
import { View, useWindowDimensions } from "react-native";
import { CanvasProvider } from "../../components/Canvas/context";
import { Canvas } from "../../components/Canvas";
import CanvasPreview from "../../components/Canvas/preview";
import { BottomMenu } from "../../components/Canvas/menu/bottom";
import { RightMenuButton } from "../../components/Canvas/menu/right";

export default function MainCanvas(props: DrawerScreenProps<any, any>) {
    const { width } = useWindowDimensions();

    return (
        <CanvasProvider>
            <View
                style={{
                    width: "100%",
                    backgroundColor: "#FFFFFF",
                    alignItems: "center",
                    paddingTop: 10,
                }}
            >
                <View style={{ width: 400, flexDirection: "row" }}>
                    <View style={{ flex: 1 }}></View>
                    <View>
                        <CanvasPreview width={54} height={54} />
                    </View>
                </View>
            </View>
            <View
                style={{
                    flex: 1,
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "#FFFFFF",
                    paddingTop: 10,
                }}
            >
                <View
                    style={{
                        height: width < 750 ? 400 : 600,
                        width: width < 750 ? 400 : 600,
                        borderWidth: 1,
                        borderColor: "rgba(0,0,0,0.4)",
                        shadowColor: "rgba(0,0,0,0.4)",
                        shadowRadius: 4,
                        shadowOpacity: 1,
                    }}
                >
                    <View
                        style={{
                            height: width < 750 ? 400 : 600,
                            width: width < 750 ? 400 : 600,
                        }}
                    >
                        <Canvas columns={16} rows={16} />
                    </View>
                </View>
                <BottomMenu />
                <RightMenuButton {...props} />
            </View>
        </CanvasProvider>
    );
}
