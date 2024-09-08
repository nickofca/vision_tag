import { useEffect, useRef } from 'react';
import { useRouter, useRootNavigationState } from 'expo-router';
import { tokenStore } from '@services/auth'; // Import your Zustand store

const AuthListener = () => {
    const token = tokenStore((state) => state.token); // Subscribe to the `token` state
    const router = useRouter(); // Use the expo-router hook to handle navigation
    const hasMounted = useRef(false); // Use a ref to track if the component has mounted


    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true; // Mark as mounted after the first render
            return;
        }

        if (token) {
            // If the token is set, redirect the user to the dashboard
            router.replace('/lobby/menu');
        } else {
            // If the token becomes null or is not set, redirect the user to the login page
            router.replace('/auth/login');
        }
    }, [token]); // Trigger this effect whenever `token` or `router` changes

    return null; // This component doesn’t need to render anything
};

export default AuthListener;