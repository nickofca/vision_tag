import { Redirect } from 'expo-router';
import 'react-native-url-polyfill/auto';

export default function RootLayout() {
    return (
        <Redirect href="/auth/login" />
    );
}
