// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getUser, loginUser } from '../lib/requests';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initUser = async () => {
      const token = Cookies.get('authToken');
      if (token) {
        const userData = await getUser(token);
        if (userData) {
          setUser(userData);
        }
      }
    };
    initUser();
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    if (data) {
      // Set the authToken cookie and update the user state
      Cookies.set('authToken', data.token);
      setUser(data.user);
      } else {
          console.log('User login failed');
          
        }
      
    
  };

  const logout = () => {
    // Remove the authToken cookie and clear the user state
    Cookies.remove('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
