import { signupUser } from "@services/auth";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import CheckBox from '@react-native-community/checkbox'; // You need to install this package

export default function SignUpComponent() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername} // Use onChangeText for TextInput
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail} // Use onChangeText for TextInput
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword} // Use onChangeText for TextInput
                secureTextEntry={true} // To hide password
                autoCapitalize="none"
            />

            <View style={styles.checkboxContainer}>
                <CheckBox
                    value={agreedToTerms}
                    onValueChange={setAgreedToTerms}
                    tintColors={{ true: '#000', false: '#ccc' }}
                />
                <Text style={styles.checkboxLabel}>I agree with Terms & Conditions!</Text>
            </View>

            <TouchableOpacity
                onPress={async () => {
                    await signupUser(username, email, password);
                }}
                disabled={!agreedToTerms}
                style={[styles.button, { opacity: agreedToTerms ? 1 : 0.5 }]} // Disables button based on agreement
            >
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});