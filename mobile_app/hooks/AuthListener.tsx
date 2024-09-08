import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { tokenStore } from '@services/auth'; // Import your Zustand store

const AuthListener = () => {
    const token = tokenStore((state) => state.token); // Subscribe to the `token` state
    const router = useRouter(); // Use the expo-router hook to handle navigation

    useEffect(() => {
        if (token) {
            // If the token is set, redirect the user to the dashboard
            router.replace('/lobby/menu'); // Replace the current route with the dashboard route
        } else {
            // If the token becomes null or is not set, redirect the user to the login page
            router.replace('/auth/login'); // Replace the current route with the login route
        }
    }, [token, router]); // Trigger this effect whenever `token` or `router` changes

    return null; // This component doesn’t need to render anything
};

export default AuthListener;