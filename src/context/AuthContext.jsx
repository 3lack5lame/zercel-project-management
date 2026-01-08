import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize auth from localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('authToken');
        
        if (savedUser && savedToken) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
            } catch {
                localStorage.removeItem('user');
                localStorage.removeItem('authToken');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            
            // Mock API call - Replace with real API
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Mock validation
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            if (!email.includes('@')) {
                throw new Error('Invalid email format');
            }

            // Create mock user object
            const mockUser = {
                id: Date.now().toString(),
                email: email,
                name: email.split('@')[0],
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
                createdAt: new Date().toISOString(),
            };

            // Mock token
            const mockToken = btoa(JSON.stringify(mockUser)) + '_' + Date.now();

            // Save to localStorage
            localStorage.setItem('user', JSON.stringify(mockUser));
            localStorage.setItem('authToken', mockToken);

            setUser(mockUser);
            setIsAuthenticated(true);
            toast.success('Logged in successfully');
            
            return { success: true, user: mockUser };
        } catch (error) {
            toast.error(error.message || 'Login failed');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const signup = async (name, email, password, confirmPassword) => {
        try {
            setLoading(true);

            // Mock API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Validation
            if (!name || !email || !password || !confirmPassword) {
                throw new Error('All fields are required');
            }

            if (!email.includes('@')) {
                throw new Error('Invalid email format');
            }

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            // Create mock user
            const mockUser = {
                id: Date.now().toString(),
                name: name,
                email: email,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
                createdAt: new Date().toISOString(),
            };

            // Mock token
            const mockToken = btoa(JSON.stringify(mockUser)) + '_' + Date.now();

            // Save to localStorage
            localStorage.setItem('user', JSON.stringify(mockUser));
            localStorage.setItem('authToken', mockToken);

            setUser(mockUser);
            setIsAuthenticated(true);
            toast.success('Account created successfully');
            
            return { success: true, user: mockUser };
        } catch (error) {
            toast.error(error.message || 'Sign up failed');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        try {
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            setUser(null);
            setIsAuthenticated(false);
            toast.success('Logged out successfully');
            return { success: true };
        } catch (error) {
            toast.error('Logout failed');
            return { success: false, error: error.message };
        }
    };

    const forgotPassword = async (email) => {
        try {
            setLoading(true);

            // Mock API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (!email || !email.includes('@')) {
                throw new Error('Please enter a valid email address');
            }

            toast.success('Password reset link sent to your email');
            return { success: true };
        } catch (error) {
            toast.error(error.message || 'Failed to send reset link');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (updates) => {
        try {
            setLoading(true);

            // Mock API call
            await new Promise((resolve) => setTimeout(resolve, 800));

            const updatedUser = {
                ...user,
                ...updates,
            };

            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            toast.success('Profile updated successfully');
            
            return { success: true, user: updatedUser };
        } catch (error) {
            toast.error('Failed to update profile');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        signup,
        logout,
        forgotPassword,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
