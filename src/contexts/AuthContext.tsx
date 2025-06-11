
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isOwner: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isOwner, setIsOwner] = useState(false);

  // Simple password authentication - in production, use proper authentication
  const OWNER_PASSWORD = "flower123"; // Change this to your desired password

  useEffect(() => {
    // Check if owner is already logged in
    const ownerLoggedIn = localStorage.getItem('ownerLoggedIn');
    if (ownerLoggedIn === 'true') {
      setIsOwner(true);
    }
  }, []);

  const login = (password: string): boolean => {
    if (password === OWNER_PASSWORD) {
      setIsOwner(true);
      localStorage.setItem('ownerLoggedIn', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsOwner(false);
    localStorage.removeItem('ownerLoggedIn');
  };

  return (
    <AuthContext.Provider value={{ isOwner, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
