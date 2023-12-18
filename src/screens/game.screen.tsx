import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import {
    useAuthenticateGameMutation,
    useCreateGameSessionMutation,
} from "../redux/auth.slice";
import { Provider } from "react-redux";
import { store } from "../redux/store";

export default function Game() {
    const [authenticate, authRes] = useAuthenticateGameMutation();
    const [createSession, createSessionRes] = useCreateGameSessionMutation();
    const [token, setToken] = useState<any | undefined>(undefined);
    const [sessionId, setSessionId] = useState<any | undefined>(undefined);

    // Authenticate
    useEffect(() => {
        authenticate({ username: "Sean", password: "12345678" });
    }, []);

    //Store token
    useEffect(() => {
        if (authRes.isSuccess) {
            setToken(authRes.data.token);
        }
    }, [authRes.isSuccess]);

    // Request session from game server
    useEffect(() => {
        if (token && authRes.isSuccess) {
            createSession(token);
        }
    }, [authRes.isSuccess, token]);
    // Store game session id
    useEffect(() => {
        if (createSessionRes.isSuccess) {
            setSessionId(createSessionRes.data.session_id);
        }
    }, [createSessionRes.isSuccess]);

    if (!sessionId) return <div>"Requesting game session..."</div>;
    return (
        <Provider store={store}>
            <WebView
                containerStyle={{ flex: 1 }}
                source={{
                    uri: `http://192.168.1.154:3000/game?session=${sessionId}`,
                }}
                style={{ flex: 1 }}
            />
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
