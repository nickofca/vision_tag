import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Image } from 'expo-image';
import { tokenStore } from "@services/auth";
import { useRouter } from 'expo-router'; // Import the router for navigation
import { useWebSocketStore } from "@services/socket";
import globalStyles from "@styles/globalStyles";
import BackButton from "@components/BackButton";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || '';

// Import your PNG icons similarly to the flagIcon
import flagIcon from "@assets/icons/flag.png";
import firstShotIcon from "@assets/icons/FirstShotIcon.png";
import skullIcon from "@assets/icons/skull.png";
import assassinIcon from "@assets/icons/assassin.png";
import suspectIcon from "@assets/icons/suspect.png";
import vultureIcon from "@assets/icons/vulture.png";

const CreateGameComponent: React.FC = () => {
    const initializeWebSocket = useWebSocketStore((state) => state.initializeWebSocket)
    const token = tokenStore((state) => state.token); // Access the token from the Zustand store
    const router = useRouter();

    const handleCreateGame = ({ gameType }: { gameType: string }) => {
        const socket_url = `${API_BASE_URL.replace('http', 'ws')}/ws/create_game/${gameType}?token=${token}`;
        initializeWebSocket(socket_url, router);
        router.replace("game");
    };

    return (
        <>
            <View style={globalStyles.container}>
                <Text style={globalStyles.title}>Create Game</Text>
                <View style={styles.gridContainer}>
                    <TouchableOpacity onPress={() => handleCreateGame({ gameType: "FirstShot" })} style={styles.gameButton}>
                        <Image source={firstShotIcon} style={styles.icon} />
                        <Text>First Shot</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.disabledGameButton}>
                        <Image source={skullIcon} style={styles.icon} />
                        <Text>Deathmatch</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.disabledGameButton}>
                        <Image source={assassinIcon} style={styles.icon} />
                        <Text>Assassin</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.disabledGameButton}>
                        <Image source={suspectIcon} style={styles.icon} />
                        <Text>Imposter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.disabledGameButton}>
                        <Image source={vultureIcon} style={styles.icon} />
                        <Text>Scavenger</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.disabledGameButton}>
                        <Image source={flagIcon} style={styles.icon} />
                        <Text>Capture the Flag</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

export default CreateGameComponent;

const styles = StyleSheet.create({
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
        backgroundColor: '#00000000',
        borderRadius: 5,
    },
    disabledGameButton: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        padding: 10,
        backgroundColor: '#777',
        borderRadius: 5,
    },
    icon: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
});