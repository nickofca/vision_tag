import React from 'react';
import { Stack } from 'expo-router';
import AuthListener from '@hooks/AuthListener'; // Import the AuthListener

const AuthLayout: React.FC = () => {
    return (
        <>
            <AuthListener />
            <Stack />
        </>
    );
};

export default AuthLayout;