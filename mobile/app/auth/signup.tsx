import { signupUser } from "@services/auth";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView } from "react-native";
import CheckBox from 'expo-checkbox'; // You need to install this package
import { useRouter } from 'expo-router'; // Import router from expo-router
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the forward arrow icon
import globalStyles from "@styles/globalStyles";

export default function SignUpComponent() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const router = useRouter(); // Access the router for navigation

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <View style={globalStyles.container}>
                <Text style={globalStyles.title}>Create Account</Text>

                <TextInput
                    style={globalStyles.input}
                    placeholder="Enter your username"
                    value={username}
                    onChangeText={setUsername} // Use onChangeText for TextInput
                    autoCapitalize="none"
                />

                <TextInput
                    style={globalStyles.input}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail} // Use onChangeText for TextInput
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={globalStyles.input}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword} // Use onChangeText for TextInput
                    secureTextEntry={true} // To hide password
                    autoCapitalize="none"
                />

                <View style={globalStyles.checkboxContainer}>
                    <CheckBox
                        value={agreedToTerms}
                        onValueChange={setAgreedToTerms}
                    />
                    <Text style={globalStyles.checkboxLabel}>I agree with Terms & Conditions!</Text>
                </View>

                <TouchableOpacity
                    onPress={async () => {
                        await signupUser(username, email, password);
                    }}
                    disabled={!agreedToTerms}
                    style={ { padding: 10, opacity: agreedToTerms ? 1 : 0.2 } } // Disables button based on agreement
                >
                    {/* Replace text with forward arrow icon */}
                    <Ionicons name="arrow-forward" size={24} color="black" />
                </TouchableOpacity>

                {/* Back to Login Section */}
                <View style={globalStyles.textContainer}>
                    <Text>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.navigate('/auth/login')}>
                        <Text style={globalStyles.touchableText}>Log in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};