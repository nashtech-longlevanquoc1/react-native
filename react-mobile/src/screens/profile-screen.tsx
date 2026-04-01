import React from "react";
import { Text, View, StyleSheet } from "react-native";
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../types/navigation';

type ProfileScreenProps = BottomTabScreenProps<MainTabParamList, 'Profile'>;

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
    return (
        <View style={styles.container}>
            <Text>Profile</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});