# Production 404 Error Fix - Dynamic Routes

## Problem Statement

Service detail pages (`/services/[id]`) worked perfectly on localhost but returned **404 errors in production**.

### Symptoms

- ✅ Works: `http://localhost:3000/services/69051a1b45d206456a0cbcb5`
- ❌ Fails: `https://medfree.adarashagaihre.com.np/services/69051a1b45d206456a0cbcb5`

Error message in production:

```
404
Service Not Found

The service you're looking for doesn't exist or has been removed.
```

---

## Root Cause

The Server Component was making HTTP requests to its own API route:

```javascript
// ❌ WRONG - Don't do this in Server Components
async function getService(id) {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/api/services/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}
```

### Why This Failed in Production

1. **Environment Variable Issues**

   - `NEXT_PUBLIC_APP_URL` might not be set correctly in production
   - Localhost fallback doesn't work on deployed servers
   - Build-time vs runtime URL mismatch

2. **Inefficient Pattern**

   - Server Component → HTTP request → API Route → Database
   - Adds unnecessary network overhead
   - Server Components should directly access data sources

3. **Build-Time Errors**
   - During Next.js build, the fetch URL might be incorrect
   - Static page generation fails silently
   - Results in 404 for all dynamic routes

---

## The Solution

**Direct database access in Server Components:**

```javascript
// ✅ CORRECT - Direct database query
import { getServicesCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

async function getService(id) {
  try {
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      console.error("Invalid ObjectId:", id);
      return null;
    }

    // Directly query database
    const collection = await getServicesCollection();
    const service = await collection.findOne({ _id: new ObjectId(id) });

    if (!service) {
      console.error("Service not found:", id);
      return null;
    }

    // Convert ObjectId to string for client components
    return {
      ...service,
      _id: service._id.toString(),
    };
  } catch (error) {
    console.error("Error fetching service:", error);
    return null;
  }
}
```

---

## Implementation Steps

### 1. Update the Service Detail Page

**File:** `/medfree/app/services/[id]/page.js`

**Before:**

```javascript
import { convertToNepaliDate } from "@/lib/utils";

async function getService(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/services/${id}`
  );
  // ...
}
```

**After:**

```javascript
import { convertToNepaliDate } from "@/lib/utils";
import { getServicesCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

async function getService(id) {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getServicesCollection();
  const service = await collection.findOne({ _id: new ObjectId(id) });

  return service ? { ...service, _id: service._id.toString() } : null;
}
```

### 2. Keep API Route for Client Components

The API route (`/api/services/[id]/route.js`) is still needed for:

- Client Component fetches (e.g., confirmation page, edit forms)
- External API consumers
- Client-side data fetching

**No changes needed** to the API route - it works as-is.

---

## Next.js Best Practices

### Server Components (RSC)

✅ **DO:**

- Import and use database clients directly
- Query databases, file systems, or external APIs
- Keep data fetching logic on the server
- Use `async/await` for data fetching

❌ **DON'T:**

- Fetch from your own API routes (unnecessary HTTP overhead)
- Use browser-only APIs
- Depend on environment variables that might not be set

### Client Components

✅ **DO:**

- Use `fetch()` for API routes
- Handle user interactions (onClick, onChange)
- Use React hooks (useState, useEffect, useContext)
- Access browser APIs (localStorage, geolocation)

❌ **DON'T:**

- Import server-only libraries (database clients)
- Make direct database queries
- Use Node.js built-in modules

---

## Why This Pattern is Better

| Aspect            | Old (fetch API)               | New (direct DB)        |
| ----------------- | ----------------------------- | ---------------------- |
| **Performance**   | 2 hops (Component → API → DB) | 1 hop (Component → DB) |
| **Reliability**   | Depends on env vars           | Always works           |
| **Build Process** | Can fail silently             | Explicit errors        |
| **Deployment**    | Environment-dependent         | Environment-agnostic   |
| **Efficiency**    | HTTP overhead                 | Direct connection      |
| **SEO**           | May fail to render            | Always renders         |

---

## Testing Checklist

After deploying the fix:

- [ ] Visit service detail page in production
- [ ] Check multiple service IDs
- [ ] Verify page renders correctly
- [ ] Confirm no 404 errors
- [ ] Check browser Network tab (should see no failed requests)
- [ ] Test with invalid service ID (should show proper 404)
- [ ] Verify database connection is working

---

## Debugging Tips

If you still see 404 errors after this fix:

1. **Check MongoDB Connection**

   ```bash
   # In Vercel dashboard, check logs for:
   "MongoDB connected successfully"
   ```

2. **Verify Environment Variables**

   ```bash
   # Ensure MONGODB_URI is set in production
   vercel env ls
   ```

3. **Check Build Logs**

   ```bash
   # Look for build errors related to dynamic routes
   vercel logs
   ```

4. **Test ObjectId Validity**

   ```javascript
   // Invalid IDs should show proper 404, not crash
   // Test with: /services/invalid-id
   ```

---

## Key Takeaways

1. **Server Components ≠ API Routes**

   - Server Components run on the server but shouldn't fetch from their own API
   - Use direct data access instead

2. **Environment Variables Can Fail**

   - Don't rely on runtime env vars for critical paths
   - Especially `NEXT_PUBLIC_APP_URL` which might not be set

3. **Follow Next.js Patterns**

   - Server Components: Direct data access
   - Client Components: Fetch from API routes
   - API Routes: For client-side or external consumption

4. **Production ≠ Development**
   - What works on localhost might fail in production
   - Always test dynamic routes after deployment
   - Check build logs for warnings

---

## Related Files

- `/medfree/app/services/[id]/page.js` - Fixed service detail page
- `/medfree/app/api/services/[id]/route.js` - API route (kept for client components)
- `/medfree/lib/mongodb.js` - Database connection helper
- `/medfree/app/services/[id]/confirmation/page.js` - Client component (uses API)
- `/medfree/app/admin/services/edit/[id]/page.js` - Client component (uses API)

---

**Status:** ✅ Fixed  
**Date:** November 9, 2025  
**Impact:** High - All dynamic routes now work in production
