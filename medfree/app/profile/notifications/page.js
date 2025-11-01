import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import NotificationManager from "@/components/NotificationManager";
import NotificationPreferences from "@/components/NotificationPreferences";
import VapidSetupGuide from "@/components/VapidSetupGuide";

export default async function NotificationsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if VAPID keys are configured
  const vapidConfigured =
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY &&
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY !== "your_public_key";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Notification Settings
          </h1>
          <p className="mt-2 text-gray-600">
            Manage how you receive updates about your services
          </p>
        </div>

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
  );
}
