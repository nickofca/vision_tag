import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';  // Import the Stack from expo-router
import LogOutButton from '@components/LogOutButton'; // Import the LogOutButton


const LobbyLayout = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <LogOutButton />
            </View>

            <View style={styles.content}>
                <Stack />
            </View>
        </SafeAreaView>
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
    content: {
        flex: 1,
        padding: 16,
    },
});