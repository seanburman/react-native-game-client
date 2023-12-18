import React from "react";
import { Modal, Pressable, View } from "react-native";

interface Props {
    open: boolean;
    close: () => void;
}

export const ModalEmpty: React.FC<React.PropsWithChildren<Props>> = ({
    children,
    open,
    close,
}) => {
    return (
        <>
            {open && (
                <Modal
                    visible={open}
                    transparent
                    onRequestClose={close}
                    style={{
                        flex: 1,
                        padding: 10,
                        borderRadius: 10,
                        marginTop: 0,
                    }}
                >
                    <Pressable
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(0,0,0,0.4)",
                        }}
                        onPressOut={() => {}}
                        onPress={close}
                    >
                        <Pressable>
                            <View
                                style={{
                                    borderColor: "rgba(0,0,0,1)",
                                    borderWidth: 1,
                                    shadowColor: "rgba(0,0,0,0.3)",
                                    shadowRadius: 10,
                                    shadowOpacity: 1,
                                    borderRadius: 16,
                                    overflow: "hidden",
                                    padding: 1,
                                }}
                            >
                                {children}
                            </View>
                        </Pressable>
                    </Pressable>
                </Modal>
            )}
        </>
    );
};
