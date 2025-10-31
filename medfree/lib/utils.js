/**
 * Convert AD date to Nepali BS date
 * Using nepali-date-converter library
 */
export function convertToNepaliDate(adDate) {
  try {
    // Will use nepali-date-converter when installed
    // For now, return a placeholder
    const date = new Date(adDate);
    return date.toLocaleDateString("ne-NP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error converting date:", error);
    return new Date(adDate).toLocaleDateString();
  }
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 */
export function formatDistance(km) {
  if (km < 1) {
    return `${Math.round(km * 1000)}m away`;
  }
  return `${km.toFixed(1)}km away`;
}

/**
 * Debounce function for search input
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Get user's geolocation
 * Returns a promise with {latitude, longitude} or null
 */
export function getUserLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.log("Location access denied or unavailable:", error);
        resolve(null);
      },
      {
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
        enableHighAccuracy: false,
      }
    );
  });
}
