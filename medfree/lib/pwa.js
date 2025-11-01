// PWA utilities for service worker registration and install prompt

export function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("✅ Service Worker registered:", registration.scope);

          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            newWorker?.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New service worker available
                console.log("🔄 New version available! Refresh to update.");
                showUpdateNotification();
              }
            });
          });
        })
        .catch((error) => {
          console.error("❌ Service Worker registration failed:", error);
        });
    });
  }
}

export function unregisterServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
      });
    });
  }
}

// Check if app is running as PWA
export function isPWA() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

// PWA Install Prompt
let deferredPrompt = null;

export function initInstallPrompt() {
  if (typeof window === "undefined") return;

  window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    console.log("💡 Install prompt available");

    // Show custom install UI
    showInstallBanner();
  });

  window.addEventListener("appinstalled", () => {
    console.log("✅ PWA installed successfully");
    deferredPrompt = null;
    hideInstallBanner();

    // Track installation
    if (typeof window.gtag === "function") {
      window.gtag("event", "pwa_installed", {
        event_category: "engagement",
      });
    }
  });
}

export async function promptInstall() {
  if (!deferredPrompt) {
    console.log("⚠️ Install prompt not available");
    return false;
  }

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response to install prompt: ${outcome}`);

  // Clear the deferredPrompt
  deferredPrompt = null;

  return outcome === "accepted";
}

export function canInstall() {
  return deferredPrompt !== null;
}

// Show custom install banner
function showInstallBanner() {
  const banner = document.getElementById("pwa-install-banner");
  if (banner) {
    banner.classList.remove("hidden");
  }
}

function hideInstallBanner() {
  const banner = document.getElementById("pwa-install-banner");
  if (banner) {
    banner.classList.add("hidden");
  }
}

// Show update notification
function showUpdateNotification() {
  if (Notification.permission === "granted") {
    new Notification("Update Available", {
      body: "A new version of MedFree is available. Refresh to update.",
      icon: "/icon-192x192.png",
      badge: "/icon-192x192.png",
      tag: "app-update",
    });
  }
}

// Offline/Online detection
export function initNetworkListener(onStatusChange) {
  if (typeof window === "undefined") return;

  const updateOnlineStatus = () => {
    const isOnline = navigator.onLine;
    console.log(isOnline ? "🌐 Online" : "📴 Offline");
    if (onStatusChange) {
      onStatusChange(isOnline);
    }
  };

  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);

  // Return cleanup function
  return () => {
    window.removeEventListener("online", updateOnlineStatus);
    window.removeEventListener("offline", updateOnlineStatus);
  };
}

// Cache service for offline viewing
export async function cacheServiceForOffline(service) {
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "CACHE_SERVICE",
      service,
    });
  }
}

// IndexedDB helpers for offline data
export async function openOfflineDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("medfree-offline", 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("pendingActions")) {
        db.createObjectStore("pendingActions", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
      if (!db.objectStoreNames.contains("cachedServices")) {
        db.createObjectStore("cachedServices", { keyPath: "_id" });
      }
    };
  });
}

export async function getCachedServices() {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["cachedServices"], "readonly");
      const store = transaction.objectStore("cachedServices");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Failed to get cached services:", error);
    return [];
  }
}

export async function savePendingAction(action) {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["pendingActions"], "readwrite");
      const store = transaction.objectStore("pendingActions");
      const request = store.add(action);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Failed to save pending action:", error);
    throw error;
  }
}
