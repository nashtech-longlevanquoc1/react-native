import { StyleSheet, TextStyle, ViewStyle } from "react-native";

type ISignInStyles = {
    changeLanguageContent: ViewStyle;
    languageItem: ViewStyle;
    forgotPassword: ViewStyle;
    row: ViewStyle;
    forgot: TextStyle;
    link: TextStyle;
};

export const signinStyles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        padding: 20,
        flex: 1,
        flexDirection: 'column',
    },
    topSection: {
        alignContent: 'center',
        flex: 0.2,
    },
    middleSection: {
        alignContent: 'center',
        flex: 0.5,
    },
    bottomSection: {
        alignContent: 'center',
        flex: 0.2,
    },
});

export const styles = StyleSheet.create<ISignInStyles>({
    changeLanguageContent: {
        flexDirection: 'row',
        position: 'absolute',
        top: 20,
        right: 0,
    },
    languageItem: {
        padding: 5,
    },
    forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    forgot: {
        fontSize: 13,
    },
    link: {
        fontWeight: 'bold',
        color: 'gray',
    },
});