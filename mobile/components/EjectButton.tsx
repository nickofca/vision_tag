import React from "react";
import { Button } from "react-native";
import { useWebSocketStore } from "@services/socket"; // Make sure this is the correct import path

const EjectButton: React.FC = () => {
    // Correctly select the closeWebSocket function from the Zustand store
    const closeWebSocket = useWebSocketStore((state) => state.closeWebSocket);
    const socket = useWebSocketStore((state) => state.socket);

    // Function to handle the WebSocket close event
    const handleEject = () => {
        console.log("handle eject");
        console.log(socket)
        closeWebSocket(); // Properly invoke the function
        console.log("closeWebSocket finished");

    };

    return <Button title="Eject" onPress={handleEject} />;
};

export default EjectButton;