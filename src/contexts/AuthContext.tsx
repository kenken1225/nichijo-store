"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

// Customer information type
export type CustomerInfo = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  customer: CustomerInfo | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshCustomer: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/account/customer");

      if (res.ok) {
        const data = await res.json();
        setCustomer(data.customer);
        setIsLoggedIn(true);
      } else {
        setCustomer(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Check auth error:", error);
      setCustomer(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update customer information
  const refreshCustomer = useCallback(async () => {
    if (!isLoggedIn) return;

    try {
      const res = await fetch("/api/account/customer");
      if (res.ok) {
        const data = await res.json();
        setCustomer(data.customer);
      }
    } catch (error) {
      console.error("Refresh customer error:", error);
    }
  }, [isLoggedIn]);

  // Login
  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/account/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          return { success: false, error: data.error || "Login failed" };
        }

        // After successful login, get customer information
        await checkAuth();
        return { success: true };
      } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: "Login processing error" };
      }
    },
    [checkAuth]
  );

  // Logout
  const logout = useCallback(async () => {
    try {
      await fetch("/api/account/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setCustomer(null);
      setIsLoggedIn(false);
    }
  }, []);

  // Check authentication status on initial mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        customer,
        login,
        logout,
        checkAuth,
        refreshCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
