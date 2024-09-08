import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const LobbyMenuComponent: React.FunctionComponent = () => {
    const router = useRouter(); // use the router from expo-router for navigation

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lobby</Text>
            <Button
                title="Create Game"
                onPress={() => router.push('/game/create')} // Navigate to /game/create
            />
            <Button
                title="Join Game"
                onPress={() => router.push('/game/join')} // Navigate to /game/join
            />
        </View>
    );
};

export default LobbyMenuComponent;

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
        marginBottom: 24,
    },
});