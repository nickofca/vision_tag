import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';  // Correct usage of CameraView
import { useWebSocketStore } from "@services/socket";
import { tokenStore } from "@services/auth";
import globalStyles from "@styles/globalStyles";

interface CameraViewComponentProps {
    websocket: WebSocket | null;
}

const CameraViewComponent: React.FC<CameraViewComponentProps> = () => {
    const cameraRef = useRef<CameraView | null>(null);  // Use useRef for camera reference
    const { socket, connectionStatus } = useWebSocketStore();
    const { token } = tokenStore();
    const [permission, requestPermission] = useCameraPermissions();

    // Request camera permissions if they are not granted
    useEffect(() => {
        if (!permission || !permission.granted) {
            requestPermission();
        }
    }, [permission]);

    const takePicture = async () => {
        if (cameraRef.current) {
            const options = {
                quality: 0.5,
                base64: true,  // Include base64 data to send via WebSocket
                exif: false,   // Disable exif to reduce memory usage
                width: 1920,   // Set the desired width
                height: 1080,  // Set the desired height
            };

            try {
                const photo = await cameraRef.current.takePictureAsync(options);

                if (photo && photo.base64) {
                    console.log('Picture taken successfully');

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

                        socket.send(message);
                    } else {
                        console.log('WebSocket is not connected');
                    }
                } else {
                    console.log('Failed to capture photo');
                }
            } catch (error) {
                console.error('Error taking picture:', error);
            }
        }
    };

    if (!permission || !permission.granted) {
        return (
            <View>
                <Text>Requesting camera permissions...</Text>
            </View>
        );
    }

    return (
        <View style={globalStyles.container}>
            <CameraView
                style={globalStyles.cameraView}
                ref={cameraRef}  // Corrected usage of ref
                onCameraReady={() => console.log('Camera is ready')}
            />
            <TouchableOpacity onPress={takePicture} style={globalStyles.button}>
                <Text style={globalStyles.buttonText}>Take Picture</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CameraViewComponent;