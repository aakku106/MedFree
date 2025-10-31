"use client";

import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-50 min-h-[70px]">
      <div className="max-w-7xl mx-auto w-full px-4 lg:px-8 flex items-center justify-between">
        <div className="navbar-start flex items-center gap-4">
          <div className="dropdown">
            <button
              tabIndex={0}
              className="btn btn-ghost lg:hidden hover:bg-slate-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
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
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </button>
            {isMenuOpen && (
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[60] p-3 shadow-lg bg-white rounded-2xl w-64 border border-slate-200"
              >
                <li>
                  <Link
                    href="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="py-3 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-medium"
                  >
                    🏠 Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    onClick={() => setIsMenuOpen(false)}
                    className="py-3 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-medium"
                  >
                    🏥 Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    onClick={() => setIsMenuOpen(false)}
                    className="py-3 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-medium"
                  >
                    ℹ️ About
                  </Link>
                </li>
              </ul>
            )}
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl shadow-md">
              <svg
                className="w-7 h-7 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.5 3.09L15 5.5l3 1.4V11l-3-1.4v5.5l1.47-.69a.42.42 0 0 0 .22-.37V9.32l1.79.84A.47.47 0 0 0 19 10a.5.5 0 0 0 .5-.5zm-4 7.81v-3.5L12 5.5v5.5zM20 12.5L14 15v-5.5l6-2.5zM12 12.5L6 15V9.5l6-2.5zM4 14.5v-5l6-2.5v5.5z" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Osteon
            </span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2">
            <li>
              <Link
                href="/"
                className="px-5 py-2.5 rounded-full hover:bg-blue-50 hover:text-blue-600 font-medium transition-all"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className="px-5 py-2.5 rounded-full hover:bg-blue-50 hover:text-blue-600 font-medium transition-all"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="px-5 py-2.5 rounded-full hover:bg-blue-50 hover:text-blue-600 font-medium transition-all"
              >
                About
              </Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-none text-white px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all font-semibold">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="ring-2 ring-blue-100 rounded-full">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
