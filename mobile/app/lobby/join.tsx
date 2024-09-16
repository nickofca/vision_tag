import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native"; // Import TouchableOpacity for buttons
import { tokenStore } from "@services/auth";
import { useRouter } from 'expo-router'; // For navigation
import { useWebSocketStore } from "@services/socket"; // WebSocket management
import globalStyles from "@styles/globalStyles";
import BackButton from "@components/BackButton";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || '';

const JoinGameComponent: React.FC = () => {
    const [gameId, setGameId] = useState(''); // Manage Game ID input state
    const initializeWebSocket = useWebSocketStore((state) => state.initializeWebSocket);
    const token = tokenStore((state) => state.token); // Get token from Zustand store
    const router = useRouter();

    const handleJoinGame = () => {
        if (gameId.trim()) { // Validate Game ID
            const socket_url = `${API_BASE_URL.replace('http', 'ws')}/ws/join_game/${gameId}?token=${token}`;
            initializeWebSocket(socket_url, router); // Initialize WebSocket connection
            router.navigate("game"); // Navigate to the game screen
        } else {
            Alert.alert("Invalid Input", "Please enter a valid Game ID."); // Native alert for input validation
        }
    };

    return (
        <>
            <View style={globalStyles.container}>
                <Text style={globalStyles.title}>Join Game</Text>
                <TextInput
                    style={globalStyles.input}
                    placeholder="Enter Game ID"
                    value={gameId}
                    onChangeText={setGameId} // Handle text input
                    autoCapitalize="none" // Disable auto-capitalization
                    autoCorrect={false} // Disable autocorrect
                />
                <TouchableOpacity style={globalStyles.button} onPress={handleJoinGame}>
                    <Text style={globalStyles.buttonText}>Join</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default JoinGameComponent;