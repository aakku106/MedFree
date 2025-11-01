// Top navigation bar with Clerk authentication and gradient background
"use client";

import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

export default function TopNav() {
  const { isSignedIn } = useUser();

  const navLinks = [
    { href: "/services", label: "Our Services" },
    { href: "/about", label: "Who We Are" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-white/80 via-emerald-50/60 to-white/80 backdrop-blur-md shadow-sm border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex items-center space-x-2 select-none"
            aria-label="Go to home"
          >
            <span
              className="text-2xl font-extrabold text-emerald-700 tracking-tight"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              MedAccess
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-gray-700 font-medium hover:text-emerald-700 transition-colors duration-200 group"
              >
                {link.label}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-emerald-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center">
            {isSignedIn ? (
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox:
                      "ring-2 ring-emerald-500 hover:ring-emerald-600 transition",
                  },
                }}
              />
            ) : (
              <SignInButton mode="modal">
                <button className="px-5 py-2 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 hover:shadow-md transition-all duration-300">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>

          <button
            type="button"
            className="md:hidden text-gray-700 hover:text-emerald-700 transition-colors duration-200"
            aria-label="Open navigation menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
