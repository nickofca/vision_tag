import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import AuthListener from "@hooks/AuthListener";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('@assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <ThemeProvider value={DefaultTheme}>
            <AuthListener />
            <SafeAreaView style={styles.container}>
                <Stack
                    screenOptions={{
                        headerShown: false,  // This disables the header for all screens
                    }}
                    initialRouteName="/auth/login"
                />
            </SafeAreaView>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});