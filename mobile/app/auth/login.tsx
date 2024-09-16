import { loginUser } from "@services/auth";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the forward arrow icon
import globalStyles from "@styles/globalStyles";

export default function LoginComponent() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <View style={globalStyles.container}>
                <Text style={globalStyles.title}>Log In</Text>

                <TextInput
                    style={globalStyles.input}
                    placeholder="Enter your username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />

                <TextInput
                    style={globalStyles.input}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                    autoCapitalize="none"
                />

                {/* TouchableOpacity with minimal styles for the black forward arrow */}
                <TouchableOpacity
                    onPress={async () => {
                        await loginUser(username, password);
                    }}
                    style={{ padding: 10 }} // Simple padding for touchable area
                >
                    {/* Black forward arrow */}
                    <Ionicons name="arrow-forward" size={24} color="black" />
                </TouchableOpacity>

                {/* Sign Up Link */}
                <View style={globalStyles.textContainer}>
                    <Text>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => router.navigate('/auth/signup')}>
                        <Text style={globalStyles.touchableText}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};