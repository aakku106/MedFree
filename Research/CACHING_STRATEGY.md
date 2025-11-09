# Caching Strategy - LocalStorage Implementation

## Overview

The `/services` page now uses **localStorage** to cache service data, eliminating unnecessary API calls and providing instant page loads.

---

## How It Works

### 1. **Cache Storage Location**

- **localStorage** (persists across browser sessions & reloads)
- Cache key: `medfree_services_cache`
- Duration: **5 minutes**

### 2. **Cache Structure**

```json
{
  "data": {
    "services": [...],
    "total": 42,
    "hasMore": true,
    "page": 1
  },
  "timestamp": 1730476800000,
  "filters": {
    "category": "all",
    "diagnosis": "all",
    "search": ""
  },
  "version": "v1"
}
```

### 3. **Cache Flow**

```
User visits /services
    ↓
Check localStorage
    ↓
┌─────────────────┐
│ Cache exists?   │
└─────────────────┘
    ↓           ↓
   YES          NO
    ↓           ↓
Validate:       Fetch from API
- Not expired?      ↓
- Filters match?   Save to cache
- Version match?    ↓
    ↓              Display
   YES
    ↓
Restore instantly
(No API call!)
```

---

## Cache Invalidation

Cache is **automatically cleared** when:

1. ⏰ **5 minutes expire** - Ensures fresh data
2. 🔄 **Filters change** - Category, diagnosis, or search query changes (detected on user interaction)
3. 🆕 **Version mismatch** - When `CACHE_VERSION` is incremented in code
4. ❌ **Corrupted data** - If JSON parsing fails

**Important:** The cache restoration only happens **once on initial page load**. Navigating back from a service detail page will use the cached data instantly without making new API requests, as long as the cache is still valid (< 5 minutes old and filters haven't changed).

---

## Benefits

✅ **Instant Page Loads** - Navigation from detail page back to services is instant  
✅ **Reduced API Calls** - Saves bandwidth and server resources  
✅ **Persists Across Sessions** - Cache survives browser reloads and new tabs  
✅ **Smart Invalidation** - Fresh data when filters change  
✅ **Quota Management** - Handles localStorage full errors gracefully

---

## User Experience

### Before Caching:

```
/services → /services/[id] → Back button
   ↓            ↓                ↓
 Load         Load           Load again
 (1-2s)      (1-2s)          (1-2s) 😞
```

### After Caching:

```
/services → /services/[id] → Back button
   ↓            ↓                ↓
 Load         Load           Instant!
 (1-2s)      (1-2s)          (0ms) ✨
```

---

## Developer Tools

### Clear Cache Manually

Open browser console and run:

```javascript
window.clearMedfreeCache();
// Output: 🗑️ Medfree cache cleared!
```

### Check Cache Content

```javascript
const cache = localStorage.getItem("medfree_services_cache");
console.log(JSON.parse(cache));
```

### Console Logs

The app logs cache operations:

- `✅ Restored from localStorage cache` - Cache hit
- `💾 Saved to localStorage cache` - Cache saved
- `🔄 Cache expired or filters changed` - Cache miss
- `❌ Cache save failed` - Error occurred

---

## Technical Implementation

### Key Features

1. **useRef for Service Tracking**

   - `servicesRef.current` prevents infinite re-renders
   - `initialFiltersRef.current` tracks original URL filters
   - Removed problematic dependencies from useEffect arrays

2. **Cache Validation**

   - Timestamp check (5-minute expiry)
   - Filter comparison (category, diagnosis, search)
   - Version check (for cache invalidation)
   - **Only runs once on initial mount** - prevents re-fetching on navigation

3. **Filter Change Detection**

   - Separate useEffect monitors filter state changes
   - Compares current filters to initial filters
   - Only invalidates cache when user actually changes filters
   - Prevents false cache invalidation on navigation

4. **Quota Error Handling**

   - Catches `QuotaExceededError`
   - Clears old cache and retries
   - Graceful degradation (app works without cache)

5. **Skip Initial Fetch**

   - After cache restoration, skips API call
   - Uses `cacheChecked` ref to coordinate
   - Runs only once per page mount

---

## Configuration

To modify cache behavior, edit these constants in `/medfree/app/services/page.js`:

```javascript
const CACHE_KEY = "medfree_services_cache"; // Storage key
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHE_VERSION = "v1"; // Increment to clear all caches
```

---

## Future Enhancements

Potential improvements:

1. **IndexedDB Migration** - For larger datasets (supports 50MB+)
2. **Background Refresh** - Update cache in background after 4 minutes
3. **Service Worker** - Offline-first approach
4. **Partial Cache Updates** - Only fetch new services, merge with cache
5. **User Location Cache** - Cache geolocation for 1 hour

---

## Testing Checklist

- [ ] First visit - fetches and caches data
- [ ] Return from detail page - instant restore
- [ ] Change category filter - fetches fresh data
- [ ] Change diagnosis filter - fetches fresh data
- [ ] Search query - fetches fresh data
- [ ] Wait 5 minutes - cache expires, fetches fresh
- [ ] Reload page - uses cache if valid
- [ ] Open new tab - uses cache if valid
- [ ] Clear cache manually - next visit fetches fresh

---

## Performance Metrics

Expected improvements:

| Metric                    | Before          | After   | Improvement       |
| ------------------------- | --------------- | ------- | ----------------- |
| Back navigation load time | 1-2s            | ~0ms    | **100%**          |
| API calls per session     | ~5-10           | ~1-2    | **80% reduction** |
| Data usage                | Full each time  | Cached  | **Minimal**       |
| User experience           | Loading spinner | Instant | **Seamless**      |

---

Built with ❤️ for Medfree
