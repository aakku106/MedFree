// Service Worker for MedFree PWA
const CACHE_NAME = "medfree-v1";
const OFFLINE_URL = "/offline";

// Assets to cache immediately
const PRECACHE_ASSETS = ["/", "/offline", "/services", "/manifest.json"];

// Install event - precache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Precaching assets");
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: Clearing old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip chrome extensions and cross-origin requests
  if (!url.origin.includes(self.location.origin)) {
    return;
  }

  // API requests - Network first, fallback to cache
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful API responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Return offline response for failed API calls
            return new Response(
              JSON.stringify({ error: "Offline", cached: false }),
              {
                status: 503,
                headers: { "Content-Type": "application/json" },
              }
            );
          });
        })
    );
    return;
  }

  // Static assets and pages - Stale While Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        // Cache the new version
        if (networkResponse.ok) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      });

      // Return cached response immediately, update in background
      return (
        cachedResponse ||
        fetchPromise.catch(() => {
          // If both cache and network fail, return offline page
          if (request.destination === "document") {
            return caches.match(OFFLINE_URL);
          }
        })
      );
    })
  );
});

// Background sync for offline registrations
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-registrations") {
    event.waitUntil(syncOfflineData());
  }
});

async function syncOfflineData() {
  try {
    // Get pending registrations from IndexedDB
    const db = await openDB();
    const pendingActions = await db.getAll("pendingActions");

    for (const action of pendingActions) {
      try {
        await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body,
        });
        // Remove from pending after successful sync
        await db.delete("pendingActions", action.id);
      } catch (error) {
        console.error("Failed to sync action:", error);
      }
    }
  } catch (error) {
    console.error("Background sync failed:", error);
  }
}

// IndexedDB helper
function openDB() {
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

// Message handler for manual cache updates
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CACHE_SERVICE") {
    event.waitUntil(
      openDB().then((db) => {
        const transaction = db.transaction(["cachedServices"], "readwrite");
        const store = transaction.objectStore("cachedServices");
        return store.put(event.data.service);
      })
    );
  }
});

console.log("Service Worker loaded successfully");
