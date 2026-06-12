import React, { createContext, useContext, ReactNode, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (): Promise<void> => {
    try {
      // TODO: Implement biometric authentication or PIN verification
      // const success = await BiometricAuth.authenticate();
      // setIsAuthenticated(success);
      
      // Placeholder implementation - replace with actual authentication
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Authentication failed:', error);
      setIsAuthenticated(false);
    }
  };

  const logout = (): void => {
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}