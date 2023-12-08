import React, { useRef } from "react";
import { DrawerScreenProps } from "@react-navigation/drawer/lib/typescript/src/types";
import { Button, ScrollView, View } from "react-native";
import { CanvasProvider } from "../../components/Canvas/context";
import { Canvas } from "../../components/Canvas";
import CanvasPreview from "../../components/Canvas/preview";
import { BottomMenu } from "../../components/Canvas/menu/bottom";
import RightMenu from "../../components/Canvas/menu/right";

export default function MainCanvas(props: DrawerScreenProps<any, any>) {
    const scrollViewRef = useRef<ScrollView>(null)

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
                        height: 400,
                        width: 400,
                        borderWidth: 1,
                        borderColor: "rgba(0,0,0,0.4)",
                        shadowColor: "rgba(0,0,0,0.4)",
                        shadowRadius: 4,
                        shadowOpacity: 1,
                    }}
                >
                    <ScrollView
                        ref={scrollViewRef}
                        style={{ flex: 1 }}
                        onScroll={(e) => console.log(e)}
                        contentContainerStyle={{flexGrow: 1}}
                    >
                        <View
                            style={{
                                height: 600,
                                width: 600,
                            }}
                        >
                            <Canvas columns={32} rows={32} />
                        </View>
                    </ScrollView>
                </View>
                <Button title="Scroll" onPress={() => scrollViewRef.current && scrollViewRef.current.scrollTo({y: 900})}/>
                <BottomMenu />
                <RightMenu {...props} />
            </View>
        </CanvasProvider>
    );
}
