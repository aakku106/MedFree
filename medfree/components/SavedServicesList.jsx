"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import SaveButton from "./SaveButton";
import { format, isPast } from "date-fns";

export default function SavedServicesList() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSavedServices();
  }, []);

  const fetchSavedServices = async () => {
    try {
      const response = await fetch("/api/profile/saved");
      if (response.ok) {
        const data = await response.json();
        setServices(data.services);
      }
    } catch (error) {
      console.error("Error fetching saved services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsave = () => {
    // Refresh the list after unsaving
    fetchSavedServices();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <svg
          className="w-24 h-24 mx-auto text-gray-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          No Saved Services
        </h2>
        <p className="text-gray-600 mb-6">
          You haven&apos;t saved any services yet. Browse services and click the
          heart icon to save them for later.
        </p>
        <Link
          href="/services"
          className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          Browse Services
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => {
        const serviceDate = new Date(service.date);
        const isExpired = isPast(serviceDate);

        return (
          <div
            key={service._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <Link href={`/services/${service._id}`}>
              <div className="p-6">
                {/* Header with Save Button */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        isExpired
                          ? "bg-gray-100 text-gray-600"
                          : "bg-emerald-100 text-emerald-700"
                      }`}>
                      {service.category}
                    </span>
                    {isExpired && (
                      <span className="ml-2 inline-block px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                        Expired
                      </span>
                    )}
                  </div>
                  <div onClick={(e) => e.preventDefault()}>
                    <SaveButton
                      serviceId={service._id}
                      onUpdate={handleUnsave}
                    />
                  </div>
                </div>

                {/* Service Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {service.title}
                </h3>

                {/* Location */}
                <div className="flex items-start gap-2 text-gray-600 mb-3">
                  <svg
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
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
                  <span className="text-sm">
                    {service.location.address}, {service.location.city}
                  </span>
                </div>

                {/* Date & Time */}
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm">
                    {format(serviceDate, "MMM dd, yyyy")} •{" "}
                    {service.schedule.timeStart} - {service.schedule.timeEnd}
                  </span>
                </div>

                {/* Capacity */}
                {service.schedule.capacity && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="text-sm">
                      Capacity: {service.registeredCount || 0}/
                      {service.schedule.capacity}
                    </span>
                  </div>
                )}
              </div>
            </Link>

            {/* Action Button */}
            <div className="px-6 pb-6">
              {!isExpired ? (
                <Link
                  href={`/services/${service._id}`}
                  className="block w-full text-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                  View Details & Register
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed font-medium">
                  Service Ended
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
