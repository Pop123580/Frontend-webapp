'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    preferredLanguage?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = api.getToken();
        const storedUser = api.getUser();

        if (token && storedUser) {
            try {
                const response = await api.getMe();
                if (response.success) {
                    setUser(response.data);
                } else {
                    api.removeToken();
                }
            } catch (err) {
                api.removeToken();
            }
        }
        setLoading(false);
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await api.login({ email, password });
            if (response.success) {
                setUser(response.data.user);
                return { success: true };
            }
            return { success: false, error: 'Login failed' };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            const response = await api.register({ name, email, password });
            if (response.success) {
                setUser(response.data.user);
                return { success: true };
            }
            return { success: false, error: 'Registration failed' };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    };

    const logout = async () => {
        await api.logout();
        setUser(null);
    };

    const updateUser = (data: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...data };
            setUser(updatedUser);
            api.setUser(updatedUser);
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;