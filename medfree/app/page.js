// Landing page with Spline 3D background, hero section, and Clerk integration styling
"use client";

import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50" />
  ),
});

function FeatureCard({ bg, iconColor, icon, label }) {
  return (
    <div
      className="flex flex-col items-center space-y-3 bg-white/22 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
      role="group"
      aria-label={label}
    >
      <div className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center`}>
        <div className={iconColor}>{icon}</div>
      </div>
      <p className="text-sm md:text-base text-gray-800 font-medium">{label}</p>
    </div>
  );
}

function Hero({ onPrimary }) {
  return (
    <header className="relative z-10 max-w-5xl mx-auto text-center space-y-10 py-24 pointer-events-none">
      <div className="space-y-5">
        <h1
          className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight drop-shadow-sm"
          style={{
            fontFamily:
              "'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
          }}
        >
          Free Medical Care
          <span className="block text-emerald-600">Accessible to All</span>
        </h1>

        <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed drop-shadow-none">
          Discover government-run health checkups, immunization camps, and
          no-cost clinics close to you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto py-8 pointer-events-auto">
        <FeatureCard
          bg="bg-emerald-100"
          iconColor="text-emerald-600"
          label="Locate nearby clinics"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
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
          }
        />

        <FeatureCard
          bg="bg-sky-100"
          iconColor="text-sky-600"
          label="Live updates & schedules"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />

        <FeatureCard
          bg="bg-purple-100"
          iconColor="text-purple-600"
          label="Completely free services"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>

      <div className="pt-6 pointer-events-auto">
        <button
          onClick={onPrimary}
          className="group relative inline-flex items-center justify-center px-10 py-3 text-base md:text-lg font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-transform duration-250 shadow-md hover:scale-105"
          aria-label="Find free medical services"
        >
          Find Free Services
          <svg
            className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
      </div>

      <p className="pt-10 text-sm text-gray-500">
        Data is updated regularly by government health centers
      </p>
    </header>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const orig = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === "string" &&
        (args[0].includes("Missing property") || args[0].includes("buildTimeline"))
      ) {
        return;
      }
      orig.apply(console, args);
    };
    return () => {
      console.error = orig;
    };
  }, []);

  const splineArea = useMemo(() => {
    if (loadFailed) {
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50" />
      );
    }

    return (
      <Spline
        scene="https://prod.spline.design/wgW9TMyJx283PU0M/scene.splinecode"
        onLoad={() => console.log("Spline scene loaded")}
        onError={(e) => {
          console.warn("Spline failed to load:", e);
          setLoadFailed(true);
        }}
        className="w-full h-full"
      />
    );
  }, [loadFailed]);

  return (
    <>
      <Head>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <title>Free Medical Care</title>
      </Head>

      <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-gray-50">
        <div className="absolute inset-0 z-0 pointer-events-auto flex items-center justify-center overflow-hidden">
          {splineArea}
        </div>
        <div className="absolute inset-0 z-5 bg-white/16 pointer-events-none" />
        <main className="relative z-10 w-full">
          <Hero onPrimary={() => router.push("/services")} />
        </main>
      </div>
    </>
  );
}
