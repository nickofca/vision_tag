import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';  // Import the Stack from expo-router
import LogOutButton from '@components/LogOutButton'; // Import the LogOutButton
import AuthListener from "@hooks/AuthListener";

const LobbyLayout = () => {
    return (
        <View style={styles.container}>
            <AuthListener />
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Lobby</Text>
                <LogOutButton /> {/* Add the logout button here */}
            </View>

            {/* The Stack component manages navigation for the lobby routes */}
            <View style={styles.content}>
                <Stack />
            </View>
        </View>
    );
};

export default LobbyLayout;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    header: {
        height: 60,
        backgroundColor: '#6200ee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    headerText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 16,
    },
});