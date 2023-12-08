import React, { useState } from "react";
import { Text, View } from "react-native";
import { ShadowButtonSmall } from "../../Buttons";
import { ColorChoice, ColorSelector } from "../../ColorSelection";
import { useCanvas } from "../context";
import { ModalEmpty } from "../../Modal";
import { ConfirmPrompt } from "../../Modal/prompt";

export const BottomMenu: React.FC = () => {
    const { pixels, grid, setGrid, clearCanvas } = useCanvas();
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
            clearCanvas();
        }
    }

    return (
        <View style={{ flexDirection: "row" }}>
            <ShadowButtonSmall
                onPress={() => setColorSelectorOpen(!colorSelectorOpen)}
            >
                <>
                    <ColorSelector
                        open={colorSelectorOpen}
                        close={() => setColorSelectorOpen(false)}
                        color={color?.HEX || "transparent"}
                        onChange={setColor}
                    />
                    <Text style={{ position: "absolute" }}>Color</Text>
                </>
            </ShadowButtonSmall>

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
                disabled={!pixels?.find((p) => p.color)}
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
