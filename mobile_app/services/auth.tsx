// store.js
import { create } from 'zustand';

// Define the type for the store
interface TokenStore {
    token: string | null;
    setToken: (token: string) => void;
    logout: () => void;
}

// Create the Zustand store with the defined type
export const tokenStore = create<TokenStore>((set) => ({
    token: null, // initial token state

    setToken: (token) => set({ token }), // action to set token
    logout: () => {
        localStorage.removeItem('sessionToken'); // remove token from local storage
        set({ token: null }); // reset token state
    },
}));

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || '';

// Sign up a new user
export const signupUser = (username: string, email: string, password: string): Promise<any> => {
    return fetch(`${API_BASE_URL}/signup/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.payload && data.payload.token) {
                const { token } = data.payload;
                localStorage.setItem('sessionToken', token); // store token in local storage
                return token; // return token for immediate login
            }
            throw new Error('Signup failed');
        })
        .catch((error) => {
            console.error('Error signing up:', error);
            throw error;
        });
};

// Log in a user and retrieve session token
export const loginUser = (username: string, password: string): Promise<string | null> => {
    return fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.payload && data.payload.token) {
                const { token } = data.payload;
                localStorage.setItem('sessionToken', token); // store token in local storage
                tokenStore.getState().setToken(token); // set token in zustand store
                return token; // return token
            }
            throw new Error('Login failed');
        })
        .catch((error) => {
            console.error('Error logging in:', error);
            return null;
        });
};

// Log out the current user using the token from the Zustand store
export const logoutUser = (): Promise<any> => {
    const token = tokenStore.getState().token; // Get the token from the Zustand store

    if (!token) {
        return Promise.reject(new Error('No token found'));
    }

    return fetch(`${API_BASE_URL}/logout/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            tokenStore.getState().logout(); // clear state and remove token
            return data;
        })
        .catch((error) => {
            console.error('Error logging out:', error);
            throw error;
        });
};

// Optional: Restore token from local storage on app load
const storedToken = localStorage.getItem('sessionToken');
if (storedToken) {
    tokenStore.getState().setToken(storedToken); // Restore token from local storage
}