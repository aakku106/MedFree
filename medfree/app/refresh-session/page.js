"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RefreshSessionPage() {
  const { getToken, signOut } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState("");

  const handleRefresh = async () => {
    setStatus("Refreshing session...");
    try {
      // Force token refresh
      await getToken({ template: "default", skipCache: true });
      setStatus("✅ Session refreshed! Redirecting to debug page...");

      setTimeout(() => {
        router.push("/api/debug-session");
      }, 2000);
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    setStatus("Signing out...");
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          🔄 Refresh Clerk Session
        </h1>

        <p className="text-gray-600 mb-6">
          If you updated your role in Clerk Dashboard but it&apos;s not showing
          up, use these options to force a fresh session.
        </p>

        <div className="space-y-4">
          <button
            onClick={handleRefresh}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Force Refresh Session
          </button>

          <button
            onClick={handleSignOut}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
            Sign Out Completely
          </button>
        </div>

        {status && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              status.includes("✅")
                ? "bg-green-100 text-green-800"
                : status.includes("❌")
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}>
            {status}
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500">
          <p className="font-semibold mb-2">Steps to verify:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click &quot;Force Refresh Session&quot;</li>
            <li>Check the debug output</li>
            <li>If still not working, click &quot;Sign Out Completely&quot;</li>
            <li>Sign in again with a fresh session</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
