"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import RegistrationCard from "@/components/RegistrationCard";
import { useOfflineAuth } from "@/components/OfflineAuthProvider";

export default function UserRegistrationsPage() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn, isOffline } = useOfflineAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn && !isOffline) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, isOffline, router]);

  // Fetch registrations from API or cache
  useEffect(() => {
    if (!user) return;

    const loadRegistrations = async () => {
      try {
        setLoading(true);
        setError(null);

        if (isOffline) {
          // Load from cache when offline
          const cached = localStorage.getItem("registrations_cache");
          if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            setRegistrations(data);
            console.log("📦 Loaded registrations from cache");
          } else {
            setRegistrations([]);
          }
        } else {
          // Fetch from API when online
          const response = await fetch("/api/profile/registrations");
          if (!response.ok) throw new Error("Failed to fetch registrations");

          const data = await response.json();
          setRegistrations(data);

          // Cache for offline use
          localStorage.setItem(
            "registrations_cache",
            JSON.stringify({
              data,
              timestamp: Date.now(),
            })
          );
          console.log("💾 Cached registrations");
        }
      } catch (err) {
        console.error("Error loading registrations:", err);
        setError(
          isOffline
            ? "No cached registrations available offline."
            : "Failed to load registrations. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRegistrations();
  }, [user, isOffline]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading registrations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  // Split into upcoming and past
  const now = new Date();
  const upcomingRegistrations = registrations.filter((r) => {
    const serviceDate = new Date(r.service?.date);
    return serviceDate >= now;
  });

  const pastRegistrations = registrations.filter((r) => {
    const serviceDate = new Date(r.service?.date);
    return serviceDate < now;
  });

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
            <h1 className="text-3xl font-bold text-gray-900">
              My Registrations
            </h1>
            <p className="mt-2 text-gray-600">
              View and manage your healthcare service registrations
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
                    Viewing cached registrations. Data may not be up to date
                    until you reconnect.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Upcoming Registrations */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <svg
                  className="w-6 h-6 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Upcoming Services
                </h2>
                <p className="text-sm text-gray-600">
                  {upcomingRegistrations.length} active registration
                  {upcomingRegistrations.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {upcomingRegistrations.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingRegistrations.map((registration) => (
                  <RegistrationCard
                    key={registration._id.toString()}
                    registration={registration}
                    type="upcoming"
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="max-w-sm mx-auto">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Upcoming Services
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You don&apos;t have any upcoming service registrations.
                    Browse available services to register.
                  </p>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Browse Services
                  </Link>
                </div>
              </div>
            )}
          </section>

          {/* Past Registrations */}
          {pastRegistrations.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Past Services
                  </h2>
                  <p className="text-sm text-gray-600">
                    {pastRegistrations.length} completed registration
                    {pastRegistrations.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastRegistrations.map((registration) => (
                  <RegistrationCard
                    key={registration._id.toString()}
                    registration={registration}
                    type="past"
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
