// src/navigation/MainNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeScreen } from '../home-screen';
import { ProfileScreen } from '../profile-screen';
import { StyleSheet, Text, Image } from 'react-native';
import { ListScreen } from '../list-screen';
import { DemoScreen } from '../demo-screen';
import type { RootStackParamList, MainTabParamList } from '../../types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ACTIVE = '#00BCD4';
const TAB_INACTIVE = '#9E9E9E';

type MainNavigatorProps = NativeStackScreenProps<RootStackParamList, 'Main'>;

export const MainNavigator: React.FC<MainNavigatorProps> = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: TAB_ACTIVE,
                tabBarInactiveTintColor: TAB_INACTIVE,
                tabBarStyle: { paddingBottom: 6, paddingTop: 4, height: 60 },
                tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
            }}
        >
            <Tab.Screen
                name="Shop"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Shop',
                    tabBarIcon: ({ color }) => (
                        <Image
                            source={require('../../assets/images/home.png')}
                            style={[styles.tabImg, { tintColor: color }]}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Categories"
                component={ListScreen}
                options={{
                    tabBarLabel: 'Categories',
                    tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>⊟</Text>,
                }}
            />
            <Tab.Screen
                name="Saved"
                component={ListScreen}
                options={{
                    tabBarLabel: 'Saved',
                    tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>♡</Text>,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => (
                        <Image
                            source={require('../../assets/images/person.png')}
                            style={[styles.tabImg, { tintColor: color }]}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Demo"
                component={DemoScreen}
                options={{
                    tabBarLabel: 'Demo',
                    tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>⚡</Text>,
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabIcon: {
        fontSize: 22,
    },
    tabImg: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
});