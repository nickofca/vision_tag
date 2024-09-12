import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const LobbyMenuComponent: React.FC = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lobby</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.customButton}
                    onPress={() => router.push('/lobby/create')}
                >
                    <Text style={styles.buttonText}>Create Game</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.customButton}
                    onPress={() => router.push('/lobby/join')}
                >
                    <Text style={styles.buttonText}>Join Game</Text>
                </TouchableOpacity>
            </View>
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
    buttonContainer: {
        margin: 10,
    },
    customButton: {
        backgroundColor: '#000',  // Button background color
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,  // Rounded corners
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',  // Text color
        fontWeight: 'bold',
    },
});