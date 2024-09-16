import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import globalStyles from "@styles/globalStyles";

const LobbyMenuComponent: React.FC = () => {
    const router = useRouter();

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Lobby</Text>

            <View style={globalStyles.buttonContainer}>
                <TouchableOpacity
                    style={globalStyles.customButton}
                    onPress={() => router.navigate('/lobby/create')}
                >
                    <Text style={globalStyles.buttonText}>Create Game</Text>
                </TouchableOpacity>
            </View>

            <View style={globalStyles.buttonContainer}>
                <TouchableOpacity
                    style={globalStyles.customButton}
                    onPress={() => router.navigate('/lobby/join')}
                >
                    <Text style={globalStyles.buttonText}>Join Game</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LobbyMenuComponent;