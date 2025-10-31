"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ServiceCard from "@/components/ServiceCard";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    fetchServices();
  }, [filters, pagination.page]);

  const fetchServices = async () => {
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

      const response = await axios.get(`/api/services?${params}`);

      if (response.data.success) {
        setServices(response.data.data);
        setPagination((prev) => ({
          ...prev,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages,
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load services");
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-16">
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
        {/* Filters Section */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title mb-4">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
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
                  <span className="label-text font-medium">Category</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }>
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
                  <span className="label-text font-medium">District</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={filters.district}
                  onChange={(e) =>
                    handleFilterChange("district", e.target.value)
                  }>
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
                  <span className="label-text font-medium">Status</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={filters.status}
                  onChange={(e) =>
                    handleFilterChange("status", e.target.value)
                  }>
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.category || filters.district || filters.status) && (
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-sm font-medium">Active Filters:</span>
                {filters.category && (
                  <div className="badge badge-primary gap-2">
                    {filters.category}
                    <button
                      onClick={() => handleFilterChange("category", "")}
                      className="hover:text-error">
                      ✕
                    </button>
                  </div>
                )}
                {filters.district && (
                  <div className="badge badge-secondary gap-2">
                    {filters.district}
                    <button
                      onClick={() => handleFilterChange("district", "")}
                      className="hover:text-error">
                      ✕
                    </button>
                  </div>
                )}
                {filters.status && (
                  <div className="badge badge-accent gap-2">
                    {filters.status}
                    <button
                      onClick={() => handleFilterChange("status", "")}
                      className="hover:text-error">
                      ✕
                    </button>
                  </div>
                )}
                <button
                  onClick={() =>
                    setFilters({ category: "", district: "", status: "" })
                  }
                  className="text-sm text-error hover:underline">
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
          <div className="alert alert-error shadow-lg">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
            <button onClick={fetchServices} className="btn btn-sm">
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
              viewBox="0 0 24 24">
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
              className="btn btn-primary">
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
                  disabled={pagination.page === 1}>
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
                        onClick={() => handlePageChange(pageNum)}>
                        {pageNum}
                      </button>
                    );
                  } else if (pageNum === 3 && pagination.page > 4) {
                    return (
                      <button
                        key={pageNum}
                        className="join-item btn btn-disabled">
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
                        className="join-item btn btn-disabled">
                        ...
                      </button>
                    );
                  }
                  return null;
                })}

                <button
                  className="join-item btn"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}>
                  »
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
