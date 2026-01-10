import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../config/supabase';
import GitHubService from '../services/githubService';

const AuthContext = createContext();

// Check if Supabase is configured
const isSupabaseConfigured = 
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [githubToken, setGithubToken] = useState(null);
    const [githubService, setGithubService] = useState(null);

    // Initialize auth from localStorage or Supabase
    useEffect(() => {
        const initAuth = async () => {
            try {
                if (isSupabaseConfigured) {
                    // Check Supabase session
                    const { data, error } = await supabase.auth.getSession();
                    
                    if (data?.session?.user) {
                        const user = {
                            id: data.session.user.id,
                            email: data.session.user.email,
                            name: data.session.user.user_metadata?.name || data.session.user.email.split('@')[0],
                            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.session.user.email}`,
                            createdAt: data.session.user.created_at,
                        };
                        setUser(user);
                        setIsAuthenticated(true);
                        // Try to extract GitHub provider token and initialize GitHubService
                        try {
                            const providerToken = data.session?.provider_token || data.session?.provider_token?.access_token || data.session?.access_token;
                            if (providerToken) {
                                setGithubToken(providerToken);
                                setGithubService(new GitHubService(providerToken));
                            }
                        } catch (e) {
                            console.warn('No provider token available', e);
                        }
                    }
                } else {
                    // Check localStorage for mock auth
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
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // Listen for auth changes if Supabase is configured
        if (isSupabaseConfigured) {
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                if (session?.user) {
                    const user = {
                        id: session.user.id,
                        email: session.user.email,
                        name: session.user.user_metadata?.name || session.user.email.split('@')[0],
                        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`,
                        createdAt: session.user.created_at,
                    };
                    setUser(user);
                    setIsAuthenticated(true);
                    // When auth state changes, try to set GitHub token/service if present
                    try {
                        const providerToken = session?.provider_token || session?.provider_token?.access_token || session?.access_token;
                        if (providerToken) {
                            setGithubToken(providerToken);
                            setGithubService(new GitHubService(providerToken));
                        }
                    } catch (e) {
                        console.warn('No provider token in session', e);
                    }
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                    setGithubToken(null);
                    setGithubService(null);
                }
            });

            return () => {
                subscription?.unsubscribe();
            };
        }
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);

            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            if (!email.includes('@')) {
                throw new Error('Invalid email format');
            }

            // Use Supabase if configured
            if (isSupabaseConfigured) {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    throw new Error(error.message || 'Login failed');
                }

                const mockUser = {
                    id: data.user.id,
                    email: data.user.email,
                    name: data.user.email.split('@')[0],
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
                    createdAt: data.user.created_at,
                };

                localStorage.setItem('user', JSON.stringify(mockUser));
                setUser(mockUser);
                setIsAuthenticated(true);
                toast.success('Logged in successfully');

                return { success: true, user: mockUser };
            } else {
                // Fall back to mock authentication
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const mockUser = {
                    id: Date.now().toString(),
                    email: email,
                    name: email.split('@')[0],
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
                    createdAt: new Date().toISOString(),
                };

                const mockToken = btoa(JSON.stringify(mockUser)) + '_' + Date.now();

                localStorage.setItem('user', JSON.stringify(mockUser));
                localStorage.setItem('authToken', mockToken);

                setUser(mockUser);
                setIsAuthenticated(true);
                toast.success('Logged in successfully (Mock)');

                return { success: true, user: mockUser };
            }
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

            // Use Supabase if configured
            if (isSupabaseConfigured) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            name: name,
                        },
                    },
                });

                if (error) {
                    throw new Error(error.message || 'Sign up failed');
                }

                const mockUser = {
                    id: data.user.id,
                    email: data.user.email,
                    name: name,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
                    createdAt: data.user.created_at,
                };

                localStorage.setItem('user', JSON.stringify(mockUser));
                setUser(mockUser);
                setIsAuthenticated(true);
                toast.success('Account created successfully. Please check your email to verify your account.');

                return { success: true, user: mockUser };
            } else {
                // Fall back to mock authentication
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const mockUser = {
                    id: Date.now().toString(),
                    name: name,
                    email: email,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
                    createdAt: new Date().toISOString(),
                };

                const mockToken = btoa(JSON.stringify(mockUser)) + '_' + Date.now();

                localStorage.setItem('user', JSON.stringify(mockUser));
                localStorage.setItem('authToken', mockToken);

                setUser(mockUser);
                setIsAuthenticated(true);
                toast.success('Account created successfully (Mock)');

                return { success: true, user: mockUser };
            }
        } catch (error) {
            toast.error(error.message || 'Sign up failed');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            // Use Supabase if configured
            if (isSupabaseConfigured) {
                await supabase.auth.signOut();
            }

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

            if (!email || !email.includes('@')) {
                throw new Error('Please enter a valid email address');
            }

            // Use Supabase if configured
            if (isSupabaseConfigured) {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/reset-password`,
                });

                if (error) {
                    throw new Error(error.message || 'Failed to send reset link');
                }

                toast.success('Password reset link sent to your email');
                return { success: true };
            } else {
                // Fall back to mock
                await new Promise((resolve) => setTimeout(resolve, 1000));
                toast.success('Password reset link sent to your email (Mock)');
                return { success: true };
            }
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

    const loginWithGitHub = async () => {
        try {
            setLoading(true);

            // Use Supabase's built-in GitHub OAuth
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: `${window.location.origin}/auth/github/callback`,
                },
            });

            if (error) {
                throw error;
            }

            // User will be redirected to GitHub, then back to callback URL
            return { success: true };
        } catch (error) {
            toast.error(error.message || 'Failed to authenticate with GitHub');
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        githubService,
        githubToken,
        login,
        signup,
        logout,
        forgotPassword,
        updateProfile,
        loginWithGitHub,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
