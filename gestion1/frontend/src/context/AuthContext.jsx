import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('AuthContext mounted. Token from localStorage:', token);
        const fetchUserInfo = async () => {
            if (token) {
                try {
                    const response = await fetch('/api/me', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                    } else {
                        // If any error occurs (401, 403, 500), clear token
                        console.warn('Failed to fetch user info, logging out. Status:', response.status);
                        localStorage.removeItem('token');
                        setToken(null);
                        setUser(null);
                        window.location.href = '/login';
                    }
                } catch (error) {
                    console.error('Error fetching user info:', error);
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                    window.location.href = '/login';
                }
            }
            setLoading(false);
        };
        fetchUserInfo();
    }, [token]);

    const login = async (email, password) => {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const response = await fetch('/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        setToken(data.access_token);

        // Fetch user info
        const userResponse = await fetch('/api/me', {
            headers: {
                'Authorization': `Bearer ${data.access_token}`
            }
        });
        let userData = null;
        if (userResponse.ok) {
            userData = await userResponse.json();
            setUser(userData);
        }

        return userData;
    };

    const register = async (userData) => {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Registration failed');
        }
        return true;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
