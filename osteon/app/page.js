import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-purple-50 to-white px-4 py-16">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-5 py-2.5 rounded-full font-semibold text-sm mb-8 shadow-sm">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
            Healthcare Made Accessible
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-slate-900">
            Easily Find and Access{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient">
              Free Medical Services
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Discover free medical checkups, health camps, and services provided
            by the government near you. Access quality healthcare information
            all in one place — because everyone deserves healthcare.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-blue-600 hover:bg-blue-700 px-10 py-4 text-lg font-bold text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 group-hover:rotate-12 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Find Free Services
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-white hover:bg-slate-50 border-2 border-slate-300 px-10 py-4 text-lg font-bold text-slate-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Learn More
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Location-Based Search
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Find medical services near you with our intelligent
                location-based search.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Real-Time Updates
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Get the latest information about ongoing and upcoming health
                camps.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                100% Free Services
              </h3>
              <p className="text-slate-600 leading-relaxed">
                All listed services are completely free and provided by
                government healthcare.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
