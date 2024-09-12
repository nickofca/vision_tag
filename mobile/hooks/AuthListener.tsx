import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { tokenStore } from '@services/auth'; // Import your Zustand store
import { useRoute } from '@react-navigation/native';

const AuthListener = () => {
    const token = tokenStore((state) => state.token); // Subscribe to the `token` state
    const router = useRouter(); // Use the expo-router hook to handle navigation
    const hasMounted = useRef(false); // Use a ref to track if the component has mounted

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true; // Mark as mounted after the first render
            return;
        }

        const currentRoute = useRoute.name; // Get the current route
        console.log(currentRoute)
        if (token && currentRoute !== '/lobby/menu') {
            // If the token is set and the user is not on the lobby menu, redirect to the dashboard
            router.replace('/lobby/menu');
        } else if (!token && currentRoute !== '/auth/login') {
            // If the token is null or not set, and the user is not on the login page, redirect to login
            router.replace('/auth/login');
        }
    }, [token, router]); // Trigger this effect whenever `token` or `router` changes

    return null; // This component doesn’t need to render anything
};

export default AuthListener;