import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';  // Use useCameraPermissions hook
import { useWebSocketStore } from "@services/socket";
import { tokenStore } from "@services/auth";
import globalStyles from "@styles/globalStyles";

interface CameraViewComponentProps {
    websocket: WebSocket | null;
}

const CameraViewComponent: React.FC<CameraViewComponentProps> = () => {
    const [cameraRef, setCameraRef] = useState<CameraView | null>(null);  // State to hold CameraView reference
    const { socket, connectionStatus } = useWebSocketStore();
    const { token }  = tokenStore();
    const [permission, requestPermission] = useCameraPermissions();  // Use the permission hook

    // Request camera permissions if they are not granted
    useEffect(() => {
        if (!permission || !permission.granted) {
            requestPermission();  // Request permissions if not already granted
        }
    }, [permission]);

    const takePicture = async () => {
        if (cameraRef) {
            const options = {
                quality: 0.5,
                base64: true,  // Include base64 data to send via WebSocket
                exif: false,   // Disable exif to reduce memory usage
            };
            const photo = await cameraRef.takePictureAsync(options);
            try {
                const options = {
                    quality: 0.5,
                    base64: true,  // Include base64 data to send via WebSocket
                    exif: false,   // Disable exif to reduce memory usage
                };

                const photo = await cameraRef.takePictureAsync(options);

                if (photo && photo.base64) {
                    console.log('Picture taken');

                    // Send the image over WebSocket
                    if (socket && connectionStatus === "connected") {
                        const actionData = {
                            image: photo.base64,
                        };

                        const message = JSON.stringify({
                            token: token,
                            type: "SubmittedShot",
                            payload: JSON.stringify(actionData),
                        });

                        socket.send(message);  // Ensure this line actually sends the WebSocket message
                    } else {
                        console.log('WebSocket is not open');
                    }

                } else {
                    console.log('Failed to capture photo');
                }
            } catch (error) {
                console.error('Error taking picture:', error);
            }
        }
    };

    // Handle permission-related logic
    if (!permission || !permission.granted) {
        return <View><Text>Requesting camera permissions...</Text></View>;
    }

    return (
        <View style={globalStyles.container}>
            <CameraView
                style={globalStyles.cameraView}
                ref={setCameraRef}  // Use callback ref instead of useRef
                onCameraReady={() => console.log('Camera is ready')}
            />
            <View style={globalStyles.buttonContainer}>
                <TouchableOpacity onPress={takePicture} style={globalStyles.button}>
                    <Text style={globalStyles.buttonText}>Take Picture</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CameraViewComponent;