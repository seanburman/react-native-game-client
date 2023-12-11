import React from "react";
import { DrawerScreenProps } from "@react-navigation/drawer/lib/typescript/src/types";
import { Text, View, useWindowDimensions } from "react-native";
import { CanvasProvider } from "../../components/Canvas/context";
import { Canvas } from "../../components/Canvas";
import CanvasPreview from "../../components/Canvas/preview";
import { BottomMenu } from "../../components/Canvas/menu/bottom";
import { RightMenuButton } from "../../components/Canvas/menu/right";
import { PixelButtonWide } from "../../components/Buttons/pixelWide";

export default function MainCanvas(props: DrawerScreenProps<any, any>) {
    const { width } = useWindowDimensions();

    return (
        <CanvasProvider>
            <View
                style={{
                    width: "100%",
                    backgroundColor: "#36BBFF",
                    alignItems: "center",
                    paddingTop: 10,
                }}
            >
                <View style={{ width: width < 750 ? 400 : 600, flexDirection: "row" }}>
                    <View style={{ flex: 1 }}>
                        <PixelButtonWide onPress={() => {}}>
                            <Text>Save</Text>
                        </PixelButtonWide>
                    </View>
                    <View>
                        {/* <CanvasPreview width={54} height={54} /> */}
                    </View>
                </View>
            </View>
            <View
                style={{
                    flex: 1,
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "#36BBFF",
                    paddingTop: 10,
                }}
            >
                <View
                    style={{
                        borderWidth: 2,
                        borderColor: '#000000'
                    }}
                >
                    <View
                        style={{
                            height: width < 750 ? 400 : 600,
                            width: width < 750 ? 400 : 600,
                            backgroundColor: '#FFFFFF',
                        }}
                    >
                        <View
                            style={{
                                height: width < 750 ? 400 : 600,
                                width: width < 750 ? 400 : 600,
                            }}
                        >
                            <Canvas columns={32} rows={32} />
                        </View>
                    </View>
                </View>
                <BottomMenu />
                <RightMenuButton {...props} />
            </View>
        </CanvasProvider>
    );
}
