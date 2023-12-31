import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { ShadowButtonSmall } from "../../Buttons";
import { ColorChoice, ColorSelector } from "../../ColorSelection";
import { useCanvas } from "../context";
import { ModalEmpty } from "../../Modal";
import { ConfirmPrompt } from "../../Modal/prompt";

export const BottomMenu: React.FC = () => {
    const { selectedPixels, grid, setGrid, clearPixelLayer } = useCanvas();
    const [colorSelectorOpen, setColorSelectorOpen] = useState(false);
    const [clearModalOpen, setclearModalOpen] = useState(false);
    const [color, setColor] = useState<ColorChoice>({
        HEX: "FFFFFF",
        RGBA: { r: 0, g: 0, b: 0, a: 0, string: "" },
    });

    function handleClear() {
        setclearModalOpen(true);
    }
    function handleConfirm(confirmed: boolean) {
        setclearModalOpen(false);
        if (confirmed) {
            clearPixelLayer();
        }
    }

    return (
        <View style={{ flexDirection: "row" }}>
            <Pressable
                onPress={() => setColorSelectorOpen(!colorSelectorOpen)}
                style={{
                    flex: 1,
                    width: 86,
                    height: 86,
                    padding: 10,
                    overflow: 'hidden',
                }}
            >
                <ColorSelector
                    open={colorSelectorOpen}
                    close={() => setColorSelectorOpen(false)}
                    color={color?.HEX || "transparent"}
                    onChange={setColor}
                />
            </Pressable>

            <ShadowButtonSmall onPress={() => setGrid(!grid)} depress>
                <Text>Grid</Text>
            </ShadowButtonSmall>

            <ModalEmpty
                open={clearModalOpen}
                close={() => setclearModalOpen(false)}
            >
                <ConfirmPrompt
                    message={"Are you sure you want to clear the canvas?"}
                    onChange={handleConfirm}
                />
            </ModalEmpty>
            <ShadowButtonSmall
                onPress={handleClear}
                // If no pixels have color, then canvas is already clear
                disabled={!selectedPixels?.find((p) => p.color)}
            >
                <Text>Clear</Text>
            </ShadowButtonSmall>

            {/* <Palette
            colors={palette}
            onPress={handlePaletteRemove}
        /> */}
        </View>
    );
};
