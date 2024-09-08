import {useEffect, useRef} from 'react';
import { useRouter } from 'expo-router'; // Import the router for navigation
import { useWebSocketStore } from '@services/socket'; // Import the WebSocket store


const WebSocketListener = () => {
    const { socket, connectionStatus } = useWebSocketStore();
    const router = useRouter(); // Get the router instance from expo-router
    const hasMounted = useRef(false); // Use a ref to track if the component has mounted

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true; // Mark as mounted after the first render
            return;
        }

        // Listen for WebSocket closure or disconnection
        if (connectionStatus === 'disconnected' || connectionStatus === 'closed' || !socket) {
            // If the WebSocket closes, redirect the user to /lobby/menu
            router.replace('lobby/menu');
        }
    }, [connectionStatus, router]);

    return null;
};

export default WebSocketListener;