# Push Notifications Setup Guide

This guide explains how to set up and configure push notifications for MedFree.

## Quick Start

### Option 1: Use the Setup Script (Recommended)

```bash
cd medfree
npm install web-push
node scripts/generate-vapid-keys.js
```

This will generate VAPID keys and show you exactly what to add to your `.env` file.

### Option 2: Manual Setup

## Prerequisites

- Node.js installed
- web-push package: `npm install web-push`

## Step 1: Generate VAPID Keys

VAPID (Voluntary Application Server Identification) keys are required for Web Push notifications.

```bash
cd medfree
npx web-push generate-vapid-keys
```

This will output:

```text
=======================================
Public Key:
BEl62iUYgUivxIkv69yViEuiBIa-Ib27SErSH3tQKvI...

Private Key:
p6YVD7dXidko55jwmGMv4k_PLSVaW_HQtvjAfVe...
=======================================
```

## Step 2: Add Keys to Environment Variables

Add these keys to your `.env` file:

```env
# Push Notifications (VAPID)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BEl62iUYgUivxIkv69yViEuiBIa-Ib27SErSH3tQKvI...
VAPID_PRIVATE_KEY=p6YVD7dXidko55jwmGMv4k_PLSVaW_HQtvjAfVe...
VAPID_EMAIL=admin@medfree.com
```

**Important:**

- The public key MUST be prefixed with `NEXT_PUBLIC_` (this makes it available to the browser)
- The private key should NEVER be exposed to the client (no NEXT*PUBLIC* prefix)
- Replace with your ACTUAL keys from the output above (not the placeholder text)
- The public key should be 88 characters long (base64 encoded P-256 key)
- Replace the email with your actual contact email

## Step 3: Restart Your Server

**Critical:** You MUST restart your development server after adding environment variables:

```bash
# Stop the server (Ctrl+C)
npm run dev
```

## Step 4: Test the Setup

1. Open your browser to `http://localhost:3000`

2. Sign in to the application

3. Navigate to `/profile/notifications`

4. Click "Enable Notifications"

5. Grant notification permission when prompted

6. You should see a test notification appear

## Step 4: Send Test Notification (Admin)

1. Sign in as an admin user

2. Go to `/admin/notifications`

3. Fill in the notification form:

   - Title: "Test Notification"
   - Message: "This is a test push notification"
   - Type: "Service Reminders"
   - Target: "All subscribed users"

4. Click "Send Notification"

5. Check that registered users receive the notification

## MongoDB Collections

Push notifications use the following collections:

### `subscriptions`

Stores user push subscriptions:

```javascript
{
  _id: ObjectId,
  userId: "user_xxx",
  endpoint: "https://fcm.googleapis.com/...",
  subscription: {
    endpoint: "https://fcm.googleapis.com/...",
    keys: {
      p256dh: "...",
      auth: "..."
    }
  },
  preferences: {
    serviceReminders: true,
    newServices: true,
    updates: true,
    marketing: false
  },
  createdAt: Date,
  updatedAt: Date
}
```

### `notificationLogs`

Tracks sent notifications:

```javascript
{
  _id: ObjectId,
  title: "Free Health Camp Tomorrow",
  body: "Your registered health service...",
  url: "/services/123",
  serviceId: "service_id",
  notificationType: "serviceReminders",
  targetUserIds: ["user_1", "user_2"],
  sentBy: "admin_user_id",
  sentAt: Date,
  successCount: 45,
  failCount: 2,
  totalRecipients: 47
}
```

## Browser Compatibility

Push notifications are supported in:

- ✅ Chrome 50+ (desktop & Android)
- ✅ Firefox 44+
- ✅ Edge 17+
- ✅ Opera 37+
- ✅ Samsung Internet 5+
- ❌ Safari (requires APNs setup - not included)
- ❌ iOS Safari (not supported)

## Troubleshooting

### ❌ "InvalidAccessError: applicationServerKey must contain a valid P-256 public key"

This error means the VAPID public key is invalid or not properly formatted.

**Solutions:**

1. **Generate Real Keys:** The placeholder values won't work. Run:
   ```bash
   npx web-push generate-vapid-keys
   ```

2. **Copy the FULL key:** Make sure you copied the entire base64 string (88 characters)
   - ✅ Correct: `BEl62iUYgUivxIkv69yViEuiBIa-Ib27SErSH3tQKvI_and_80_more_characters...`
   - ❌ Wrong: `your_public_key` or truncated key

3. **Check your .env file:**
   ```env
   # Make sure it looks like this (with REAL keys, not placeholders):
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=BEl62iUYgUivxIkv69yViEuiBIa...
   ```

4. **Restart the server:** Environment variables are only loaded at startup
   ```bash
   # Stop (Ctrl+C) and restart:
   npm run dev
   ```

5. **Verify the key is loading:** Add this to check in browser console:
   ```javascript
   console.log('VAPID Key:', process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY);
   // Should show the full key, not "your_public_key"
   ```

### ❌ "VAPID keys not configured" error

- Make sure you've generated VAPID keys using `npx web-push generate-vapid-keys`
- Check that keys are added to `.env` (not `.env.example`)
- Verify the key has `NEXT_PUBLIC_` prefix for the public key
- **Restart the development server** after adding keys

### ❌ Notifications not appearing

- Check browser notification permissions (should be "Allow")
- Verify service worker is registered (check DevTools > Application > Service Workers)
- Check browser console for errors
- Ensure user has enabled notifications in `/profile/notifications`

### "Service worker registration failed"

- Ensure `sw.js` exists in the `public` folder
- Check that the service worker scope is correct
- Clear browser cache and reload

### Subscription fails on production

- Ensure your site is served over HTTPS (required for service workers)
- Check that VAPID keys are properly set in production environment variables

## Features Implemented

✅ **FR032: Push Notification Infrastructure**

- Service Worker for background notifications
- Web Push API integration
- VAPID authentication

✅ **FR033: Notification Preferences**

- User preference management page
- Toggle for different notification types
- Save/update preferences

✅ **FR034: Notification Triggers**

- Admin interface to send notifications
- Target all users or specific users
- Notification type filtering

✅ **FR035: Notification Tracking**

- Log all sent notifications
- Track success/failure rates
- Store notification history

## Usage Examples

### Send Service Reminder (24 hours before)

```javascript
// This would be in a cron job or scheduled task
await fetch("/api/notifications/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "Service Reminder",
    body: "Your health service is tomorrow at 9 AM",
    url: "/profile/registrations",
    notificationType: "serviceReminders",
    targetUserIds: ["user_123"],
  }),
});
```

### Notify About New Service

```javascript
await fetch("/api/notifications/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "New Health Service Available",
    body: "Free dental checkup in Kathmandu on Dec 15",
    url: "/services/new_service_id",
    notificationType: "newServices",
    // targetUserIds not specified = send to all
  }),
});
```

## Next Steps

- Set up automated reminders (cron job to send 24h before services)
- Add notification templates
- Implement notification scheduling
- Add rich media (images in notifications)
- Track notification click rates
