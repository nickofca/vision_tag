import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CameraViewComponent from '@components/camera';
import { createGame, joinGame, WebSocketType } from '@components/api';
import ScoreBoard from "@components/scoring"


interface GameScreenProps {
    token: string;
    gameType: string;
    gameId: string;
}

export default function GameScreen({ token, gameType, gameId }: GameScreenProps) {
    const [websocket, setWebSocket] = useState<WebSocketType>(null);
    const [scores, setScores] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        let ws: WebSocket | null = null;

        if (gameId) {
            // Join an existing game if gameId is provided
            ws = joinGame(token, gameId);
        } else if (gameType) {
            // Create a new game if gameType is provided
            ws = createGame(token, gameType);
        }

        setWebSocket(ws);

        // Clean up the WebSocket connection when the component is unmounted
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [token, gameType, gameId]);

    return (
        <>
            <View style={styles.container}>
                {websocket && <CameraViewComponent websocket={websocket} />}
            </View>
            <ScoreBoard scores={scores} />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});