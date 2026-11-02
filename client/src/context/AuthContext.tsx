import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import * as authApi from '../api/auth.api.js';

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('popqueue_token');
      const storedUser = localStorage.getItem('popqueue_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser) as User);
      }
    } catch {
      localStorage.removeItem('popqueue_token');
      localStorage.removeItem('popqueue_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = async (username: string, password: string): Promise<User> => {
    const res = await authApi.login(username, password);
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('popqueue_token', receivedToken);
    localStorage.setItem('popqueue_user', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  };

  const handleLogout = async (): Promise<void> => {
    try {
      if (token) {
        await authApi.logout();
      }
    } catch {
      // ignore server logout errors
    } finally {
      localStorage.removeItem('popqueue_token');
      localStorage.removeItem('popqueue_user');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isLoading,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
