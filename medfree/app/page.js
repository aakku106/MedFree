"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center px-4">
      <main className="max-w-4xl mx-auto text-center space-y-8 py-20">
        {/* Hero Headline */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
            Free Medical Care
            <span className="block text-emerald-600">For Everyone</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Easily find and access free medical services, checkups, and health
            camps provided by the government near you.
          </p>
        </div>

        {/* Features Grid - subtle visual interest */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto py-8">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600 font-medium">
              Find Services Nearby
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
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
            <p className="text-sm text-gray-600 font-medium">
              Real-time Updates
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600 font-medium">
              100% Free Services
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-8">
          <button
            onClick={() => router.push("/services")}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
            Find Free Services
            <svg
              className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>

        {/* Trust Badge */}
        <div className="pt-12">
          <p className="text-sm text-gray-500">
            Information updated regularly by government health centers
          </p>
        </div>
      </main>
    </div>
  );
}
