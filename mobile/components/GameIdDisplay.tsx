import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGameStore } from '@services/gameState'; // Assuming the store is in the same directory

const GameIdDisplay: React.FC = () => {
    const gameId = useGameStore((state) => state.gameId); // Fetch gameId from the zustand store

    return (
        <View style={styles.container}>
            {gameId ? ( // Display only if gameId exists
                <Text style={styles.gameIdText}>Game ID: {gameId}</Text>
            ) : (
                <Text style={styles.gameIdText}>No Game ID Available</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 10,
        left: 5,
        margin: 10,
        zIndex: 1,
    },
    gameIdText: {
        fontSize: 12,   // Small font size
        color: 'red',  // Grey color
    },
});

export default GameIdDisplay;