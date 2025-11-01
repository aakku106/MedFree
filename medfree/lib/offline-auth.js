/**
 * Offline Authentication Utilities
 *
 * Provides fallback authentication when Clerk is unavailable (offline mode).
 * Caches user data in localStorage for offline access.
 */

const USER_CACHE_KEY = "medfree_user_cache";
const AUTH_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Cache user data for offline access
 * Call this after successful Clerk authentication
 */
export function cacheUserData(userData) {
  if (typeof window === "undefined") return;

  try {
    const cacheData = {
      userId: userData.userId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      imageUrl: userData.imageUrl,
      timestamp: Date.now(),
    };

    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(cacheData));
    console.log("✅ User data cached for offline access");
  } catch (error) {
    console.error("Failed to cache user data:", error);
  }
}

/**
 * Get cached user data when offline
 * Returns null if cache is expired or not found
 */
export function getCachedUserData() {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(USER_CACHE_KEY);
    if (!cached) return null;

    const data = JSON.parse(cached);

    // Check if cache is expired
    if (Date.now() - data.timestamp > AUTH_CACHE_DURATION) {
      localStorage.removeItem(USER_CACHE_KEY);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Failed to get cached user data:", error);
    return null;
  }
}

/**
 * Clear user cache (call on sign out)
 */
export function clearUserCache() {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(USER_CACHE_KEY);
    console.log("✅ User cache cleared");
  } catch (error) {
    console.error("Failed to clear user cache:", error);
  }
}

/**
 * Check if user is authenticated (online or offline)
 * Returns cached data if offline, or indicates to check Clerk if online
 */
export function getOfflineAuth() {
  if (typeof window === "undefined") return { isOffline: false, user: null };

  const isOffline = !navigator.onLine;

  if (isOffline) {
    const cachedUser = getCachedUserData();
    return {
      isOffline: true,
      user: cachedUser,
      isAuthenticated: !!cachedUser,
    };
  }

  return {
    isOffline: false,
    user: null,
    isAuthenticated: null, // Check Clerk
  };
}

/**
 * Sync user data with cache after Clerk authentication
 * Call this in layout or profile pages
 */
export function syncUserCache(clerkUser) {
  if (!clerkUser) return;

  const userData = {
    userId: clerkUser.id,
    email: clerkUser.emailAddresses?.[0]?.emailAddress,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    imageUrl: clerkUser.imageUrl,
  };

  cacheUserData(userData);
}
