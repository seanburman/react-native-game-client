import { useEffect, useState } from "react";
import { LayoutRectangle, Modal, Pressable } from "react-native";

interface Props {
    open: boolean;
    close: () => void;
}

export const ModalEmpty: React.FC<React.PropsWithChildren<Props>> = ({
    children,
    open,
    close,
}) => {
    const [modalLayout, setModalLayout] = useState<LayoutRectangle>();

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
                        <Pressable>{children}</Pressable>
                    </Pressable>
                </Modal>
            )}
        </>
    );
};
