"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SaveButton({ serviceId, className = "" }) {
  const { isSignedIn, userId } = useAuth();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkIfSaved = async () => {
    try {
      const response = await fetch("/api/profile/saved");
      if (response.ok) {
        const data = await response.json();
        const saved = data.services.some((s) => s._id === serviceId);
        setIsSaved(saved);
      }
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  };

  // Check if service is already saved
  useEffect(() => {
    if (isSignedIn && userId) {
      checkIfSaved();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, userId, serviceId]);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/profile/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          action: isSaved ? "unsave" : "save",
        }),
      });

      if (response.ok) {
        setIsSaved(!isSaved);
      } else {
        throw new Error("Failed to update saved status");
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      alert("Failed to update. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleSave}
      disabled={isLoading}
      className={`group relative p-2 rounded-full transition-all duration-200 hover:scale-110 ${
        isSaved
          ? "bg-red-100 text-red-600"
          : "bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      title={isSaved ? "Remove from saved" : "Save for later"}
      aria-label={isSaved ? "Remove from saved" : "Save for later"}>
      {isSaved ? (
        // Filled heart
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        // Outline heart
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
    </button>
  );
}
