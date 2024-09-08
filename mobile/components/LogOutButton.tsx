import React from 'react';
import { Button, Alert } from 'react-native';
import { logoutUser } from '@services/auth'; // Import your logout function

const LogOutButton = () => {

    const handleLogout = async () => {
        try {
            await logoutUser(); // Call the logout function
            Alert.alert('Logout Successful', 'You have been logged out successfully.');
        } catch {
            // Basic error notification for the user, assuming detailed handling is done in logoutUser
            Alert.alert('Logout Failed', 'Something went wrong while logging out.');
        }
    };

    return (
        <Button
            title="Log Out"
            onPress={handleLogout} // Handle the logout when the button is pressed
        />
    );
};

export default LogOutButton;