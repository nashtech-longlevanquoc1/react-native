import React, { useCallback } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../components/Button';

type RootStackParamList = {
    Home: undefined;
    Profile: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();

    const handleGoToProfile = useCallback(() => {
        navigation.navigate('Profile');
    }, [navigation]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Welcome Home</Text>
                    <Text style={styles.subtitle}>Explore our features below</Text>
                </View>

                <View style={styles.content}>
                    <Button
                        label="Go to Profile"
                        onPress={handleGoToProfile}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

type IHomeScreenStyles = {
    safeArea: ViewStyle;
    scrollContent: ViewStyle;
    header: ViewStyle;
    title: TextStyle;
    subtitle: TextStyle;
    content: ViewStyle;
};

const styles = StyleSheet.create<IHomeScreenStyles>({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    content: {
        width: '100%',
        alignItems: 'center',
    },
});
