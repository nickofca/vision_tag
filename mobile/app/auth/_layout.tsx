import React from 'react';
import { Stack } from 'expo-router';
import Logo from "@components/Logo"

const AuthLayout: React.FC = () => {
    return (
        <>
            <Logo />
            <Stack>
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="signup" options={{ headerShown: false }} />
            </Stack>
        </>
    );
};

export default AuthLayout;