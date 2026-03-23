import React, { FC, useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
} from 'react-native';
import { styles } from './styles/signin-screen-styles';
import { ITextInput } from '../types/text-input';
import { useAuth } from '../contexts/auth-context';

interface ISignInScreenProps {
    navigation: any;
}

type TabType = 'login' | 'signup';

export const SignInScreen: FC<ISignInScreenProps> = ({ navigation }) => {
    const { login, register } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('login');
    const [username, setUsername] = useState<ITextInput>({ value: '', error: '' });
    const [password, setPassword] = useState<ITextInput>({ value: '', error: '' });
    const [useBiometrics, setUseBiometrics] = useState<boolean>(false);

    // Sign Up state
    const [regUsername, setRegUsername] = useState<ITextInput>({ value: '', error: '' });
    const [regPassword, setRegPassword] = useState<ITextInput>({ value: '', error: '' });
    const [regConfirm, setRegConfirm] = useState<ITextInput>({ value: '', error: '' });

    const handleSignIn = useCallback((): void => {
        if (!username.value) {
            setUsername(prev => ({ ...prev, error: 'Username is required' }));
            return;
        }
        if (!password.value) {
            setPassword(prev => ({ ...prev, error: 'Password is required' }));
            return;
        }
        const success = login(username.value, password.value);
        if (!success) {
            setPassword(prev => ({ ...prev, error: 'Invalid username or password' }));
        }
    }, [username, password, login]);

    const handleSignUp = useCallback((): void => {
        if (!regUsername.value) {
            setRegUsername(prev => ({ ...prev, error: 'Username is required' }));
            return;
        }
        if (!regPassword.value) {
            setRegPassword(prev => ({ ...prev, error: 'Password is required' }));
            return;
        }
        if (regPassword.value !== regConfirm.value) {
            setRegConfirm(prev => ({ ...prev, error: 'Passwords do not match' }));
            return;
        }
        const success = register(regUsername.value, regPassword.value);
        if (!success) {
            setRegUsername(prev => ({ ...prev, error: 'Username already exists' }));
        }
    }, [regUsername, regPassword, regConfirm, register]);

    const handleBiometricSignIn = useCallback((): void => {
        // TODO: implement biometric sign in
    }, []);

    const handleForgotPassword = useCallback((): void => {
        navigation.navigate('ForgotPasswordScreen');
    }, [navigation]);

    const handleGoogleSignIn = useCallback((): void => {
        // TODO: implement Google OAuth
    }, []);

    const handleFacebookSignIn = useCallback((): void => {
        // TODO: implement Facebook OAuth
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Icon */}
                    <View style={styles.iconWrapper}>
                        <Text style={styles.iconText}>🛍️</Text>
                    </View>

                    {/* Header */}
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Please enter your details</Text>

                    {/* Tab Switcher */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'login' && styles.activeTab]}
                            onPress={() => setActiveTab('login')}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>
                                Login
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'signup' && styles.activeTab]}
                            onPress={() => setActiveTab('signup')}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.tabText, activeTab === 'signup' && styles.activeTabText]}>
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Username field */}
                    {activeTab === 'login' ? (
                        <>
                            <Text style={styles.label}>Username</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="johndoe123"
                                    placeholderTextColor="#BDBDBD"
                                    value={username.value}
                                    onChangeText={(text: string) => setUsername({ value: text, error: '' })}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    returnKeyType="next"
                                />
                            </View>
                            {!!username.error && <Text style={styles.errorText}>{username.error}</Text>}

                            {/* Password field */}
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor="#BDBDBD"
                                    value={password.value}
                                    onChangeText={(text: string) => setPassword({ value: text, error: '' })}
                                    secureTextEntry
                                    returnKeyType="done"
                                />
                            </View>
                            {!!password.error && <Text style={styles.errorText}>{password.error}</Text>}

                            {/* Forgot Password */}
                            <TouchableOpacity
                                style={styles.forgotPasswordRow}
                                onPress={handleForgotPassword}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>

                            {/* Biometrics checkbox */}
                            <TouchableOpacity
                                style={styles.biometricsRow}
                                onPress={() => setUseBiometrics(prev => !prev)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.checkbox, useBiometrics && styles.checkboxChecked]}>
                                    {useBiometrics && <Text style={styles.checkmark}>✓</Text>}
                                </View>
                                <Text style={styles.biometricsText}>Use biometrics for faster login</Text>
                            </TouchableOpacity>

                            {/* Sign In button */}
                            <TouchableOpacity
                                style={styles.signInButton}
                                onPress={handleSignIn}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.signInButtonText}>Sign In</Text>
                            </TouchableOpacity>

                            {/* Biometric Sign In button */}
                            <TouchableOpacity
                                style={styles.biometricButton}
                                onPress={handleBiometricSignIn}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.biometricButtonIcon}>⊙</Text>
                                <Text style={styles.biometricButtonText}>Sign in with Biometrics</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={styles.label}>Username</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="johndoe123"
                                    placeholderTextColor="#BDBDBD"
                                    value={regUsername.value}
                                    onChangeText={(text: string) => setRegUsername({ value: text, error: '' })}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    returnKeyType="next"
                                />
                            </View>
                            {!!regUsername.error && <Text style={styles.errorText}>{regUsername.error}</Text>}

                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor="#BDBDBD"
                                    value={regPassword.value}
                                    onChangeText={(text: string) => setRegPassword({ value: text, error: '' })}
                                    secureTextEntry
                                    returnKeyType="next"
                                />
                            </View>
                            {!!regPassword.error && <Text style={styles.errorText}>{regPassword.error}</Text>}

                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor="#BDBDBD"
                                    value={regConfirm.value}
                                    onChangeText={(text: string) => setRegConfirm({ value: text, error: '' })}
                                    secureTextEntry
                                    returnKeyType="done"
                                />
                            </View>
                            {!!regConfirm.error && <Text style={styles.errorText}>{regConfirm.error}</Text>}

                            <TouchableOpacity
                                style={[styles.signInButton, { marginTop: 16 }]}
                                onPress={handleSignUp}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.signInButtonText}>Create Account</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {/* Separator */}
                    <View style={styles.separatorRow}>
                        <View style={styles.separatorLine} />
                        <Text style={styles.separatorText}>Or continue with</Text>
                        <View style={styles.separatorLine} />
                    </View>

                    {/* Social buttons */}
                    <View style={styles.socialRow}>
                        <TouchableOpacity
                            style={styles.socialButton}
                            onPress={handleGoogleSignIn}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.socialIconGoogle}>G</Text>
                            <Text style={styles.socialButtonText}>Google</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.socialButton}
                            onPress={handleFacebookSignIn}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.socialIconFacebook}>f</Text>
                            <Text style={styles.socialButtonText}>Facebook</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <Text style={styles.footerText}>
                        {'By continuing, you agree to our '}
                        <Text style={styles.footerLink}>Terms of Service</Text>
                        {' and '}
                        <Text style={styles.footerLink}>Privacy Policy</Text>
                        {'.'}
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
