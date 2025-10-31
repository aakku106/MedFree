---
mode: agent
---

# Phase 2 Requirements: Enhanced Features & User Engagement

This document continues from Instruction1.prompt.md (FR001-FR020, NFR001-NFR006). All previous requirements are assumed complete.

## Functional Requirements (Phase 2)

| Requirement ID | Description                             | User Story                                                                                                          | Expected Behavior/Outcome                                                                                                                                                                                                                                                                                    |
| -------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| FR021          | Admin Dashboard: Authentication & Roles | As a health agent, I want secure access to an admin panel so I can manage services without affecting regular users. | Create protected `/admin` route with Clerk role-based authentication. Only users with `role: "agent"` or `role: "admin"` in Clerk metadata can access. Redirect unauthorized users to home with error message.                                                                                               |
| FR022          | Admin Dashboard: Service List View      | As an agent, I want to see all services I manage so I can quickly find what needs updating.                         | Display a table/grid of all services with columns: title, category, date, status (active/inactive), registrations count. Include search/filter by category and date range. Show "Create New Service" button prominently.                                                                                     |
| FR023          | Admin Dashboard: Create Service         | As an agent, I want to create new service listings so I can announce upcoming health camps.                         | Provide a multi-step form with validation: 1) Basic Info (title, category, diagnosis type, description), 2) Location (address, city, district, map picker for coordinates), 3) Schedule (date, time start/end, capacity), 4) Contact (person, phone, email). Save to database and show success confirmation. |
| FR024          | Admin Dashboard: Edit Service           | As an agent, I want to edit existing services so I can correct mistakes or update details.                          | Clicking "Edit" on any service loads the same form as Create but pre-filled. Allow changing all fields except creation timestamp. Show "Last updated" timestamp. Validate and save changes with confirmation message.                                                                                        |
| FR025          | Admin Dashboard: Delete/Deactivate      | As an agent, I want to remove or deactivate past services so the list stays current.                                | Provide "Deactivate" (soft delete) and "Delete Permanently" options. Deactivated services don't show to users but remain in admin for records. Confirm action with modal. Log deletion with timestamp and admin user ID.                                                                                     |
| FR026          | Admin Dashboard: Analytics Overview     | As an agent, I want to see usage statistics so I understand which services are popular.                             | Dashboard home shows: total services, total registrations this month, most popular category, average capacity utilization. Include line chart of registrations over time and bar chart of services by category.                                                                                              |
| FR027          | Admin Dashboard: Image Upload           | As an agent, I want to add photos to services so users can see the health post or team.                             | Allow uploading 1-3 images per service. Integrate with Cloudinary or Vercel Blob. Show thumbnail preview. Validate file type (jpg, png, webp) and size (<5MB). Display images on service detail page in a gallery.                                                                                           |
| FR028          | Service Registration: User Flow         | As a user, I want to register for a service so I can secure my spot and get reminders.                              | On `/services/[id]`, show "Register for this Service" button (requires Clerk login). Click opens modal with form: confirm name, phone, any family members. Show remaining capacity (e.g., "23/100 spots left"). Upon submission, decrement capacity and show success with confirmation message.              |
| FR029          | Service Registration: Capacity Tracking | As a user, I want to see if a service is full so I don't waste time registering.                                    | Display capacity badge on service cards ("12 spots left", "Full", "Waitlist available"). Update in real-time when users register. If full, show "Join Waitlist" option instead of "Register". Prevent registration when at capacity.                                                                         |
| FR030          | Service Registration: Confirmation      | As a registered user, I want confirmation so I know my registration succeeded.                                      | After successful registration, show confirmation modal with: QR code (unique registration ID), service details, reminder to arrive on time. Store registration in `registrations` collection with user_id, service_id, timestamp, status.                                                                    |
| FR031          | Service Registration: User Dashboard    | As a registered user, I want to see my upcoming services so I can plan accordingly.                                 | Create `/profile/registrations` page showing: upcoming services (with countdown), past services (with attendance status). Allow cancellation of upcoming registrations (with confirmation). Show QR code for each active registration.                                                                       |
| FR032          | Push Notifications: Permission Request  | As a user, I want to opt-in to notifications so I don't miss relevant services.                                     | On first visit or in profile settings, show friendly modal explaining notification benefits. Request browser push permission using Web Push API. Store permission status and device subscription endpoint in user profile. Provide easy opt-out in settings.                                                 |
| FR033          | Push Notifications: Subscription Prefs  | As a user, I want to choose what I get notified about so I'm not spammed.                                           | In `/profile/notifications`, allow users to: select categories of interest, set location radius (within 5/10/25 km), choose frequency (instant/daily digest), toggle notification types (new services, reminders, cancellations). Save preferences to `subscriptions` collection.                            |
| FR034          | Push Notifications: New Service Alert   | As a subscribed user, I want notifications when relevant services are posted so I can register early.               | When admin creates a service, background job matches against user subscriptions (location + category). Send browser push notification with: service title, date, location, "Register Now" action. Track notification delivery and click-through rate.                                                        |
| FR035          | Push Notifications: Reminder            | As a registered user, I want a reminder before my service so I don't forget.                                        | 24 hours before service start time, send push notification to all registered users: "Reminder: [Service Name] tomorrow at [Time]". Include location and "View Details" action. Mark reminder as sent to avoid duplicates.                                                                                    |
| FR036          | User Profile: Saved Services            | As a user, I want to bookmark services for later so I can decide without pressure.                                  | Add "Save" icon (heart/bookmark) to service cards and detail pages. Click toggles saved state (requires login). Create `/profile/saved` page showing all saved services with option to remove or register. Store in user document as array of service IDs.                                                   |
| FR037          | User Profile: Settings & Preferences    | As a user, I want to customize my experience so the app works better for me.                                        | Create `/profile/settings` with: notification preferences, preferred categories, location (city/district), language (Nepali/English - future), account info (name, phone, email). Integrate with Clerk user metadata. Show "Delete Account" option with confirmation.                                        |
| FR038          | Offline Support: Service Worker         | As a user in rural areas, I want the app to work offline so poor connectivity doesn't block me.                     | Implement Service Worker with Workbox. Cache: static assets (CSS, JS, fonts), API responses (services list, detail pages), images. Use stale-while-revalidate strategy. Show offline indicator banner when network is unavailable.                                                                           |
| FR039          | Offline Support: Cached Services        | As a user, I want to read saved service details offline so I can review them anywhere.                              | When user views a service detail page, cache the full data in IndexedDB. Allow access to cached services via `/profile/saved` even when offline. Show "Cached for offline" badge. Sync changes (registrations, unsave) when back online using Background Sync API.                                           |
| FR040          | PWA: Install Prompt                     | As a mobile user, I want to install the app so it feels like a native app.                                          | Configure `manifest.json` with app name, icons (192x192, 512x512), theme color, display mode (standalone). Show custom install prompt after user visits 2-3 times. Add "Install App" button in navbar/settings. Support iOS Add to Home Screen with meta tags.                                               |
| FR041          | PWA: Offline Page                       | As a user, I want a helpful offline page so I understand what's happening.                                          | Create custom offline fallback page showing: "You're offline" message, cached services count, tips for reconnecting, illustration/icon. Service Worker serves this when no cached response available and network fails.                                                                                      |
| FR042          | Testing: Unit Tests                     | As a developer, I want unit tests so I catch bugs early and refactor confidently.                                   | Set up Vitest or Jest. Write tests for: utility functions (distance calculation, date conversion), API route handlers, MongoDB queries. Achieve 70%+ code coverage for critical paths. Run tests in CI/CD pipeline before deployment.                                                                        |
| FR043          | Testing: E2E Tests                      | As a developer, I want end-to-end tests so I ensure user flows work correctly.                                      | Set up Playwright. Write E2E tests for: landing → services → detail flow, registration flow (happy path + full capacity), admin CRUD operations, filter/search combinations, offline functionality. Run in headless mode in CI. Generate test reports with screenshots.                                      |
| FR044          | Testing: Accessibility Tests            | As a developer, I want automated accessibility checks so I maintain WCAG compliance.                                | Integrate axe-core with Playwright tests. Run accessibility audits on: landing page, services listing, service detail, admin dashboard. Fix critical and serious issues (A11Y violations). Generate accessibility report. Ensure keyboard navigation and screen reader compatibility.                        |
| FR045          | Testing: Load/Performance Tests         | As a developer, I want to test under load so the app scales well.                                                   | Use k6 or Artillery to simulate: 100 concurrent users browsing services, 50 users registering simultaneously, geospatial queries with various locations. Measure: API response times (<200ms p95), database query performance, error rates. Optimize slow queries and add caching where needed.              |

