import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SettingsForm from "@/components/SettingsForm";

export const metadata = {
  title: "Settings - MedFree",
  description: "Manage your account settings and preferences",
};

export default async function SettingsPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  // Serialize user data to plain object for Client Component
  const userData = {
    fullName: user?.fullName || null,
    firstName: user?.firstName || null,
    lastName: user?.lastName || null,
    email: user?.emailAddresses?.[0]?.emailAddress || null,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/profile"
              className="text-gray-600 hover:text-gray-900 transition-colors">
              <svg
                className="w-6 h-6"
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
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="text-gray-600">
            Manage your account preferences and settings
          </p>
        </div>

        {/* Settings Form */}
        <SettingsForm userData={userData} />
      </div>
    </div>
  );
}
