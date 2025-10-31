"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ServiceCard from "@/components/ServiceCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationState, setLocationState] = useState({
    status: "idle",
    coords: null,
    message: "",
  });
  const [locationMeta, setLocationMeta] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    district: "",
    status: "",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });

  const requestLocation = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setLocationState({
        status: "unsupported",
        coords: null,
        message: "Your browser does not support location detection.",
      });
      return;
    }

    setLocationState((prev) => ({
      status: "pending",
      coords: prev.coords,
      message: "",
    }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationState({
          status: "granted",
          coords: {
            latitude: Number(position.coords.latitude.toFixed(6)),
            longitude: Number(position.coords.longitude.toFixed(6)),
          },
          message: "",
        });
      },
      (geoError) => {
        let message = "We could not access your location.";
        const errorCode = geoError?.code;

        if (errorCode === 1) {
          message =
            "Location access was denied. Showing national services instead.";
        } else if (errorCode === 2) {
          message =
            "Location information is currently unavailable. Showing national services.";
        } else if (errorCode === 3) {
          message = "Location request timed out. You can retry if you wish.";
        }

        setLocationState({
          status: "denied",
          coords: null,
          message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const fetchServices = useCallback(async () => {
    if (locationState.status === "pending" || locationState.status === "idle") {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (filters.category) params.append("category", filters.category);
      if (filters.district) params.append("district", filters.district);
      if (filters.status) params.append("status", filters.status);

      if (locationState.status === "granted" && locationState.coords) {
        params.append("lat", locationState.coords.latitude.toString());
        params.append("lng", locationState.coords.longitude.toString());
      }

      const response = await axios.get(`/api/services?${params}`);

      if (response.data.success) {
        setServices(response.data.data);
        setPagination((prev) => ({
          ...prev,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages,
        }));
        setLocationMeta(response.data.meta ?? null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load services");
      setLocationMeta(null);
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit, pagination.page, locationState]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleLocationRetry = () => {
    requestLocation();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1 when filters change
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <section className="bg-linear-to-r from-blue-600 via-purple-600 to-blue-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-center">
              Free Medical Services
            </h1>
            <p className="text-xl md:text-2xl text-center max-w-3xl mx-auto opacity-95 leading-relaxed">
              Browse available government healthcare services across Nepal and
              find the help you need
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Location Status */}
          {locationState.status === "pending" && (
            <div className="mb-8 flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-6 py-5 text-blue-900 shadow-md">
              <span className="loading loading-spinner loading-md text-blue-600"></span>
              <span className="font-semibold text-lg">
                📍 Detecting your location to find nearby services…
              </span>
            </div>
          )}

          {(locationState.status === "denied" ||
            locationState.status === "unsupported") && (
            <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-amber-300 bg-amber-50 px-6 py-5 text-amber-900 shadow-md sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <span className="font-medium text-base">
                  {locationState.message ||
                    "We couldn't use your location. Showing services across Nepal, sorted alphabetically."}
                </span>
              </div>
              {locationState.status === "denied" && (
                <button
                  onClick={handleLocationRetry}
                  className="inline-flex items-center justify-center rounded-full bg-amber-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-amber-700 hover:shadow-lg"
                >
                  Retry Location
                </button>
              )}
            </div>
          )}

          {locationState.status === "granted" && locationMeta?.locationSort && (
            <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-emerald-300 bg-emerald-50 px-6 py-5 text-emerald-900 shadow-md sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <span className="font-medium text-base">
                  Showing services closest to you first.
                  {locationMeta?.totalWithCoordinates === 0 &&
                    " Some listings do not include coordinates and appear after nearby results."}
                </span>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-emerald-700 shadow-md">
                📌 {locationMeta?.totalWithCoordinates ?? 0} services with
                location data
              </span>
            </div>
          )}

          {/* Filters Section */}
          <div className="card mb-10 rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="card-body p-8">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                </div>
                Filter Services
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-slate-700 text-base">
                      🏥 Category
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full border-2 border-slate-300 bg-white text-slate-800 font-semibold focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 rounded-xl py-3"
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                  >
                    <option value="">All Categories</option>
                    <option value="Health Camp">Health Camp</option>
                    <option value="Free Medication">Free Medication</option>
                    <option value="Checkup">Checkup</option>
                    <option value="Vaccination">Vaccination</option>
                    <option value="Mental Health">Mental Health</option>
                  </select>
                </div>

                {/* District Filter */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-slate-700 text-base">
                      📍 District
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full border-2 border-slate-300 bg-white text-slate-800 font-semibold focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100 rounded-xl py-3"
                    value={filters.district}
                    onChange={(e) =>
                      handleFilterChange("district", e.target.value)
                    }
                  >
                    <option value="">All Districts</option>
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Lalitpur">Lalitpur</option>
                    <option value="Bhaktapur">Bhaktapur</option>
                    <option value="Pokhara">Pokhara</option>
                    <option value="Chitwan">Chitwan</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-slate-700 text-base">
                      ⚡ Status
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full border-2 border-slate-300 bg-white text-slate-800 font-semibold focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 rounded-xl py-3"
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                  >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {(filters.category || filters.district || filters.status) && (
                <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-base font-bold text-slate-700">
                      🔍 Active Filters:
                    </span>
                    {filters.category && (
                      <div className="badge bg-blue-600 text-white border-none gap-2 px-4 py-3 font-semibold">
                        {filters.category}
                        <button
                          onClick={() => handleFilterChange("category", "")}
                          className="hover:text-red-300 text-lg"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    {filters.district && (
                      <div className="badge bg-purple-600 text-white border-none gap-2 px-4 py-3 font-semibold">
                        {filters.district}
                        <button
                          onClick={() => handleFilterChange("district", "")}
                          className="hover:text-red-300 text-lg"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    {filters.status && (
                      <div className="badge bg-emerald-600 text-white border-none gap-2 px-4 py-3 font-semibold">
                        {filters.status}
                        <button
                          onClick={() => handleFilterChange("status", "")}
                          className="hover:text-red-300 text-lg"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() =>
                        setFilters({ category: "", district: "", status: "" })
                      }
                      className="text-sm font-bold text-red-600 hover:text-red-700 hover:underline px-3 py-1 rounded-lg hover:bg-red-50 transition-all"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <p className="text-slate-700 font-semibold text-lg">
              {loading
                ? "⏳ Loading services..."
                : `📋 Showing ${services.length} of ${pagination.total} services`}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col justify-center items-center py-24 bg-white rounded-2xl shadow-lg border border-slate-200">
              <span className="loading loading-spinner loading-lg text-blue-600 mb-4"></span>
              <p className="text-slate-600 font-semibold text-lg">
                Loading amazing services for you...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-red-300 bg-red-50 px-6 py-6 text-red-900 shadow-md sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <svg
                  className="h-8 w-8 text-red-500 shrink-0"
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
                <div>
                  <p className="font-bold text-lg mb-1">
                    Oops! Something went wrong
                  </p>
                  <span className="text-base">{error}</span>
                </div>
              </div>
              <button
                onClick={fetchServices}
                className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-base font-bold text-white shadow-md transition hover:bg-red-700 hover:shadow-lg"
              >
                🔄 Retry
              </button>
            </div>
          )}

          {/* Services Grid */}
          {!loading && !error && services.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && services.length === 0 && (
            <div className="text-center py-24 bg-white rounded-2xl shadow-lg border border-slate-200">
              <div className="text-8xl mb-6">😞</div>
              <h3 className="text-3xl font-bold text-slate-700 mb-4">
                No Services Found
              </h3>
              <p className="text-slate-600 mb-6 text-lg max-w-md mx-auto">
                We couldn't find any services matching your criteria. Try
                adjusting your filters to discover more options.
              </p>
              <button
                onClick={() =>
                  setFilters({ category: "", district: "", status: "" })
                }
                className="btn bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg hover:shadow-xl px-8 py-3 text-lg font-bold rounded-full"
              >
                🔄 Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {!loading &&
            !error &&
            services.length > 0 &&
            pagination.totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="join">
                  <button
                    className="join-item btn"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    «
                  </button>

                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    // Show first 2, last 2, and current page with neighbors
                    if (
                      pageNum === 1 ||
                      pageNum === 2 ||
                      pageNum === pagination.totalPages ||
                      pageNum === pagination.totalPages - 1 ||
                      Math.abs(pageNum - pagination.page) <= 1
                    ) {
                      return (
                        <button
                          key={pageNum}
                          className={`join-item btn ${
                            pageNum === pagination.page ? "btn-active" : ""
                          }`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === 3 && pagination.page > 4) {
                      return (
                        <button
                          key={pageNum}
                          className="join-item btn btn-disabled"
                        >
                          ...
                        </button>
                      );
                    } else if (
                      pageNum === pagination.totalPages - 2 &&
                      pagination.page < pagination.totalPages - 3
                    ) {
                      return (
                        <button
                          key={pageNum}
                          className="join-item btn btn-disabled"
                        >
                          ...
                        </button>
                      );
                    }
                    return null;
                  })}

                  <button
                    className="join-item btn"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    »
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
      <Footer />
    </>
  );
}
