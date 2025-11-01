import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { hasAdminAccess } from "@/lib/admin-config";
import SendNotificationForm from "@/components/admin/SendNotificationForm";

export default async function AdminNotificationsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check admin access
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const email = user.emailAddresses?.[0]?.emailAddress;

  if (!hasAdminAccess(email)) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Send Push Notification
          </h1>
          <p className="mt-2 text-gray-600">
            Send notifications to users about services and updates
          </p>
        </div>

        {/* Form */}
        <SendNotificationForm />

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900 text-sm mb-2">
                Notification Best Practices
              </h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>
                  Keep titles short and action-oriented (max 50 characters)
                </li>
                <li>Make body text clear and concise (max 120 characters)</li>
                <li>Use Service Reminders for time-sensitive information</li>
                <li>
                  Respect user preferences - they may have disabled certain
                  notification types
                </li>
                <li>Test notifications before sending to all users</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
