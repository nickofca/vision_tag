import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet, ActivityIndicator, View } from 'react-native';
import { logoutUser } from '@services/auth'; // Import your logout function

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
        <TouchableOpacity
            style={styles.button}
            onPress={handleLogout}
            disabled={loading}
        >
            <View style={styles.innerContainer}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                    ) : (
                    <Text style={styles.buttonText}>Log Out</Text>
            )}
        </View>
</TouchableOpacity>
);
};

export default LogOutButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#6200ee',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});