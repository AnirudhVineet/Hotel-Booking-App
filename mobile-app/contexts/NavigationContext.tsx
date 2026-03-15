import React, { createContext, useContext, useRef, useCallback, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

interface NavigationContextType {
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextType>({ goBack: () => {} });

export function useSmartBack() {
  return useContext(NavigationContext);
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const historyRef = useRef<string[]>([]);

  // Track navigation history, skip consecutive duplicates
  useEffect(() => {
    if (!pathname) return;

    const history = historyRef.current;
    const lastEntry = history.length > 0 ? history[history.length - 1] : null;

    // Only push if it's different from the last entry (deduplication)
    if (lastEntry !== pathname) {
      history.push(pathname);
    }
  }, [pathname]);

  const goBack = useCallback(() => {
    const history = historyRef.current;

    // Remove current page from history
    if (history.length > 0) {
      history.pop();
    }

    // Skip any entries that match the current page (extra safety)
    while (history.length > 0 && history[history.length - 1] === pathname) {
      history.pop();
    }

    if (history.length > 0) {
      const destination = history[history.length - 1];
      // Don't pop the destination — it stays as the current top of the stack
      router.replace(destination as any);
    } else {
      // Nothing left in history — go to home (onboarding)
      router.replace('/' as any);
    }
  }, [pathname, router]);

  // Override Android hardware back button globally
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      const history = historyRef.current;

      // If we're on the home/onboarding page and there's no meaningful history, let the app exit
      if (pathname === '/' && history.length <= 1) {
        return false; // Let default behavior (exit app) happen
      }

      goBack();
      return true; // Prevent default back behavior
    });

    return () => handler.remove();
  }, [pathname, goBack]);

  return (
    <NavigationContext.Provider value={{ goBack }}>
      {children}
    </NavigationContext.Provider>
  );
}
