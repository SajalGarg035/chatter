import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();
const API_URL = 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Only run once when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (token) {
          // Try to load user from localStorage first
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (error) {
              console.error('Failed to parse stored user data:', error);
              // Clear invalid data
              localStorage.removeItem('user');
            }
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear potentially corrupted auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
        setInitialCheckDone(true);
      }
    };

    checkAuth();
  }, []); // Empty dependency array - only run once

  const login = async (email, password) => {
    setLoading(true);
    try {
      console.log(`Attempting login to ${API_URL}/api/auth/login`);
      
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      console.log("Login response:", data);
      
      if (!response.ok) throw new Error(data.message || 'Login failed');
      
      localStorage.setItem('token', data.token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }
      
      setToken(data.token);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      console.log(`Attempting registration to ${API_URL}/api/auth/signup`);
      
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      console.log("Registration response:", data);
      
      if (!response.ok) {
        if (data.message === 'Email already exists') {
          throw new Error('This email is already registered. Please use a different email or login.');
        }
        throw new Error(data.message || 'Registration failed');
      }
      
      localStorage.setItem('token', data.token);
      setToken(data.token);
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      
      // Optional: Call logout API
      if (token) {
        fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        }).catch(err => console.warn('Logout API error (non-critical):', err));
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    initialCheckDone,
    login,
    register,
    logout
  };

  // Only render children once initial auth check is done
  // This prevents flashing of login screen before auth is checked
  return <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};