## Non-Functional Requirements (Phase 2)

| Requirement ID | Description                      | User Story                                                                             | Expected Behavior/Outcome                                                                                                                                                                                                                                      |
| -------------- | -------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR007         | Admin Dashboard Performance      | As an agent, I want fast admin pages so I can update services efficiently.             | Admin pages load in <1 second. Use React Server Components where possible. Implement optimistic UI updates for edits. Pagination for service lists (25 per page). Lazy load analytics charts. Cache frequently accessed data.                                  |
| NFR008         | Push Notification Delivery       | As the system, I want reliable notification delivery so users stay informed.           | Target 95%+ delivery success rate. Implement retry logic for failed sends. Queue notifications with background job (BullMQ/Agenda). Handle permission denial gracefully. Log delivery metrics for monitoring.                                                  |
| NFR009         | Registration Concurrency         | As the system, I want to handle simultaneous registrations so capacity stays accurate. | Use MongoDB transactions or optimistic locking to prevent race conditions. When capacity reached, subsequent registrations should fail gracefully with "Service is now full" message. Implement FIFO queue for waitlist.                                       |
| NFR010         | Offline Data Freshness           | As a user, I want recent data offline so I'm not misled by stale information.          | Cache services for 24 hours max. Show "Last updated" timestamp on cached content. Prompt to refresh when back online if cache is >6 hours old. Clear cache on logout.                                                                                          |
| NFR011         | PWA Asset Optimization           | As a mobile user, I want fast installs and minimal storage use.                        | Total PWA install size <5MB. Use WebP images with lazy loading. Compress assets with gzip/brotli. Implement aggressive cache expiration for unused data. Provide "Clear Cache" option in settings.                                                             |
| NFR012         | Test Coverage & Quality          | As a team, we want high code quality so bugs are rare and fixes are easy.              | Maintain 70%+ test coverage for business logic. All critical user flows have E2E tests. No P0 accessibility violations. API endpoints have integration tests. Automated tests run on every commit.                                                             |
| NFR013         | Admin Dashboard Security         | As an admin, I want role-based access so unauthorized users can't modify data.         | Enforce role checks at API level (not just UI). Validate all inputs server-side. Rate limit admin endpoints. Log all admin actions (create, edit, delete) with user ID and timestamp. Implement CSRF protection.                                               |
| NFR014         | Notification Privacy             | As a user, I want control over my notification data so my privacy is respected.        | Don't store precise location in subscriptions, only city/district. Allow full opt-out with data deletion. Notifications don't contain sensitive health info (use generic "New service available"). Comply with push notification best practices.               |
| NFR015         | Performance Budget               | As a user, I want the app to stay fast as it grows.                                    | Lighthouse Performance score >90. Time to Interactive <3 seconds on 3G. Total blocking time <300ms. Largest Contentful Paint <2.5s. Monitor Core Web Vitals in production and alert on regressions.                                                            |
| NFR016         | Error Monitoring & Observability | As a developer, I want to detect and fix issues quickly.                               | Integrate Sentry or similar for error tracking. Track: unhandled exceptions, failed API calls, slow queries. Set up alerts for error rate spikes. Include user context (non-PII) in error reports. Create dashboard for key metrics (registrations, searches). |

