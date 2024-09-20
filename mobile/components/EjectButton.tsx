import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { useWebSocketStore } from "@services/socket";
import { useRouter } from "expo-router"; // Make sure this is the correct import path

const EjectButton: React.FC = () => {
    // Correctly select the closeWebSocket function from the Zustand store
    const socket = useWebSocketStore((state) => state.socket);
    const router = useRouter(); // Use the expo-router hook to handle navigation

    // Function to handle the WebSocket close event
    const handleEject = () => {
        if (socket) {
            socket.close();
        }
        router.replace('/lobby/menu');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.logOutButton} onPress={handleEject}>
                <Text style={styles.buttonText}>Eject</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 20, // Higher positioning to avoid overlapping with the status bar
        right: 10, // Distance from the right edge of the screen
        zIndex: 2, // Higher zIndex to be above the camera
    },
    logOutButton: {
        backgroundColor: '#FF5C5C', // Red color to make the button more noticeable
        width: 80, // Slightly smaller width
        height: 30, // Adjusted height
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20, // Rounded corners for a modern look
        shadowColor: '#000', // Add a subtle shadow for depth
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3, // Shadow for Android devices
    },
    buttonText: {
        color: '#fff', // White text for contrast
        fontSize: 14, // Adjust font size
        fontWeight: '600', // Slightly bolder text
    },
});

export default EjectButton;