"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CachedServicesViewer from "@/components/CachedServicesViewer";
import { useOfflineAuth } from "@/components/OfflineAuthProvider";

export default function CachedServicesPage() {
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

            <div className="flex items-center gap-3 mb-2">
              <svg
                className="h-8 w-8 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                />
              </svg>
              <h1 className="text-3xl font-bold text-gray-900">
                Offline Cached Services
              </h1>
            </div>
            <p className="text-gray-600">
              Services you&apos;ve viewed are cached for offline access
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              About Offline Access
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">•</span>
                <span>
                  Services are automatically cached when you view their details
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">•</span>
                <span>
                  Cached services remain accessible even without an internet
                  connection
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">•</span>
                <span>
                  Cache updates automatically when you&apos;re back online
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2">•</span>
                <span>Registration requires an active internet connection</span>
              </li>
            </ul>
          </div>

          {/* Cached Services List */}
          <CachedServicesViewer />
        </div>
      </div>
    </>
  );
}
