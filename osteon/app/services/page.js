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
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <section className="bg-linear-to-r from-cyan-600 to-teal-600 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              Free Medical Services
            </h1>
            <p className="text-xl text-center max-w-2xl mx-auto opacity-90">
              Browse available government healthcare services across Nepal
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Location Status */}
          {locationState.status === "pending" && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-5 py-4 text-cyan-900 shadow-sm">
              <span className="loading loading-spinner loading-sm text-cyan-600"></span>
              <span className="font-medium">
                Detecting your location to find nearby services…
              </span>
            </div>
          )}

          {(locationState.status === "denied" ||
            locationState.status === "unsupported") && (
            <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm sm:text-base">
                {locationState.message ||
                  "We couldn't use your location. Showing services across Nepal, sorted alphabetically."}
              </span>
              {locationState.status === "denied" && (
                <button
                  onClick={handleLocationRetry}
                  className="inline-flex items-center justify-center rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                >
                  Retry location
                </button>
              )}
            </div>
          )}

          {locationState.status === "granted" && locationMeta?.locationSort && (
            <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-900 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm sm:text-base">
                Showing services closest to you first.
                {locationMeta?.totalWithCoordinates === 0 &&
                  " Some listings do not include coordinates and appear after nearby results."}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-emerald-700 shadow-inner">
                {locationMeta?.totalWithCoordinates ?? 0} services with location
                data
              </span>
            </div>
          )}

          {/* Filters Section */}
          <div className="card mb-8 rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4 text-slate-900">
                <svg
                  className="w-6 h-6"
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
                Filter Services
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-slate-600">
                      Category
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full border-slate-300 bg-white text-slate-800 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
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
                    <span className="label-text font-medium text-slate-600">
                      District
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full border-slate-300 bg-white text-slate-800 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
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
                    <span className="label-text font-medium text-slate-600">
                      Status
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full border-slate-300 bg-white text-slate-800 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
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
                <div className="mt-4 flex flex-wrap items-center gap-2 text-slate-600">
                  <span className="text-sm font-semibold text-slate-700">
                    Active Filters:
                  </span>
                  {filters.category && (
                    <div className="badge badge-primary gap-2 text-white">
                      {filters.category}
                      <button
                        onClick={() => handleFilterChange("category", "")}
                        className="hover:text-error"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {filters.district && (
                    <div className="badge badge-secondary gap-2 text-white">
                      {filters.district}
                      <button
                        onClick={() => handleFilterChange("district", "")}
                        className="hover:text-error"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {filters.status && (
                    <div className="badge badge-accent gap-2 text-white">
                      {filters.status}
                      <button
                        onClick={() => handleFilterChange("status", "")}
                        className="hover:text-error"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() =>
                      setFilters({ category: "", district: "", status: "" })
                    }
                    className="text-sm font-semibold text-rose-600 hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-slate-600">
              {loading
                ? "Loading..."
                : `Showing ${services.length} of ${pagination.total} services`}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-900 shadow-sm sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <svg
                  className="h-6 w-6 text-rose-500"
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
                <span className="text-sm sm:text-base">{error}</span>
              </div>
              <button
                onClick={fetchServices}
                className="inline-flex w-full items-center justify-center rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:w-auto"
              >
                Retry
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
            <div className="text-center py-20">
              <svg
                className="w-24 h-24 mx-auto text-slate-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-2xl font-bold text-slate-600 mb-2">
                No Services Found
              </h3>
              <p className="text-slate-500 mb-4">
                Try adjusting your filters to find more services
              </p>
              <button
                onClick={() =>
                  setFilters({ category: "", district: "", status: "" })
                }
                className="btn btn-primary"
              >
                Clear Filters
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
