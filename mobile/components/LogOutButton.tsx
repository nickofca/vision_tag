import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert, ActivityIndicator, View, StyleSheet } from 'react-native';
import { logoutUser } from '@services/auth'; // Import your logout function
import globalStyles from '@styles/globalStyles';

const LogOutButton = () => {
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true); // Start loading
        try {
            await logoutUser(); // Call the logout function
            Alert.alert('Logout Successful', 'You have been logged out successfully.');
        } catch {
            // Basic error notification for the user, assuming detailed handling is done in logoutUser
            Alert.alert('Logout Failed', 'Something went wrong while logging out.');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.logOutButton}
                onPress={handleLogout}
                disabled={loading}
            >
                <View style={globalStyles.innerContainer}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Log Out</Text>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 20, // Higher positioning to avoid overlapping with the status bar
        right: 10, // Distance from the right edge of the screen
    },
    logOutButton: {
        backgroundColor: '#FF5C5C', // Red color to make the button more noticeable
        width: 80, // Slightly smaller width
        height: 30, // Adjusted height
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20, // Rounded corners for a modern look
        shadowColor: '#000', // Add a subtle shadow for depth
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3, // Shadow for Android devices
    },
    buttonText: {
        color: '#fff', // White text for contrast
        fontSize: 14, // Adjust font size
        fontWeight: '600', // Slightly bolder text
    },
});

export default LogOutButton;