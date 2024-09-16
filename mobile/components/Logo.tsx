import {StyleSheet, View} from "react-native";
import React from "react";
import { Image } from 'react-native';  // Using the default Image component

const Logo: React.FC = () => {
    return (
        <View style={styles.logoContainer}>
            <Image source={require("@assets/branding/logo.png")} style={styles.logo}/>
        </View>
    );
};

export default Logo;

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',       // Centers the content horizontally
        paddingTop: 10,             // Adds space from the top of the screen
        backgroundColor: 'transparent',
    },
    logo: {
        width: 327,                // Set the width of the logo
        height: 50,               // Set the height of the logo
        resizeMode: 'contain',     // Maintain aspect ratio
    },
});




