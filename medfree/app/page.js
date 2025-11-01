"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import "./page.css";
// Dynamically import Spline with no SSR to prevent hydration issues
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-linear-to-br from-emerald-50 via-white to-blue-50" />
  ),
});

export default function Home() {
  const router = useRouter();
  const [splineError, setSplineError] = useState(false);

  // Suppress specific Spline console errors
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      // Filter out Spline timeline/property errors
      if (
        args[0]?.includes?.("Missing property") ||
        args[0]?.includes?.("buildTimeline")
      ) {
        return; // Suppress these specific errors
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  // Memoize the Spline component to prevent re-renders
  const splineScene = useMemo(() => {
    if (splineError) {
      return (
        <div className="absolute inset-0 bg-linear-to-br from-emerald-50 via-white to-blue-50" />
      );
    }

    return (
      <Spline
        scene="https://prod.spline.design/wgW9TMyJx283PU0M/scene.splinecode"
        onLoad={() => console.log("✅ Spline loaded successfully")}
      />
    );
  }, [splineError]);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
      {/* Spline 3D Background - interactive */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        {splineScene}
      </div>

      {/* Subtle vignette overlay - keeps 3D visible in center */}
      <div className="absolute inset-0 z-5 bg-gradient-to-b from-white/30 via-transparent to-white/30 pointer-events-none"></div>

      {/* Content Overlay - allow clicks to pass through to Spline */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center space-y-6 pointer-events-none">
        {/* Hero Headline - text with glow background */}
        <div className="space-y-4">
          <div className="inline-block bg-white/70 px-8 py-6 rounded-3xl shadow-xl">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Free Medical Care
              <span className="block text-emerald-600">For Everyone</span>
            </h1>
          </div>
          <div className="inline-block bg-white/60 px-6 py-4 rounded-2xl shadow-lg max-w-3xl">
            <p className="text-lg md:text-xl text-gray-800 font-medium leading-relaxed">
              Easily find and access free medical services, checkups, and health
              camps provided by the government near you.
            </p>
          </div>
        </div>

        {/* Features Grid - cards with subtle backgrounds */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="flex flex-col items-center space-y-2 bg-white/70 rounded-2xl p-4 shadow-lg hover:bg-white/80 transition-all">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shadow-md">
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
            <p className="text-sm text-gray-900 font-semibold">
              Find Services Nearby
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2 bg-white/70 rounded-2xl p-4 shadow-lg hover:bg-white/80 transition-all">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shadow-md">
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
            <p className="text-sm text-gray-900 font-semibold">
              Real-time Updates
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2 bg-white/70 rounded-2xl p-4 shadow-lg hover:bg-white/80 transition-all">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shadow-md">
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
            <p className="text-sm text-gray-900 font-semibold">
              100% Free Services
            </p>
          </div>
        </div>

        {/* CTA Button - enable clicks with strong presence */}
        <div className="pointer-events-auto">
          <button
            onClick={() => router.push("/services")}
            className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50 hover:scale-110 ring-2 ring-white ring-offset-4 ring-offset-white/50">
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

        {/* Trust Badge - subtle pill */}
        <div>
          <div className="inline-block bg-white/80 px-6 py-3 rounded-full shadow-lg">
            <p className="text-sm text-gray-800 font-medium flex items-center gap-2">
              <svg
                className="w-4 h-4 text-emerald-600"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Information updated regularly by government health centers
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
