"use client";
import { useState, useEffect } from "react";
import { promptInstall, canInstall, isPWA } from "@/lib/pwa";

export default function PWAInstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Don't show if already installed as PWA
    if (isPWA()) {
      return;
    }

    // Check if user has dismissed the banner before
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    const visitCount = parseInt(localStorage.getItem("visit-count") || "0");

    // Increment visit count
    localStorage.setItem("visit-count", (visitCount + 1).toString());

    // Show banner after 2-3 visits if not dismissed
    if (!dismissed && visitCount >= 2) {
      setTimeout(() => {
        if (canInstall()) {
          setShowBanner(true);
        }
      }, 3000); // Show after 3 seconds
    }
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const accepted = await promptInstall();
      if (accepted) {
        setShowBanner(false);
      }
    } catch (error) {
      console.error("Install prompt failed:", error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div
      id="pwa-install-banner"
      className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-2xl transform transition-transform duration-500 ease-out">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Icon & Message */}
          <div className="flex items-center gap-4 flex-1">
            <div className="hidden sm:block">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">
                Install MedFree App
              </h3>
              <p className="text-sm text-emerald-100">
                Get quick access to free healthcare services. Works offline!
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="px-6 py-2.5 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              {isInstalling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-700"></div>
                  Installing...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Install
                </>
              )}
            </button>
            <button
              onClick={handleDismiss}
              className="text-white hover:text-emerald-100 transition-colors p-2"
              aria-label="Dismiss">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
