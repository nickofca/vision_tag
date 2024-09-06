import React, {useCallback, useEffect, useState} from "react";
import {CameraView, useCameraPermissions} from "expo-camera";
import {Button, Text, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {uploadImage} from "@components/api";
import {Scores, ScoreBoard} from "@components/scoring"

type GameScreenProps = {
    websocket: WebSocket | null;
    setStartGame: (start: boolean) => void;
};

const Game: React.FC<GameScreenProps> = ({ websocket, setStartGame }) => {
    const [scores, setScores] = useState<Scores>({}); // State to hold the score data


    const handleEject = useCallback(() => {
        setStartGame(false); // Set the game status to false
        if (websocket) {
            websocket.close(); // Close the WebSocket connection
            // Send exit game message to server (if needed)
            websocket.send(JSON.stringify({ type: 'ExitGame' }));
        }
    }, [websocket, setStartGame]);

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

            <View style={styles.crosshair} />

            <ScoreBoard scores={scores} />

            <Button title="Eject" onPress={handleEject} />
        </View>
    );
};