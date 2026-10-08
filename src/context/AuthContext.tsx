import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, UserRole, LoginCredentials, RegisterCredentials } from "../types";
import { authApi } from "../lib/api/auth";
import { MockStore } from "../lib/api/mockData";

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => Promise<void>;
  switchPersona: (role: UserRole) => User | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initAuth = useCallback(async () => {
    try {
      MockStore.init();
      const current = MockStore.getCurrentUser();
      if (current) {
        setUser(current);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error("Auth init error:", e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authApi.login(credentials);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authApi.register(credentials);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const switchPersona = (role: UserRole): User | null => {
    const switched = authApi.switchPersona(role);
    if (switched) {
      setUser(switched);
    }
    return switched;
  };

  const refreshUser = async (): Promise<void> => {
    const current = MockStore.getCurrentUser();
    setUser(current ? { ...current } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchPersona,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
