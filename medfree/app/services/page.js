"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ServiceCard from "@/components/ServiceCard";
import { getUserLocation, debounce } from "@/lib/utils";

// Cache configuration for localStorage
// Data persists across browser sessions and reloads
// Cache is automatically cleared after 5 minutes or when filters change
const CACHE_KEY = "medfree_services_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHE_VERSION = "v1"; // Increment this to invalidate all caches

// Utility to clear cache manually (useful for debugging)
// Usage in console: window.clearMedfreeCache()
if (typeof window !== "undefined") {
  window.clearMedfreeCache = () => {
    localStorage.removeItem(CACHE_KEY);
    console.log("🗑️ Medfree cache cleared!");
  };
}

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isMounted = useRef(false);
  const cacheChecked = useRef(false);
  const servicesRef = useRef([]);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(
    searchParams.get("diagnosis") || "all"
  );

  // Categories and diagnosis types (these would ideally come from the API)
  const categories = [
    "All",
    "General Health",
    "Dental Care",
    "Eye Care",
    "Women's Health",
    "Child Health",
    "Mental Health",
  ];

  const diagnosisTypes = [
    "All",
    "Blood Pressure Check",
    "Diabetes Screening",
    "General Checkup",
    "Vaccination",
    "Dental Checkup",
    "Eye Test",
  ];

  // Request location on mount (check cache first)
  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;

    const requestLocation = async () => {
      // Try to restore from localStorage cache
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp, filters, version } = JSON.parse(cached);
          const now = Date.now();

          // Check if cache is still valid and filters match current URL params
          const currentCategory = searchParams.get("category") || "all";
          const currentDiagnosis = searchParams.get("diagnosis") || "all";
          const currentSearch = searchParams.get("q") || "";

          // Validate cache: version match, not expired, filters match
          if (
            version === CACHE_VERSION &&
            now - timestamp < CACHE_DURATION &&
            filters.category === currentCategory &&
            filters.diagnosis === currentDiagnosis &&
            filters.search === currentSearch
          ) {
            console.log("✅ Restored from localStorage cache");
            setServices(data.services);
            setTotalCount(data.total);
            setHasMore(data.hasMore);
            setPage(data.page);
            servicesRef.current = data.services;
            setLoading(false);
            cacheChecked.current = true;

            // Still get location for future fetches, but don't wait
            getUserLocation().then((location) => {
              if (location) {
                setUserLocation(location);
                setShowLocationPrompt(false);
              } else {
                setLocationDenied(true);
                setShowLocationPrompt(false);
              }
            });
            return;
          } else {
            console.log(
              "🔄 Cache expired or filters changed, fetching fresh data"
            );
            // Clear expired cache
            localStorage.removeItem(CACHE_KEY);
          }
        }
      } catch (err) {
        console.log("❌ Cache restore failed:", err);
        // Clear corrupted cache
        localStorage.removeItem(CACHE_KEY);
      }

      // Get user location
      const location = await getUserLocation();
      if (location) {
        setUserLocation(location);
        setShowLocationPrompt(false);
      } else {
        setLocationDenied(true);
        setShowLocationPrompt(false);
      }

      cacheChecked.current = true;
    };

    requestLocation();
  }, [searchParams]); // Depend on searchParams instead of individual filter states

  // Fetch services
  const fetchServices = useCallback(
    async (pageNum = 1, reset = false) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: "12",
        });

        if (searchQuery) params.append("q", searchQuery);
        if (selectedCategory !== "all")
          params.append("category", selectedCategory);
        if (selectedDiagnosis !== "all")
          params.append("diagnosis", selectedDiagnosis);
        if (userLocation) {
          params.append("lat", userLocation.latitude.toString());
          params.append("lon", userLocation.longitude.toString());
        }

        const response = await fetch(`/api/services?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch services");

        const data = await response.json();

        if (reset) {
          setServices(data.services);
          servicesRef.current = data.services;
        } else {
          const newServices = [...servicesRef.current, ...data.services];
          setServices(newServices);
          servicesRef.current = newServices;
        }

        setHasMore(data.hasMore);
        setTotalCount(data.total);
        setPage(pageNum);

        // Cache the results in localStorage
        try {
          const cacheData = {
            data: {
              services: servicesRef.current,
              total: data.total,
              hasMore: data.hasMore,
              page: pageNum,
            },
            timestamp: Date.now(),
            filters: {
              category: selectedCategory,
              diagnosis: selectedDiagnosis,
              search: searchQuery,
            },
            version: CACHE_VERSION,
          };

          localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
          console.log("💾 Saved to localStorage cache");
        } catch (err) {
          console.log("❌ Cache save failed:", err);
          // If localStorage is full, clear old cache and try again
          if (err.name === "QuotaExceededError") {
            localStorage.removeItem(CACHE_KEY);
            try {
              localStorage.setItem(
                CACHE_KEY,
                JSON.stringify({
                  data: {
                    services: servicesRef.current,
                    total: data.total,
                    hasMore: data.hasMore,
                    page: pageNum,
                  },
                  timestamp: Date.now(),
                  filters: {
                    category: selectedCategory,
                    diagnosis: selectedDiagnosis,
                    search: searchQuery,
                  },
                  version: CACHE_VERSION,
                })
              );
            } catch (retryErr) {
              console.log("❌ Cache save retry failed:", retryErr);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, selectedCategory, selectedDiagnosis, userLocation]
  );

  // Initial fetch and refetch on filter changes
  useEffect(() => {
    // Skip initial fetch if cache was just restored
    if (cacheChecked.current && services.length > 0) {
      cacheChecked.current = false;
      return;
    }

    fetchServices(1, true);
  }, [fetchServices, services.length]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedDiagnosis !== "all") params.set("diagnosis", selectedDiagnosis);

    const queryString = params.toString();
    router.replace(`/services${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  }, [searchQuery, selectedCategory, selectedDiagnosis, router]);

  // Debounced search
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    const timeoutId = setTimeout(() => {
      setSearchQuery(value);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchServices(page + 1, false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        {/* Location Prompt Banner */}
        {locationDenied && (
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm text-blue-800">
                  Showing services from all over Nepal. Enable location to see
                  nearby services first.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Free Medical Services
            </h1>
            <p className="text-gray-600">
              {totalCount > 0
                ? `${totalCount} services available`
                : "Browse available health services"}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search services by name, location, or type..."
                defaultValue={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                  {categories.map((cat) => (
                    <option
                      key={cat}
                      value={cat.toLowerCase().replace(/\s+/g, "-")}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis Type
                </label>
                <select
                  value={selectedDiagnosis}
                  onChange={(e) => setSelectedDiagnosis(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                  {diagnosisTypes.map((type) => (
                    <option
                      key={type}
                      value={type.toLowerCase().replace(/\s+/g, "-")}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {loading && page === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No services found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <ServiceCard
                    key={service._id}
                    service={service}
                    userLocation={userLocation}
                  />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="mt-12 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-8 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
