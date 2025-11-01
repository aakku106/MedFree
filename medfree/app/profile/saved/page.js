import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SavedServicesList from "@/components/SavedServicesList";

export const metadata = {
  title: "Saved Services - MedFree",
  description: "View your saved medical services",
};

export default async function SavedServicesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <h1 className="text-3xl font-bold text-gray-900">Saved Services</h1>
          </div>
          <p className="text-gray-600">
            Services you&apos;ve bookmarked for later review
          </p>
        </div>

        {/* Saved Services List */}
        <SavedServicesList />
      </div>
    </div>
  );
}
