import { useEffect } from 'react';
import { useRouter } from 'expo-router'; // Import the router for navigation
import { useWebSocketStore } from '@services/socket'; // Import the WebSocket store


const WebSocketListener = () => {
    const { initializeWebSocket, connectionStatus } = useWebSocketStore();
    const router = useRouter(); // Get the router instance from expo-router

    useEffect(() => {
        // Initialize the WebSocket when the component mounts
        initializeWebSocket('ws://your-websocket-url');

        // Listen for WebSocket closure or disconnection
        if (connectionStatus === 'disconnected' || connectionStatus === 'closed') {
            // If the WebSocket closes, redirect the user to /lobby/menu
            router.replace('lobby/menu');
        }
    }, [connectionStatus, router]);

    return null;
};

export default WebSocketListener;