// components/EjectButton.tsx
import React, { useCallback } from "react";
import { Button } from "react-native";

type EjectButtonProps = {
    websocket: WebSocket | null;
    setStartGame: (start: boolean) => void;
};

const EjectButton: React.FC<EjectButtonProps> = ({ websocket, setStartGame }) => {
    const handleEject = useCallback(() => {
        setStartGame(false); // Set the game status to false
        if (websocket) {
            websocket.close(); // Close the WebSocket connection
            // Send exit game message to server (if needed)
            websocket.send(JSON.stringify({ type: 'ExitGame' }));
        }
    }, [websocket, setStartGame]);

    return <Button title="Eject" onPress={handleEject} />;
};

export default EjectButton;