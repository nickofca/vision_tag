import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { initiateWebSocket } from "@components/archive_api";
import { tokenStore } from "@services/auth"
import { useRouter } from 'expo-router';
import {useWebSocketStore} from "@services/socket"; // Import the router for navigation


const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || '';

const JoinGameComponent: React.FC = () => {
    const [gameId, setGameId] = useState('');
    const initializeWebSocket = useWebSocketStore((state) => state.initializeWebSocket)
    const token = tokenStore((state) => state.token); // Access the token from the Zustand store
    const router = useRouter();

    const handleJoinGame = () => {
        if (gameId.trim()) {
            const socket_url = `${API_BASE_URL.replace('http', 'ws')}/ws/join_game/${gameId}?token=${token}`
            initializeWebSocket(socket_url);
            router.replace("game")
        } else {
            alert("Please enter a valid Game ID.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Join Game</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Game ID"
                value={gameId}
                onChangeText={setGameId} // React Native uses onChangeText for TextInput
            />
            <Button
                title="Join"
                onPress={handleJoinGame}
                color="#000"
            />
        </View>
    );
};

export default JoinGameComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        width: '80%',
    },
});