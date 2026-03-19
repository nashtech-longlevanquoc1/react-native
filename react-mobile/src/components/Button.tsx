import React from 'react';
import {
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';

interface ButtonProps {
    label: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    label,
    onPress,
    style,
    textStyle,
    disabled = false,
}) => {
    return (
        <TouchableOpacity
            style={[styles.button, style, disabled && styles.disabled]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
        >
            <Text style={[styles.text, textStyle]}>{label}</Text>
        </TouchableOpacity>
    );
};

type IButtonStyles = {
    button: ViewStyle;
    disabled: ViewStyle;
    text: TextStyle;
};

const styles = StyleSheet.create<IButtonStyles>({
    button: {
        width: '80%',
        marginVertical: 10,
        paddingVertical: 10,
        backgroundColor: '#0DF2F2',
        alignItems: 'center',
        borderRadius: 10,
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 15,
        lineHeight: 26,
        color: 'black',
    },
});