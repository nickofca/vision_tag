import { create } from 'zustand';

interface WebSocketStore {
    socket: WebSocket | null;
    connected: boolean;
    initializeWebSocket: (url: string, router: any) => void; // Pass router as an argument
    sendMessage: (message: string) => void;
    connectionStatus: string;
}

// Create the Zustand store
export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
    socket: null, // Initially, the WebSocket is not connected
    connected: false, // Connection status
    connectionStatus: 'disconnected', // Descriptive status for the WebSocket
    initializeWebSocket: (url: string, router: any) => {
        // Initialize a new WebSocket connection
        const socket = new WebSocket(url);

        // Setup WebSocket event listeners
        socket.onopen = () => {
            set({ socket, connected: true, connectionStatus: 'connected' });
            console.log('WebSocket connection opened.');
        };

        socket.onmessage = (event: MessageEvent) => {
            console.log('Message received:', event.data);
            // Handle the message or update the store if necessary
        };

        socket.onclose = () => {
            set({ connected: false, connectionStatus: 'disconnected', socket: null });
            console.log('WebSocket connection closed.');
        };

        socket.onerror = (error: Event) => {
            console.error('WebSocket error:', error);
            set({ connectionStatus: 'error' });
        };
    },
    sendMessage: (message: string) => {
        const { socket, connected } = get();
        if (connected && socket) {
            socket.send(message);
            console.log('Message sent:', message);
        } else {
            console.log('WebSocket is not connected.');
        }
    },
}));