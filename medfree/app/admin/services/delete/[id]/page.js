"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DeleteServicePage({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [service, setService] = useState(null);
  const [serviceId, setServiceId] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        setServiceId(id);

        const response = await fetch(`/api/admin/services/${id}`);
        if (!response.ok) throw new Error("Failed to fetch service");

        const data = await response.json();
        setService(data.service);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchService();
  }, [params]);

  const handleDeactivate = async () => {
    if (
      !confirm(
        "Are you sure you want to deactivate this service? It will be hidden from users but kept in your records."
      )
    ) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to deactivate service");
      }

      router.push("/admin/services?success=deactivated");
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  const handlePermanentDelete = async () => {
    if (
      !confirm(
        "⚠️ PERMANENT DELETE - This action cannot be undone! Are you absolutely sure?"
      )
    ) {
      return;
    }

    if (!confirm("Final confirmation: Delete this service permanently?")) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/services/${serviceId}/permanent`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete service");
      }

      router.push("/admin/services?success=deleted");
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading service...</p>
      </div>
    );
  }

  if (error && !service) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-900 mb-2">Error</h2>
          <p className="text-red-800">{error}</p>
          <Link
            href="/admin/services"
            className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Delete Service</h1>
        <p className="text-gray-600 mt-2">Choose how to remove this service</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Service Preview */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Service Details
        </h2>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Title:</strong> {service?.title}
          </p>
          <p>
            <strong>Category:</strong> {service?.category}
          </p>
          <p>
            <strong>Location:</strong> {service?.location?.address},{" "}
            {service?.location?.city}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {service?.date
              ? new Date(service.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "N/A"}
          </p>
          <p>
            <strong>Registrations:</strong> {service?.registeredCount || 0} /{" "}
            {service?.capacity}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                service?.isActive !== false
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}>
              {service?.isActive !== false ? "Active" : "Inactive"}
            </span>
          </p>
        </div>
      </div>

      {/* Delete Options */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Soft Delete (Deactivate) */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="shrink-0">
              <svg
                className="h-6 w-6 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-medium text-yellow-900">
                Deactivate Service (Recommended)
              </h3>
              <p className="mt-2 text-sm text-yellow-800">
                Hide this service from users while keeping it in your records.
                You can reactivate it later if needed.
              </p>
              <ul className="mt-3 text-sm text-yellow-800 list-disc list-inside space-y-1">
                <li>Service becomes invisible to users</li>
                <li>Data is preserved for analytics</li>
                <li>Can be reactivated anytime</li>
                <li>Registration history is kept</li>
              </ul>
              <button
                onClick={handleDeactivate}
                disabled={deleting || service?.isActive === false}
                className="mt-4 w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {deleting
                  ? "Processing..."
                  : service?.isActive === false
                  ? "Already Inactive"
                  : "Deactivate Service"}
              </button>
            </div>
          </div>
        </div>

        {/* Permanent Delete */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-medium text-red-900">
                Delete Permanently (Danger!)
              </h3>
              <p className="mt-2 text-sm text-red-800">
                Completely remove this service from the database. This action
                cannot be undone.
              </p>
              <ul className="mt-3 text-sm text-red-800 list-disc list-inside space-y-1">
                <li>⚠️ All data will be lost forever</li>
                <li>Registration history deleted</li>
                <li>Cannot be recovered</li>
                <li>Use only for mistakes/duplicates</li>
              </ul>
              <button
                onClick={handlePermanentDelete}
                disabled={deleting}
                className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
                {deleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Button */}
      <div className="mt-8 flex justify-center">
        <Link
          href="/admin/services"
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
          ← Cancel and Go Back
        </Link>
      </div>
    </div>
  );
}
