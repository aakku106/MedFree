"use client";
import { useEffect } from "react";
import { registerServiceWorker, initInstallPrompt } from "@/lib/pwa";
import PWAInstallBanner from "./PWAInstallBanner";
import OfflineIndicator from "./OfflineIndicator";

export default function PWAProvider({ children }) {
  useEffect(() => {
    // Register service worker
    registerServiceWorker();

    // Initialize install prompt
    initInstallPrompt();
  }, []);

  return (
    <>
      {children}
      <OfflineIndicator />
      <PWAInstallBanner />
    </>
  );
}
