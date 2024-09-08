import React from "react";
import { Text, View, StyleSheet } from "react-native";

export type Scores = {
    [key: string]: number;
};

type ScoreBoardProps = {
    scores: Scores;
};


// TODO: Create hook to update score
const ScoreBoard: React.FC<ScoreBoardProps> = ({ scores }) => {
    return (
        <View style={styles.scoreboard}>
            <Text style={styles.scoreboardTitle}>Scores</Text>
            <View>
                {Object.entries(scores).map(([player, score]) => (
                    <Text key={player} style={styles.scoreItem}>
                        {player}: {score}
                    </Text>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    scoreboard: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Opaque black with 80% opacity
        padding: 20,
        borderRadius: 10,
        margin: 10,
        alignItems: 'center',
    },
    scoreboardTitle: {
        color: '#fff', // White color for the title
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    scoreItem: {
        color: '#fff', // White color for the score items
        fontSize: 18,
        marginVertical: 5,
    },
});

export default ScoreBoard;