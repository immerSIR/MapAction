import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedUser = sessionStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const [user, setUser] = useState(parsedUser);
  const userType = sessionStorage.getItem("user_type")
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("token") !== null; 
  });

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("first_name");
    sessionStorage.removeItem("zone");
    sessionStorage.removeItem("user_type");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout,user, userType }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
