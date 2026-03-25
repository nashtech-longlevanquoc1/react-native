import { FC, useState, useCallback } from "react"
import { Button, Image, StyleSheet, Text, View } from "react-native";
import NativeCalculator from "../specs/NativeCalculator";

interface IDemoScreen {
    navigation: any;
}

export const DemoScreen: FC<IDemoScreen> = ({ navigation }) => {
    const [addResult, setAddResult] = useState<number | null>(null);
    const [multiplyResult, setMultiplyResult] = useState<number | null>(null);

    const handleAdd = useCallback(async () => {
        if (!NativeCalculator) return;
        const result = await NativeCalculator.add(3, 9);
        setAddResult(result);
    }, []);

    const handleMultiply = useCallback(() => {
        if (!NativeCalculator) return;
        const result = NativeCalculator.multiply(4, 5);
        setMultiplyResult(result);
    }, []);

    return (
        <View style={styles.container}>
            <Image source={{ uri: 'https://reactjs.org/logo-og.png' }}
                style={styles.image} />
            <Text style={styles.red}>just red</Text>
            <Text style={styles.bigBlue}>just bigBlue</Text>
            <Text style={[styles.bigBlue, styles.red]}>bigBlue, then red</Text>
            <Text style={[styles.red, styles.bigBlue]}>red, then bigBlue</Text>
            <Button
                onPress={() => {
                    console.log('You tapped the button!');
                }}
                title="Press Me"
            />
            <View style={styles.separator} />
            <Text style={styles.sectionTitle}>TurboModule Demo</Text>
            {!NativeCalculator && (
                <Text style={styles.unavailable}>⚠ NativeCalculator chưa được build vào app</Text>
            )}
            <Button title="add(3, 9) — async" onPress={handleAdd} />
            {addResult !== null && (
                <Text style={styles.result}>Result: {addResult}</Text>
            )}
            <View style={styles.separator} />
            <Button title="multiply(4, 5) — sync" onPress={handleMultiply} />
            {multiplyResult !== null && (
                <Text style={styles.result}>Result: {multiplyResult}</Text>
            )}
            <View style={styles.separator} />
            <Button
                title="Back Home"
                onPress={() => navigation.navigate('Home')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
    },
    bigBlue: {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: 30,
    },
    red: {
        color: 'red',
    },
    image: {
        width: 300,
        height: 300,
    },
    separator: {
        height: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    result: {
        fontSize: 16,
        color: 'green',
        marginTop: 4,
    },
    unavailable: {
        fontSize: 13,
        color: '#E53935',
        marginBottom: 8,
    },
});