import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';  // Import Ionicons for the back icon

const BackButton = () => {
    const router = useRouter();

    const handlePress = () => {
        router.back();
    };

    return (
        <View style={styles.backButtonContainer}>
            <TouchableOpacity onPress={handlePress}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    backButtonContainer: {
        position: 'absolute',
        top: 25,  // This aligns with the logout button's position
        left: 20,  // Position it on the left side of the screen
        zIndex: 1,  // Ensure it is above other UI elements
    },
});

export default BackButton;