## Implementation Notes

### Priority Order

1. **Admin Dashboard (FR021-FR027)** - 3 weeks  
   _Blockers:_ None. Essential for content management.

2. **Service Registration (FR028-FR031)** - 2-3 weeks  
   _Blockers:_ None. High user value.

3. **Push Notifications (FR032-FR035)** - 2 weeks  
   _Blockers:_ Service Worker setup. Browser-only (no SMS/email in Phase 2).

4. **User Profile & Saved (FR036-FR037)** - 1 week  
   _Blockers:_ None. Enhances engagement.

5. **PWA & Offline (FR038-FR041)** - 1-2 weeks  
   _Blockers:_ Service Worker must be implemented first.

6. **Testing Suite (FR042-FR045)** - 2-3 weeks (parallel)  
   _Blockers:_ Can be done alongside other features.

### Technical Stack Additions

- **Admin UI:** Shadcn/ui or Radix UI components
- **Forms:** React Hook Form + Zod validation
- **Rich Text:** TipTap or Lexical editor
- **Image Upload:** Cloudinary or Vercel Blob
- **Push Notifications:** Web Push API + OneSignal (optional)
- **Service Worker:** Workbox (via Next.js PWA plugin)
- **Offline Storage:** IndexedDB (via idb library)
- **Background Jobs:** Vercel Cron or BullMQ (if separate server)
- **Testing:** Vitest/Jest + Playwright + axe-core
- **Monitoring:** Sentry + Vercel Analytics

