// Game.tsx (or wherever the Game component is located)
import React, { useEffect, useState } from "react";
import CameraViewComponent from "@components/Camera";
import { View, StyleSheet } from "react-native";
import ScoreBoard, { Scores } from "@components/Scoring";
import EjectButton from "@components/EjectButton";
import WebSocketListener from "@hooks/SocketListener";

type GameScreenProps = {
    websocket: WebSocket | null;
    setStartGame: (start: boolean) => void;
};

const GameScreen: React.FC<GameScreenProps> = ({ websocket, setStartGame }) => {
    const [scores, setScores] = useState<Scores>({}); // State to hold the score data

    // Listen for server side game-events
    useEffect(() => {
        if (websocket) {
            websocket.onmessage = (event) => {
                const data = JSON.parse(event.data);

                if (data.type === 'ScoreUpdate' && data.payload) {
                    setScores(data.payload);
                }
            };
        }
    }, [websocket]);

    return (
        <View style={styles.container}>
            <WebSocketListener />

            <View style={styles.crosshair} />

            <ScoreBoard scores={scores} />

            <EjectButton />

            <CameraViewComponent websocket={websocket} />
        </View>
    );
};

export default GameScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000", // Set background to black (temporary)
    },
    crosshair: {
        position: "absolute",
        width: 50,
        height: 50,
        borderWidth: 2,
        borderColor: "#ff0000", // Red crosshair
        borderRadius: 25, // Circular crosshair
        top: "50%",
        left: "50%",
        marginLeft: -25, // Center the crosshair horizontally
        marginTop: -25, // Center the crosshair vertically
    },
});