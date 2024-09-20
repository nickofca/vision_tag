// Game.tsx (or wherever the Game component is located)
import React from "react";
import CameraViewComponent from "@components/Camera";
import { View, StyleSheet } from "react-native";
import ScoreBoard from "@components/Scoring";
import EjectButton from "@components/EjectButton";
import globalStyles from "@styles/globalStyles";
import {useWebSocketStore} from "@services/socket";
import GameIdDisplay from "@components/GameIdDisplay";


const GameScreen: React.FC = () => {
    const websocket = useWebSocketStore((state) => state.socket);

    return (
        <View style={globalStyles.container}>

            <GameIdDisplay />

            <View style={styles.crosshair} />

            <ScoreBoard websocket={websocket} />

            <EjectButton />

            <CameraViewComponent websocket={websocket} />
        </View>
    );
};

export default GameScreen;

const styles = StyleSheet.create({
    crosshair: {
        position: "absolute",
        width: 50,
        height: 50,
        borderWidth: 2,
        borderColor: "#ff0000", // Red crosshair
        borderRadius: 25, // Circular crosshair
        top: "50%",
        left: "50%",
        zIndex: 2, // Higher zIndex to be above the camera
    },
});