### Database Schema Updates

#### New Collections

**registrations:**

```javascript
{
  _id: ObjectId,
  serviceId: ObjectId,
  userId: String,              // Clerk user ID
  userName: String,
  userPhone: String,
  registrationCode: String,    // QR code data
  familyMembers: Array<String>,
  status: String,              // 'confirmed', 'cancelled', 'attended', 'no-show'
  registeredAt: Date,
  cancelledAt: Date,           // if applicable
  attendedAt: Date,            // if applicable
  notificationsSent: {
    confirmation: Boolean,
    reminder: Boolean
  }
}
```

**subscriptions:**

```javascript
{
  _id: ObjectId,
  userId: String,              // Clerk user ID
  pushEndpoint: String,        // Web Push subscription endpoint
  categories: Array<String>,   // interested categories
  location: {
    city: String,
    district: String,
    radius: Number             // km
  },
  frequency: String,           // 'instant', 'daily', 'weekly'
  enabled: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Updated Collections

**services:** Add fields:

```javascript
{
  // ... existing fields
  images: Array<String>,       // Cloudinary URLs
  registeredCount: Number,     // cached count
  isActive: Boolean,           // soft delete
  createdBy: String,           // Clerk user ID of admin
  updatedBy: String,
  updatedAt: Date
}
```

**users:** (if storing separate from Clerk)

```javascript
{
  _id: ObjectId,
  clerkId: String,             // link to Clerk
  savedServices: Array<ObjectId>,
  preferences: {
    categories: Array<String>,
    location: String,
    language: String           // 'en', 'ne' (future)
  }
}
```

### API Endpoints to Add

- `POST /api/admin/services` - Create service (authenticated)
- `PUT /api/admin/services/[id]` - Update service (authenticated)
- `DELETE /api/admin/services/[id]` - Delete service (authenticated)
- `POST /api/services/[id]/register` - Register for service
- `DELETE /api/services/[id]/register` - Cancel registration
- `GET /api/profile/registrations` - User's registrations
- `POST /api/profile/saved` - Save/unsave service
- `GET /api/profile/saved` - Get saved services
- `POST /api/notifications/subscribe` - Subscribe to push
- `PUT /api/notifications/preferences` - Update prefs
- `POST /api/admin/analytics` - Get admin dashboard stats

### Clerk Role Setup

In Clerk Dashboard:

1. Add custom metadata field: `role` (string)
2. Possible values: `"user"` (default), `"agent"`, `"admin"`
3. Middleware checks role for `/admin/*` routes

### Security Considerations

- All admin endpoints require authentication + role check
- Rate limiting on registration endpoints (max 5 per minute per user)
- Input validation with Zod schemas
- Sanitize user-generated content (service descriptions, reviews)
- HTTPS only for push notifications
- No sensitive data in push notification payload
- Implement CSRF tokens for state-changing operations

### Performance Targets

- Admin page load: <1s
- Registration submission: <500ms
- Push notification delivery: <5s from trigger
- Offline service access: instant (from cache)
- PWA install size: <5MB
- API response times: p95 <200ms
- Test suite execution: <5 minutes total

### Success Metrics

After Phase 2 implementation:

- 80%+ services added via admin dashboard (not manual DB)
- 40%+ users register for at least one service
- 50%+ users enable push notifications
- 30%+ users install PWA
- <1% error rate on registrations
- 95%+ notification delivery success
- 70%+ test coverage achieved
- All WCAG A and AA violations resolved

---

**Phase 2 Status:** 📋 Ready for Implementation  
**Estimated Timeline:** 8-10 weeks with 1-2 developers  
**Dependencies:** Phase 1 (FR001-FR020) must be complete

Built to scale healthcare access in Nepal 🇳🇵❤️
