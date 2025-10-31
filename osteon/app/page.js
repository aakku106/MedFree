import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-cyan-50 via-blue-50 to-teal-50 px-4">
      <div className="max-w-3xl mx-auto text-center">
        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight text-slate-900">
          Easily Find and Access{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-600 to-teal-600">
            Free Medical Services
          </span>
        </h1>

        {/* Introductory Paragraph */}
        <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Discover free medical checkups, health camps, and services provided by
          the government near you. Access quality healthcare information in one
          place.
        </p>

        {/* Primary Action Button */}
        <Link
          href="/services"
          className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl transition-all text-lg px-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
      </div>
    </div>
  );
}
