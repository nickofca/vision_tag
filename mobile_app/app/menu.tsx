import React, { useState, useEffect } from 'react';
import { signupUser, loginUser, createGame, joinGame, logoutUser } from '@components/api';
import { Image, TextInput, Button, Text, View, TouchableOpacity, Alert, StyleSheet } from 'react-native';

// Define the props for the Menu component
type MenuScreenProps = {
    onStart: (ws: WebSocket) => void;
};

// Define the Menu component using TypeScript
const Menu: React.FC<MenuScreenProps> = ({ onStart }) => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [token, setToken] = useState<string | null>(null);
    const [gameId, setGameId] = useState<string>('');
    const [isSignup, setIsSignup] = useState<boolean>(false);
    const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('sessionToken');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const handleSignup = async () => {
        if (!agreedToTerms) {
            Alert.alert("Error", "You must agree to the terms and conditions to sign up.");
            return;
        }
        try {
            const userData = await signupUser(username, email, password);
            console.log('User signed up:', userData);
            handleLogin(); // Auto-login after signup
        } catch (error) {
            console.error('Failed to sign up:', error);
        }
    };

    const handleLogin = async () => {
        try {
            const token = await loginUser(username, password);
            setToken(token);
        } catch (error) {
            console.error('Failed to log in:', error);
        }
    };

    const handleSignOut = async () => {
        try {
            if (token) {
                setToken(null);
                localStorage.removeItem('sessionToken');
                await logoutUser(token);
            }
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    const handleCreateGame = (gameType: string) => {
        try {
            const ws = createGame(token!, gameType);
            onStart(ws);  // Pass WebSocket instance to App component via onStart
        } catch (error) {
            console.error('Failed to create game:', error);
        }
    };

    const handleJoinGame = () => {
        try {
            const ws = joinGame(token!, gameId);
            onStart(ws);  // Pass WebSocket instance to App component via onStart
        } catch (error) {
            console.error('Failed to join game:', error);
        }
    };

    return (
        <View style={styles.container}>
            {!token ? (
                <>
                    <View style={styles.centeredContainer}>
                        {isSignup ? (
                            <Text style={styles.header}>Create Account</Text>
                        ) : (
                            <Text style={styles.header}>Log In</Text>
                        )}
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your username"
                            value={username}
                            onChangeText={setUsername}
                        />
                        {isSignup && (
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={setEmail}
                            />
                        )}
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                        {isSignup && (
                            <View style={styles.checkboxContainer}>
                                <TouchableOpacity onPress={() => setAgreedToTerms(!agreedToTerms)}>
                                    <Text style={styles.checkbox}>{agreedToTerms ? '☑' : '☐'}</Text>
                                </TouchableOpacity>
                                <Text style={styles.label}>I agree with Terms & Conditions!</Text>
                            </View>
                        )}
                        <TouchableOpacity style={styles.button} onPress={isSignup ? handleSignup : handleLogin}>
                            <Text style={styles.buttonText}>→</Text>
                        </TouchableOpacity>
                        <Text style={styles.switchText}>
                            {isSignup ? (
                                <>
                                    Already have an account?{' '}
                                    <Text style={styles.link} onPress={() => setIsSignup(false)}>Login</Text>
                                </>
                            ) : (
                                <>
                                    Don't have an account?{' '}
                                    <Text style={styles.link} onPress={() => setIsSignup(true)}>Sign Up</Text>
                                </>
                            )}
                        </Text>
                    </View>
                </>
            ) : (
                <>
                    <Text style={styles.header}>Create Game</Text>
                    <View style={styles.gridContainer}>
                        <TouchableOpacity onPress={() => handleCreateGame("FirstShot")} style={styles.gameTypeButton}>
                            <Image source={require("../assets/icons/FirstShotIcon.png")} style={styles.icon} />
                            <Text style={styles.buttonContent}>First Shot</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.disabledGameTypeButton}>
                            <Image source={require("../assets/icons/skull.png")} style={styles.icon} />
                            <Text style={styles.buttonContent}>Deathmatch</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.disabledGameTypeButton}>
                            <Image source={require("../assets/icons/assassin.png")} style={styles.icon} />
                            <Text style={styles.buttonContent}>Assassin</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.disabledGameTypeButton}>
                            <Image source={require("../assets/icons/suspect.png")} style={styles.icon} />
                            <Text style={styles.buttonContent}>Imposter</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.disabledGameTypeButton}>
                            <Image source={require("../assets/icons/vulture.png")} style={styles.icon} />
                            <Text style={styles.buttonContent}>Scavenger</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.disabledGameTypeButton}>
                            <Image source={require("../assets/icons/flag.png")} style={styles.icon} />
                            <Text style={styles.buttonContent}>Capture the Flag</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Horizontal line added here */}
                    <View style={styles.horizontalLine} />

                    <Text style={styles.header}>Join Game</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Game ID"
                        value={gameId}
                        onChangeText={setGameId}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleJoinGame}>
                        <Text style={styles.buttonText}>→</Text>
                    </TouchableOpacity>

                    <Text style={styles.signOutLink} onPress={handleSignOut}>Sign Out</Text>
                </>
            )}
        </View>
    );
};

// Define the styles using StyleSheet.create
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: '80%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    checkboxContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    checkbox: {
        marginRight: 10,
    },
    label: {
        fontSize: 14,
    },
    button: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 24,
    },
    switchText: {
        marginTop: 10,
        fontSize: 14,
        color: 'grey',
    },
    link: {
        color: 'grey',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    gameTypeButton: {
        marginBottom: 10,
        alignItems: 'center',
    },
    disabledGameTypeButton: {
        marginBottom: 10,
        alignItems: 'center',
        opacity: 0.5,
    },
    buttonContent: {
        textAlign: 'center',
    },
    icon: {
        width: 100,
        height: 100,
    },
    horizontalLine: {
        width: '80%',
        marginVertical: 20,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    signOutLink: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        color: '#007BFF',
    },
});

export default Menu;