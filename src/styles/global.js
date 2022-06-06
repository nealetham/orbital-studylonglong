import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, Button } from 'react-native';



export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#FFFFFF',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    inlineTextStyle: {
        borderRadius: 15,
        backgroundColor: '#FAFAFA',
        paddingLeft: 20,
        paddingRight: 20,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 16,
        height: 44,
    },
    actionButton: {
        elevation: 8,
        backgroundColor: '#FFDCAB',
        borderRadius: 15,
        height: 34,
        width: 136,
        paddingVertical: 6,
        position: 'absolute',
        right: 30,
        bottom: 45,
    },
    actionButtonText: {
        textAlign: 'center',
        fontSize: 16,
    },
    bodyText: {
        textAlign: 'center',
    },
})
