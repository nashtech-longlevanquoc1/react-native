import React, { createContext, useContext, ReactNode, useState } from 'react';
import { User } from '../models/user';

interface AuthContextProps {
    user: User | null;
    login: (username: string, password: string) => boolean;
    register: (username: string, password: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [registeredUsers, setRegisteredUsers] = useState<{ username: string; password: string }[]>([
        { username: 'longle', password: '123456' },
    ]);

    const login = (username: string, password: string): boolean => {
        const found = registeredUsers.find(u => u.username === username && u.password === password);
        if (found) {
            setUser({ username });
            return true;
        }
        return false;
    };

    const register = (username: string, password: string): boolean => {
        const exists = registeredUsers.some(u => u.username === username);
        if (exists) return false;
        setRegisteredUsers(prev => [...prev, { username, password }]);
        setUser({ username });
        return true;
    };

    const logout = () => {
        setUser(null);
    };

    const contextValue: AuthContextProps = {
        user,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthProvider, useAuth };


