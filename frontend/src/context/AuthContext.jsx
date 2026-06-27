import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('ki_gostoso_token');
    const savedAdmin = localStorage.getItem('ki_gostoso_admin');
    if (savedToken && savedAdmin) {
      setToken(savedToken);
      setAdmin(JSON.parse(savedAdmin));
    }
  }, []);

  const login = (tokenValue, adminData) => {
    localStorage.setItem('ki_gostoso_token', tokenValue);
    localStorage.setItem('ki_gostoso_admin', JSON.stringify(adminData));
    setToken(tokenValue);
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('ki_gostoso_token');
    localStorage.removeItem('ki_gostoso_admin');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
