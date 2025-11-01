import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
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
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/profile"
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">
              Manage your account preferences and settings
            </p>
          </div>

          {/* Settings Form */}
          <SettingsForm userData={userData} />
        </div>
      </div>
    </>
  );
}
