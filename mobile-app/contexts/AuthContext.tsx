/**
 * ─── AUTH CONTEXT ───────────────────────────────────────────────────
 * 
 * Stores the logged-in user's information (name, email) across the app.
 * This context is updated on login/register and persisted via AsyncStorage.
 * 
 * Usage:
 *   const { user, setUser, logout } = useAuth();
 *   <Text>{user?.name}</Text>
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Shape of user data we store
export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: async () => {},
  isLoggedIn: false,
});

const USER_KEY = 'dawatime_user_info';
const TOKEN_KEY = 'dawatime_auth_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);

  // Load saved user info when the app starts
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(USER_KEY);
        if (saved) {
          setUserState(JSON.parse(saved));
        }
      } catch {
        // Silently fail — user will just see default name
      }
    })();
  }, []);

  // Save user info whenever it changes
  const setUser = (newUser: AuthUser | null) => {
    setUserState(newUser);
    if (newUser) {
      AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser)).catch(() => {});
    } else {
      AsyncStorage.removeItem(USER_KEY).catch(() => {});
    }
  };

  // Logout: clear both user info and token
  const logout = async () => {
    setUserState(null);
    await AsyncStorage.multiRemove([USER_KEY, TOKEN_KEY]).catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
