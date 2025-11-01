"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import {
  syncUserCache,
  getCachedUserData,
  clearUserCache,
} from "@/lib/offline-auth";

const OfflineAuthContext = createContext({
  user: null,
  isLoaded: false,
  isSignedIn: false,
  isOffline: false,
});

export function OfflineAuthProvider({ children }) {
  const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn } = useUser();
  const [offlineUser, setOfflineUser] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  // Sync Clerk user to cache when online
  useEffect(() => {
    if (clerkLoaded && clerkUser && navigator.onLine) {
      syncUserCache(clerkUser);
    }
  }, [clerkUser, clerkLoaded]);

  // Monitor online/offline status
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
      
      // Load cached user when going offline
      if (!navigator.onLine) {
        const cached = getCachedUserData();
        setOfflineUser(cached);
      } else {
        setOfflineUser(null);
      }
    };

    updateOnlineStatus();
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  // Determine final user state
  const finalUser = isOffline ? offlineUser : clerkUser;
  const finalIsSignedIn = isOffline
    ? !!offlineUser
    : isSignedIn;
  const finalIsLoaded = isOffline ? true : clerkLoaded;

  return (
    <OfflineAuthContext.Provider
      value={{
        user: finalUser,
        isLoaded: finalIsLoaded,
        isSignedIn: finalIsSignedIn,
        isOffline,
      }}
    >
      {children}
    </OfflineAuthContext.Provider>
  );
}

export function useOfflineAuth() {
  return useContext(OfflineAuthContext);
}
