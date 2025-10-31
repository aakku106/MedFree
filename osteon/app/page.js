'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState } from 'react'

// Lazy load Spline to prevent SSR issues
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  ),
})

export default function HomePage() {
  const [splineLoaded, setSplineLoaded] = useState(false)

  return (
    <div className="relative">
      {/* Hero Section with Spline */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
        {/* Spline 3D Background */}
        <div className="absolute inset-0 w-full h-full opacity-40">
          <Spline
            scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
            onLoad={() => setSplineLoaded(true)}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="badge badge-primary badge-lg mb-6 animate-pulse">
              Free Healthcare Information
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">
                Free Medical Services
              </span>{' '}
              in Nepal
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Stay informed about government-provided free checkups, medications, 
              and health camps available in your area.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/services" className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl transition-all">
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
                Explore Services
              </Link>
              
              <Link href="/about" className="btn btn-outline btn-lg gap-2">
                Learn More
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
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
              <div className="stats shadow bg-white/80 backdrop-blur">
                <div className="stat place-items-center">
                  <div className="stat-value text-primary">500+</div>
                  <div className="stat-desc text-slate-600">Services Listed</div>
                </div>
              </div>
              <div className="stats shadow bg-white/80 backdrop-blur">
                <div className="stat place-items-center">
                  <div className="stat-value text-secondary">75+</div>
                  <div className="stat-desc text-slate-600">Districts Covered</div>
                </div>
              </div>
              <div className="stats shadow bg-white/80 backdrop-blur">
                <div className="stat place-items-center">
                  <div className="stat-value text-accent">100K+</div>
                  <div className="stat-desc text-slate-600">People Helped</div>
                </div>
              </div>
              <div className="stats shadow bg-white/80 backdrop-blur">
                <div className="stat place-items-center">
                  <div className="stat-value text-info">24/7</div>
                  <div className="stat-desc text-slate-600">Access</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-slate-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-primary">Osteon</span>?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We bridge the information gap in healthcare awareness
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="card bg-gradient-to-br from-cyan-50 to-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="card-body items-center text-center">
                <div className="bg-primary rounded-full p-4 mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="card-title text-2xl">Real-Time Updates</h3>
                <p className="text-slate-600">
                  Get instant notifications about new health camps and services in your area
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="card bg-gradient-to-br from-teal-50 to-emerald-50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="card-body items-center text-center">
                <div className="bg-secondary rounded-full p-4 mb-4">
                  <svg
                    className="w-8 h-8 text-white"
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
                <h3 className="card-title text-2xl">Location-Based</h3>
                <p className="text-slate-600">
                  Find services near you with our smart geolocation features
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="card-body items-center text-center">
                <div className="bg-accent rounded-full p-4 mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="card-title text-2xl">Verified Information</h3>
                <p className="text-slate-600">
                  All services are verified and sourced from official government channels
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Access Free Healthcare?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of Nepalis who have discovered free medical services through Osteon
          </p>
          <Link href="/services" className="btn btn-lg bg-white text-primary hover:bg-slate-100 border-none shadow-xl">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  )
}
