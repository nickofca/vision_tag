import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const globalStyles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',  // Center content vertically
        padding: 10,
    },
    button: {
        backgroundColor: 'gray',
        paddingVertical: 12,
        paddingHorizontal: width * 0.1,  // Responsive padding based on screen width
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        width: '80%',
    },
    customButton: {
        backgroundColor: '#000',  // Button background color
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,  // Rounded corners
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',  // Text color
        fontWeight: 'bold',
    },
    buttonContainer: {
        margin: 10,
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cameraView: {
        flex: 1,
    },
    touchableText: {
        color: '#1E90FF',
        fontWeight: 'bold',
    },
    textContainer: {
        flexDirection: 'row',
        marginTop: 20,
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
});

export default globalStyles;