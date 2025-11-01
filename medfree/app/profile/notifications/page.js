"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import NotificationManager from "@/components/NotificationManager";
import NotificationPreferences from "@/components/NotificationPreferences";
import VapidSetupGuide from "@/components/VapidSetupGuide";
import { useOfflineAuth } from "@/components/OfflineAuthProvider";

export default function NotificationsPage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn, isOffline } = useOfflineAuth();

  useEffect(() => {
    if (isLoaded && !isSignedIn && !isOffline) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, isOffline, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  // Check if VAPID keys are configured
  const vapidConfigured =
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY &&
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY !== "your_public_key";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/profile"
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4">
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Profile
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Notification Settings
            </h1>
            <p className="mt-2 text-gray-600">
              Manage how you receive updates about your services
            </p>
          </div>

          {/* Offline Warning */}
          {isOffline && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 text-yellow-600 mt-0.5"
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
                  <h3 className="text-sm font-medium text-yellow-800">
                    Offline Mode
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Notification settings require an internet connection to update. Please reconnect to make changes.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Setup Guide (only show if not configured) */}
            {!vapidConfigured && <VapidSetupGuide />}

            {/* Enable/Disable Notifications */}
            <NotificationManager />

            {/* Notification Preferences */}
            <NotificationPreferences />
          </div>
        </div>
      </div>
    </>
  );
}
