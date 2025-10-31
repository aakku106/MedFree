"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchServiceDetail();
    }
  }, [params.id]);

  const fetchServiceDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/services/${params.id}`);

      if (response.data.success) {
        setService(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load service details");
      console.error("Error fetching service:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "ongoing":
        return "badge-success";
      case "upcoming":
        return "badge-info";
      case "completed":
        return "badge-neutral";
      default:
        return "badge-primary";
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
            <p className="text-slate-600">Loading service details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
          <div className="card bg-base-100 shadow-xl max-w-md">
            <div className="card-body items-center text-center">
              <svg
                className="w-16 h-16 text-error mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="card-title text-2xl mb-2">
                Error Loading Service
              </h2>
              <p className="text-slate-600 mb-4">{error}</p>
              <div className="card-actions">
                <button
                  onClick={() => router.push("/services")}
                  className="btn btn-primary"
                >
                  Back to Services
                </button>
                <button
                  onClick={fetchServiceDetail}
                  className="btn btn-outline"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!service) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Breadcrumb */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="text-sm breadcrumbs">
              <ul>
                <li>
                  <Link href="/" className="text-primary hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="text-primary hover:underline"
                  >
                    Services
                  </Link>
                </li>
                <li className="text-slate-600">{service.name}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Main Card */}
            <div className="card bg-base-100 shadow-2xl mb-8">
              <div className="card-body">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge badge-primary">
                        {service.category}
                      </span>
                      {service.status && (
                        <span
                          className={`badge ${getStatusBadge(service.status)}`}
                        >
                          {service.status}
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                      {service.name}
                    </h1>
                  </div>
                </div>

                <div className="divider"></div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Description
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    {service.description ||
                      "No description available for this service."}
                  </p>
                </div>

                {/* Location Details */}
                {service.location && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <svg
                        className="w-6 h-6 text-secondary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
                      Location
                    </h2>
                    <div className="bg-slate-50 rounded-lg p-4">
                      {service.location.address && (
                        <p className="text-slate-700 mb-2">
                          <span className="font-medium">Address:</span>{" "}
                          {service.location.address}
                        </p>
                      )}
                      {service.location.district && (
                        <p className="text-slate-700 mb-2">
                          <span className="font-medium">District:</span>{" "}
                          {service.location.district}
                        </p>
                      )}
                      {service.location.coordinates && (
                        <p className="text-slate-700">
                          <span className="font-medium">Coordinates:</span>{" "}
                          {service.location.coordinates.latitude},{" "}
                          {service.location.coordinates.longitude}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Date & Time */}
                {service.date && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <svg
                        className="w-6 h-6 text-accent"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Schedule
                    </h2>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        {service.date.start && (
                          <div>
                            <p className="text-sm text-slate-500 mb-1">
                              Start Date
                            </p>
                            <p className="text-lg font-semibold text-slate-700">
                              {new Date(service.date.start).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        )}
                        {service.date.end && (
                          <div>
                            <p className="text-sm text-slate-500 mb-1">
                              End Date
                            </p>
                            <p className="text-lg font-semibold text-slate-700">
                              {new Date(service.date.end).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                {service.contact && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <svg
                        className="w-6 h-6 text-info"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      Contact Information
                    </h2>
                    <div className="bg-slate-50 rounded-lg p-4">
                      {service.contact.phone && (
                        <p className="text-slate-700 mb-2">
                          <span className="font-medium">Phone:</span>{" "}
                          <a
                            href={`tel:${service.contact.phone}`}
                            className="text-primary hover:underline"
                          >
                            {service.contact.phone}
                          </a>
                        </p>
                      )}
                      {service.contact.email && (
                        <p className="text-slate-700">
                          <span className="font-medium">Email:</span>{" "}
                          <a
                            href={`mailto:${service.contact.email}`}
                            className="text-primary hover:underline"
                          >
                            {service.contact.email}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Services Provided */}
                {service.servicesProvided &&
                  service.servicesProvided.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <svg
                          className="w-6 h-6 text-success"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                          />
                        </svg>
                        Services Provided
                      </h2>
                      <ul className="grid md:grid-cols-2 gap-2">
                        {service.servicesProvided.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-slate-700"
                          >
                            <svg
                              className="w-5 h-5 text-success flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Requirements */}
                {service.requirements && service.requirements.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <svg
                        className="w-6 h-6 text-warning"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      Requirements
                    </h2>
                    <div className="alert alert-warning">
                      <svg
                        className="w-6 h-6 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <ul className="list-disc list-inside">
                        {service.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="card-actions justify-center mt-8 gap-4">
                  <Link href="/services" className="btn btn-outline">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Back to Services
                  </Link>
                  {service.contact?.phone && (
                    <a
                      href={`tel:${service.contact.phone}`}
                      className="btn btn-primary"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      Contact Now
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
