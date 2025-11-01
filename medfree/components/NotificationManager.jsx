"use client";

import { useState, useEffect } from "react";
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  registerServiceWorker,
  getPushSubscription,
  subscribeToPush,
  unsubscribeFromPush,
  saveSubscriptionToServer,
  removeSubscriptionFromServer,
  showLocalNotification,
} from "@/lib/notifications";
import { useAuth } from "@clerk/nextjs";

export default function NotificationManager() {
  const { userId, isSignedIn } = useAuth();
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState("default");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    const checkSupport = () => {
      const isSupported = isNotificationSupported();
      setSupported(isSupported);

      if (isSupported) {
        setPermission(getNotificationPermission());
      }
    };

    checkSupport();
  }, []);

  useEffect(() => {
    const initServiceWorker = async () => {
      if (supported && isSignedIn) {
        try {
          const reg = await registerServiceWorker();
          setRegistration(reg);

          const sub = await getPushSubscription(reg);
          if (sub) {
            setSubscribed(true);
          }
        } catch (error) {
          console.error("Failed to initialize service worker:", error);
        }
      }
    };

    initServiceWorker();
  }, [supported, isSignedIn]);

  const handleEnableNotifications = async () => {
    setLoading(true);
    setError("");

    try {
      // Request permission
      const perm = await requestNotificationPermission();
      setPermission(perm);

      if (perm !== "granted") {
        setError("Notification permission denied");
        setLoading(false);
        return;
      }

      // Register service worker if not already registered
      let reg = registration;
      if (!reg) {
        reg = await registerServiceWorker();
        setRegistration(reg);
      }

      // Subscribe to push
      // Access the environment variable from window (Next.js injects it)
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      
      if (!vapidPublicKey || vapidPublicKey === 'your_public_key') {
        setError("VAPID public key not configured. Run: npx web-push generate-vapid-keys");
        setLoading(false);
        return;
      }

      const subscription = await subscribeToPush(reg, vapidPublicKey);

      // Save to server
      await saveSubscriptionToServer(subscription, userId);

      setSubscribed(true);

      // Show test notification
      await showLocalNotification("Notifications Enabled!", {
        body: "You'll now receive updates about your registered services.",
        icon: "/icon-192x192.png",
      });
    } catch (error) {
      console.error("Failed to enable notifications:", error);
      setError(error.message || "Failed to enable notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    setLoading(true);
    setError("");

    try {
      if (!registration) {
        throw new Error("Service worker not registered");
      }

      const subscription = await getPushSubscription(registration);

      if (subscription) {
        await unsubscribeFromPush(subscription);
        await removeSubscriptionFromServer(subscription);
      }

      setSubscribed(false);
    } catch (error) {
      console.error("Failed to disable notifications:", error);
      setError(error.message || "Failed to disable notifications");
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) {
    return null;
  }

  if (!supported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <h4 className="font-semibold text-yellow-900 text-sm">
              Notifications Not Supported
            </h4>
            <p className="text-sm text-yellow-700 mt-1">
              Your browser doesn&apos;t support push notifications. Try using
              Chrome, Firefox, or Edge.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start gap-4">
        <div
          className={`shrink-0 p-3 rounded-lg ${
            subscribed
              ? "bg-emerald-100"
              : permission === "denied"
              ? "bg-red-100"
              : "bg-gray-100"
          }`}>
          <svg
            className={`w-6 h-6 ${
              subscribed
                ? "text-emerald-600"
                : permission === "denied"
                ? "text-red-600"
                : "text-gray-600"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Push Notifications
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {subscribed
              ? "You're receiving notifications about your registered services."
              : permission === "denied"
              ? "Notifications are blocked. Please enable them in your browser settings."
              : "Enable notifications to get reminders about upcoming services."}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              {error}
            </div>
          )}

          {permission !== "denied" && (
            <button
              onClick={
                subscribed
                  ? handleDisableNotifications
                  : handleEnableNotifications
              }
              disabled={loading}
              className={`px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                subscribed
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}>
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {subscribed ? "Disabling..." : "Enabling..."}
                </>
              ) : (
                <>
                  {subscribed ? (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                        />
                      </svg>
                      Disable Notifications
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                      Enable Notifications
                    </>
                  )}
                </>
              )}
            </button>
          )}

          {permission === "denied" && (
            <div className="text-sm text-gray-600">
              <p className="mb-2">To enable notifications:</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-500">
                <li>Click the lock icon in your browser&apos;s address bar</li>
                <li>Find &quot;Notifications&quot; in the permissions list</li>
                <li>Change it from &quot;Block&quot; to &quot;Allow&quot;</li>
                <li>Refresh this page</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
