import FirstShotIcon from "@assets/icons/FirstShotIcon.png";
import DeathmatchIcon from "@assets/icons/skull.png";
import AssassinIcon from "@assets/icons/assassin.png";
import ImposterIcon from "@assets/icons/suspect.png";
import ScavengerIcon from "@assets/icons/vulture.png";
import CaptureTheFlagIcon from "@assets/icons/flag.png";

import React, { useState } from "react";
import { StyleSheet, Image, View, Text, TouchableOpacity } from "react-native";
import { initiateWebSocket } from "@components/archive_api";
import { tokenStore } from "@services/auth";
import { useRouter } from 'expo-router'; // Import the router for navigation

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || '';

const CreateGameComponent: React.FC = () => {
    const [websocket, setWebsocket] = useState<WebSocket>();
    const token = tokenStore((state) => state.token); // Access the token from the Zustand store
    const router = useRouter();

    const handleCreateGame = ({ gameType }: { gameType: string }) => {
        const socket_url = `${API_BASE_URL.replace('http', 'ws')}/ws/create_game/${gameType}?token=${token}`;
        setWebsocket(initiateWebSocket(socket_url));
        router.replace("game");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Game</Text>
            <View style={styles.gridContainer}>
                <TouchableOpacity onPress={() => handleCreateGame({ gameType: "FirstShot" })} style={styles.gameButton}>
                    <Image source={FirstShotIcon} style={styles.icon} />
                    <Text>First Shot</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.disabledGameButton}>
                    <Image source={DeathmatchIcon} style={styles.icon} />
                    <Text>Deathmatch</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.disabledGameButton}>
                    <Image source={AssassinIcon} style={styles.icon} />
                    <Text>Assassin</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.disabledGameButton}>
                    <Image source={ImposterIcon} style={styles.icon} />
                    <Text>Imposter</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.disabledGameButton}>
                    <Image source={ScavengerIcon} style={styles.icon} />
                    <Text>Scavenger</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.disabledGameButton}>
                    <Image source={CaptureTheFlagIcon} style={styles.icon} />
                    <Text>Capture the Flag</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CreateGameComponent;

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
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
    },
    gameButton: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        padding: 10,
        backgroundColor: '#000',
        borderRadius: 5,
    },
    disabledGameButton: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        padding: 10,
        backgroundColor: '#555',
        borderRadius: 5,
    },
    icon: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
});