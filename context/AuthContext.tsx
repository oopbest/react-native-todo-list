import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
import { getToken, saveToken, removeToken } from "../services/authStorage";
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // กู้คืน Token ตอนเปิดแอปขึ้นมา
  useEffect(() => {
    async function restoreSession() {
      try {
        const savedToken = await getToken();
        if (savedToken) {
          setToken(savedToken);
        }
      } catch (error) {
        console.error("Failed to restore session:", error);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function login(email: string, password: string) {
    const res = await api.login(email, password);
    await saveToken(res.token);
    setToken(res.token);
    setUser(res.user);
  }

  async function register(email: string, password: string) {
    const res = await api.register(email, password);
    await saveToken(res.token);
    setToken(res.token);
    setUser(res.user);
  }

  async function logout() {
    await removeToken();
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
