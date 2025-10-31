"use client";

import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar bg-base-100/80 backdrop-blur supports-backdrop-blur:bg-base-100/80 border-b shadow-sm sticky top-0 z-50 rounded-b-xl">
      <div className="max-w-7xl mx-auto w-full px-4 lg:px-6 flex items-center">
        <div className="navbar-start">
          <div className="dropdown">
            <button
              tabIndex={0}
              className="btn btn-ghost lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
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
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </button>
            {isMenuOpen && (
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-60 p-2 shadow bg-base-100 rounded-xl w-56"
              >
                <li>
                  <Link href="/" onClick={() => setIsMenuOpen(false)}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/services" onClick={() => setIsMenuOpen(false)}>
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/about" onClick={() => setIsMenuOpen(false)}>
                    About
                  </Link>
                </li>
              </ul>
            )}
          </div>
          <Link
            href="/"
            className="btn btn-ghost text-xl font-bold text-primary"
          >
            <svg
              className="w-8 h-8 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19.5 3.09L15 5.5l3 1.4V11l-3-1.4v5.5l1.47-.69a.42.42 0 0 0 .22-.37V9.32l1.79.84A.47.47 0 0 0 19 10a.5.5 0 0 0 .5-.5zm-4 7.81v-3.5L12 5.5v5.5zM20 12.5L14 15v-5.5l6-2.5zM12 12.5L6 15V9.5l6-2.5zM4 14.5v-5l6-2.5v5.5z" />
            </svg>
            Osteon
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-1">
            <li>
              <Link href="/" className="btn btn-ghost rounded-full">
                Home
              </Link>
            </li>
            <li>
              <Link href="/services" className="btn btn-ghost rounded-full">
                Services
              </Link>
            </li>
            <li>
              <Link href="/about" className="btn btn-ghost rounded-full">
                About
              </Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end gap-2">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn btn-primary btn-sm rounded-full">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
