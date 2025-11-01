import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
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
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/profile"
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Profile
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Saved Services</h1>
            <p className="text-gray-600 mt-2">
              Services you&apos;ve bookmarked for later review
            </p>
          </div>

          {/* Saved Services List */}
          <SavedServicesList />
        </div>
      </div>
    </>
  );
}
