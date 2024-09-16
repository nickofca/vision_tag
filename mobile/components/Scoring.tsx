import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";

export type Scores = {
    [key: string]: number;
};

type ScoreBoardProps = {
    websocket: WebSocket | null;
};

const useScoreUpdater = (websocket: WebSocket | null) => {
    const [scores, setScores] = useState<Scores>({});
    const [loading, setLoading] = useState(true); // State to track loading

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            try {
                const message = JSON.parse(event.data);

                if (message.type === "ScoreUpdate" && message.status === 200) {
                    const updatedScores = message.payload;
                    setScores((prevScores) => ({
                        ...prevScores,
                        ...updatedScores,
                    }));

                    // Once scores are received, stop loading
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };
        if (websocket) {
            // Listen to messages from WebSocket
            websocket.addEventListener("message", handleMessage);

            return () => {
                websocket.removeEventListener("message", handleMessage);
            };
        }
    }, [websocket]);

    return { scores, loading };
};

const ScoreBoard: React.FC<ScoreBoardProps> = ({ websocket }) => {
    const { scores, loading } = useScoreUpdater(websocket);

    return (
        <View style={styles.scoreboard}>
            <Text style={styles.scoreboardTitle}>Scores</Text>
            {loading ? (
                // Show loading animation while scores are being fetched
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Loading scores...</Text>
                </View>
            ) : (
                // Render scores once data is available
                <View>
                    {Object.entries(scores).map(([player, score]) => (
                        <Text key={player} style={styles.scoreItem}>
                            {player}: {score}
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    scoreboard: {
        position: 'absolute', // Place it in absolute positioning
        top: 20, // Position it closer to the top
        left: 10, // Position it closer to the left
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 15, // Adjust padding to make it more compact
        borderRadius: 10,
        width: 150, // Adjust the width to fit content well
        alignItems: 'flex-start', // Align text to the left
    },
    scoreboardTitle: {
        color: '#fff',
        fontSize: 20, // Slightly smaller title font
        fontWeight: 'bold',
        marginBottom: 5, // Smaller margin below title
    },
    scoreItem: {
        color: '#fff',
        fontSize: 16, // Adjust font size for the scores
        marginVertical: 2, // Smaller vertical margin between scores
    },
    loadingContainer: {
        alignItems: 'flex-start', // Left-align the loading text
        justifyContent: 'center',
        marginVertical: 20,
    },
    loadingText: {
        color: '#fff',
        fontSize: 14, // Slightly smaller loading text
        marginTop: 10,
    },
});

export default ScoreBoard;