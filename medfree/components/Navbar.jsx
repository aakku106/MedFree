"use client";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-emerald-600">MedFree</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/services"
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              Services
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              About Us
            </Link>
            {isSignedIn && (
              <Link
                href="/profile"
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                My Profile
              </Link>
            )}
          </div>

          {/* Auth Button */}
          <div className="hidden md:flex items-center">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className="px-5 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors font-medium">
                  User Login
                </button>
              </SignInButton>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {isSignedIn && <UserButton afterSignOutUrl="/" />}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-emerald-600"
              aria-label="Toggle menu">
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link
                href="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2">
                Services
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2">
                About Us
              </Link>
              {isSignedIn ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-emerald-600 transition-colors font-medium py-2">
                    My Profile
                  </Link>
                  <Link
                    href="/profile/registrations"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-600 hover:text-emerald-600 transition-colors text-sm py-2 pl-4">
                    • My Registrations
                  </Link>
                  <Link
                    href="/profile/saved"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-600 hover:text-emerald-600 transition-colors text-sm py-2 pl-4">
                    • Saved Services
                  </Link>
                  <Link
                    href="/profile/notifications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-600 hover:text-emerald-600 transition-colors text-sm py-2 pl-4">
                    • Notifications
                  </Link>
                  <Link
                    href="/profile/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-600 hover:text-emerald-600 transition-colors text-sm py-2 pl-4">
                    • Settings
                  </Link>
                </>
              ) : (
                <SignInButton mode="modal">
                  <button className="w-full text-left px-5 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors font-medium">
                    User Login
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
