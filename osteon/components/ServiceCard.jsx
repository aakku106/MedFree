import Link from "next/link";

export default function ServiceCard({ service }) {
  // Handle both old and new schema
  const { 
    _id, 
    name, 
    title, 
    category, 
    location, 
    serviceDetails,
    date, 
    description, 
    status 
  } = service;
  
  const displayName = name || title;
  const displayLocation = location || serviceDetails?.location;
  const displayDate = date || (serviceDetails?.nepaliDate ? { nepaliDate: serviceDetails.nepaliDate } : null);

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

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "health camp":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        );
      case "free medication":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        );
      case "checkup":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        );
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-base-200">
      <div className="card-body">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary p-3 rounded-lg">
              {getCategoryIcon(category)}
            </div>
            <div>
              <h3 className="card-title text-lg">{displayName}</h3>
              <p className="text-sm text-slate-500">{category}</p>
            </div>
          </div>
          {status && (
            <div className={`badge ${getStatusBadge(status)} gap-1`}>
              {status}
            </div>
          )}
        </div>

        <p className="text-slate-600 line-clamp-2 min-h-12">
          {description || "No description available"}
        </p>

        <div className="divider my-2"></div>

        <div className="flex flex-col gap-2 text-sm">
          {displayLocation && (
            <div className="flex items-center gap-2 text-slate-600">
              <svg
                className="w-4 h-4 text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
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
              <span>
                {displayLocation.district || displayLocation.address?.split(',')[0] || "Location TBA"}
              </span>
            </div>
          )}

          {displayDate && (
            <div className="flex items-center gap-2 text-slate-600">
              <svg
                className="w-4 h-4 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                {displayDate.start 
                  ? new Date(displayDate.start).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : displayDate.nepaliDate || "Date TBA"
                }
              </span>
            </div>
          )}
        </div>

        <div className="card-actions justify-end mt-4">
          <Link href={`/services/${_id}`} className="btn btn-primary btn-sm">
            View Details
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
