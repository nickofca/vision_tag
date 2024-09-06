import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { CameraView } from 'expo-camera';

interface CameraViewComponentProps {
    websocket: WebSocket; // WebSocket passed as a prop
}

const CameraViewComponent: React.FC<CameraViewComponentProps> = ({ websocket }) => {
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const cameraViewRef = useRef<CameraView>(null);

    const takePicture = async () => {
        if (cameraViewRef.current) {
            try {
                const options = {
                    quality: 0.5,
                    base64: true, // Include base64 data to send via WebSocket
                    exif: true,
                };

                const photo = await cameraViewRef.current.takePictureAsync(options);

                if (photo && photo.uri) {  // Ensure photo is defined before accessing uri
                    setPhotoUri(photo.uri);
                    console.log(photo);

                    if (websocket && websocket.readyState === WebSocket.OPEN) {
                        websocket.send(JSON.stringify({
                            type: 'image',
                            data: photo.base64,
                        }));
                        console.log('Picture sent via WebSocket');
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
            {photoUri && (
                <Image
                    source={{ uri: photoUri }}
                    style={styles.preview}
                />
            )}
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