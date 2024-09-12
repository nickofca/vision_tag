import React from 'react';
import { Stack } from 'expo-router';
import {DefaultTheme, ThemeProvider} from "@react-navigation/native"; // Import the AuthListener

const AuthLayout: React.FC = () => {
    return (
        <>
            <ThemeProvider value={DefaultTheme}>
                <Stack>
                    <Stack.Screen name="login" options={{ headerShown: false }} />
                </Stack>
            </ThemeProvider>
        </>
    );
};

export default AuthLayout;