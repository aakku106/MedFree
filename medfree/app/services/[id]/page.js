import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import RegisterButton from "@/components/RegisterButton";
import ServiceCacheWrapper from "@/components/ServiceCacheWrapper";
import { convertToNepaliDate } from "@/lib/utils";
import { getServicesCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

async function getService(id) {
  try {
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      console.error("Invalid ObjectId:", id);
      return null;
    }

    // Directly query database instead of fetching from API
    const collection = await getServicesCollection();
    const service = await collection.findOne({ _id: new ObjectId(id) });

    if (!service) {
      console.error("Service not found:", id);
      return null;
    }

    // Convert ObjectId to string for client components
    return {
      ...service,
      _id: service._id.toString(),
    };
  } catch (error) {
    console.error("Error fetching service:", error);
    return null;
  }
}

export default async function ServiceDetailPage({ params }) {
  const { id } = await params;
  const service = await getService(id);

  if (!service) {
    notFound();
  }

  const formattedDate = new Date(service.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Navbar />
      <ServiceCacheWrapper service={service} />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <Link
              href="/services"
              className="text-emerald-600 hover:text-emerald-700">
              ← Back to Services
            </Link>
          </nav>

          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-full">
                {service.category}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {service.title}
            </h1>

            <div className="flex flex-wrap gap-4 text-gray-600">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-emerald-500"
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
                <span>
                  {service.city}
                  {service.district && `, ${service.district}`}
                </span>
              </div>

              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-emerald-500"
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
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  What Its About
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* What It Checks */}
              {service.whatItChecks && service.whatItChecks.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    What It Checks
                  </h2>
                  <ul className="space-y-2">
                    {service.whatItChecks.map((check, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{check}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {service.requirements && service.requirements.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Requirements
                  </h2>
                  <ul className="space-y-2">
                    {service.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0"
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
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column - Logistics & Contact */}
            <div className="space-y-6">
              {/* Registration Card */}
              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl border-2 border-emerald-200 p-6 sticky top-24">
                <RegisterButton service={service} />
              </div>

              {/* Service Details Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Service Details
                </h3>

                <div className="space-y-4">
                  {/* Nepali Date */}
                  {service.dateNepali && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Date (Nepali)
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {service.dateNepali}
                      </p>
                    </div>
                  )}

                  {/* Time */}
                  {service.timeStart && service.timeEnd && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Time</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {service.timeStart} - {service.timeEnd}
                      </p>
                    </div>
                  )}

                  {/* Location */}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="text-gray-900 font-medium">
                      {service.address}
                    </p>
                  </div>

                  {/* Capacity */}
                  {service.capacity && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Capacity</p>
                      <p className="text-lg font-semibold text-gray-900">
                        Limited to {service.capacity} people
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              {(service.contactPerson ||
                service.contactPhone ||
                service.contactEmail) && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Contact Information
                  </h3>

                  <div className="space-y-3">
                    {service.contactPerson && (
                      <div>
                        <p className="text-sm text-gray-600">Contact Person</p>
                        <p className="text-gray-900 font-medium">
                          {service.contactPerson}
                        </p>
                      </div>
                    )}

                    {service.contactPhone && (
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <a
                          href={`tel:${service.contactPhone}`}
                          className="text-emerald-600 hover:text-emerald-700 font-medium">
                          {service.contactPhone}
                        </a>
                      </div>
                    )}

                    {service.contactEmail && (
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <a
                          href={`mailto:${service.contactEmail}`}
                          className="text-emerald-600 hover:text-emerald-700 font-medium break-all">
                          {service.contactEmail}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
