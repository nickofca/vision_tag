import React from 'react';
import { Stack, useSegments } from 'expo-router';  // Import useSegments to detect the active route
import LogOutButton from '@components/LogOutButton'; // Import the LogOutButton
import Logo from "@components/Logo"
import BackButton from '@components/BackButton'; // Import the BackButton

const LobbyLayout = () => {
    const segments = useSegments();  // Detect the current screen segment

    // Only show BackButton on the "create" or "join" screen
    const showBackButton = segments.includes("create") || segments.includes("join");

    return (
        <>
            <Logo />
            {showBackButton && <BackButton />}
            <Stack>
                <Stack.Screen name="create" options={{ headerShown: false }} />
                <Stack.Screen name="join" options={{ headerShown: false }} />
                <Stack.Screen name="menu" options={{ headerShown: false }} />
            </Stack>
            <LogOutButton />
        </>
    );
};

export default LobbyLayout;