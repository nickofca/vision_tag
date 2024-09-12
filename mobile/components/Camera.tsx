import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { CameraView } from 'expo-camera';
import { useWebSocketStore} from "@services/socket";
import { tokenStore } from "@services/auth";

interface CameraViewComponentProps {
    websocket: WebSocket | null;
}

const CameraViewComponent: React.FC<CameraViewComponentProps> = ({ websocket }) => {
    const cameraViewRef = useRef<CameraView>(null);
    const { socket, connectionStatus } = useWebSocketStore();
    const { token }  = tokenStore();

    const takePicture = async () => {
        if (cameraViewRef.current) {
            try {
                const options = {
                    quality: 0.5,
                    base64: true,  // Include base64 data to send via WebSocket
                    exif: false,   // Disable exif to reduce memory usage
                };

                const photo = await cameraViewRef.current.takePictureAsync(options);

                if (photo && photo.base64) {  // Ensure photo is defined and base64 exists
                    console.log('Picture taken');

                    // Send the image over WebSocket
                    if (socket && connectionStatus == "connected") {
                        // Construct the action data as a JSON object
                        const actionData = {
                            image: photo.base64,
                        };

                        // Construct the message to be sent
                        const message = JSON.stringify({
                            token: token,
                            type: "SubmittedShot",
                            payload: JSON.stringify(actionData), // Convert actionData to JSON string
                        });
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

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.cameraView}
                ref={cameraViewRef}
                onCameraReady={() => console.log('Camera is ready')}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={takePicture} style={styles.button}>
                    <Text style={styles.text}>Take Picture</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cameraView: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
        alignItems: 'flex-end',
    },
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
    },
    text: {
        fontSize: 18,
        color: 'black',
    },
    preview: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});

export default CameraViewComponent;