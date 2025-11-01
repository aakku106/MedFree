// Notification utility functions

/**
 * Check if notifications are supported
 */
export function isNotificationSupported() {
  return (
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission() {
  if (!isNotificationSupported()) {
    return "unsupported";
  }
  return Notification.permission;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission() {
  if (!isNotificationSupported()) {
    throw new Error("Notifications are not supported in this browser");
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Register service worker
 */
export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service Workers are not supported");
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });

    console.log("Service Worker registered:", registration);
    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
    throw error;
  }
}

/**
 * Get push subscription
 */
export async function getPushSubscription(registration) {
  try {
    const subscription = await registration.pushManager.getSubscription();
    return subscription;
  } catch (error) {
    console.error("Failed to get push subscription:", error);
    throw error;
  }
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPush(registration, vapidPublicKey) {
  try {
    // Validate the key before attempting subscription
    if (!vapidPublicKey || vapidPublicKey === 'your_public_key') {
      throw new Error("Invalid VAPID public key. Please run: npx web-push generate-vapid-keys and update your .env file");
    }

    // Check if the key looks like a valid base64 string
    if (vapidPublicKey.length < 80) {
      throw new Error("VAPID public key appears to be invalid (too short). It should be an 88-character base64 string.");
    }

    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    return subscription;
  } catch (error) {
    console.error("Failed to subscribe to push notifications:", error);
    
    // Provide more helpful error messages
    if (error.name === 'InvalidAccessError') {
      throw new Error("Invalid VAPID key format. Please verify your NEXT_PUBLIC_VAPID_PUBLIC_KEY in .env is a valid P-256 public key from: npx web-push generate-vapid-keys");
    }
    
    throw error;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush(subscription) {
  try {
    await subscription.unsubscribe();
    console.log("Unsubscribed from push notifications");
  } catch (error) {
    console.error("Failed to unsubscribe:", error);
    throw error;
  }
}

/**
 * Save subscription to server
 */
export async function saveSubscriptionToServer(subscription, userId) {
  try {
    const response = await fetch("/api/notifications/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscription,
        userId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save subscription to server");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to save subscription:", error);
    throw error;
  }
}

/**
 * Remove subscription from server
 */
export async function removeSubscriptionFromServer(subscription) {
  try {
    const response = await fetch("/api/notifications/unsubscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to remove subscription from server");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to remove subscription:", error);
    throw error;
  }
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(preferences) {
  try {
    const response = await fetch("/api/notifications/preferences", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      throw new Error("Failed to update preferences");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to update preferences:", error);
    throw error;
  }
}

/**
 * Get notification preferences
 */
export async function getNotificationPreferences() {
  try {
    const response = await fetch("/api/notifications/preferences");

    if (!response.ok) {
      throw new Error("Failed to get preferences");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to get preferences:", error);
    throw error;
  }
}

/**
 * Convert base64 VAPID key to Uint8Array
 */
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Show local notification (for testing)
 */
export async function showLocalNotification(title, options = {}) {
  if (!isNotificationSupported()) {
    throw new Error("Notifications are not supported");
  }

  if (Notification.permission !== "granted") {
    throw new Error("Notification permission not granted");
  }

  const registration = await navigator.serviceWorker.ready;
  await registration.showNotification(title, {
    body: options.body || "",
    icon: options.icon || "/icon-192x192.png",
    badge: "/badge-72x72.png",
    vibrate: [200, 100, 200],
    data: options.data || {},
    ...options,
  });
}
