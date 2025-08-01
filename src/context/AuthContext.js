// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('travel-card-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

const login = async (credentials) => {
  try {
    const response = await fetch('http://localhost:5014/api/Auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();

    // Assuming the API returns user info and a token
    const user = {
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar || '👩',
      customerId: data.customerId
    };

    setUser(user);
    localStorage.setItem('travel-card-user', JSON.stringify(user));
    localStorage.setItem('travel-card-token', data.token); // Save JWT token

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.message };
  }
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem('travel-card-user');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};