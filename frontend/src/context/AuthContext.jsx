import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem('token') || null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const storedToken = sessionStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        console.error("Hiba a user parse-olásakor", e);
        logout();
      }
    }
  }, []);

  const login = (newToken, newUser) => {
    sessionStorage.setItem('token', newToken);
    sessionStorage.setItem('user', JSON.stringify(newUser));
    
    sessionStorage.setItem('loginTime', new Date().getTime().toString()); 
    
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    

    sessionStorage.removeItem('loginTime'); 
    
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};