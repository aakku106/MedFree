"use client";

import { useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";

export default function ConfirmationPage({ params }) {
  const searchParams = useSearchParams();
  const registrationCode = searchParams.get("code");

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [serviceId, setServiceId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        setServiceId(id);

        // Fetch service details
        const serviceRes = await fetch(`/api/services/${id}`);
        if (serviceRes.ok) {
          const serviceData = await serviceRes.json();
          setService(serviceData);
        }

        // Generate QR code
        if (registrationCode) {
          const qrUrl = await QRCode.toDataURL(registrationCode, {
            width: 300,
            margin: 2,
            color: {
              dark: "#059669",
              light: "#FFFFFF",
            },
          });
          setQrCodeUrl(qrUrl);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [params, registrationCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-emerald-600"
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
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Registration Confirmed!
          </h1>
          <p className="text-gray-600">
            Your spot has been secured for this health service
          </p>
        </div>

        {/* Confirmation Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* QR Code Section */}
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 p-8 text-center border-b border-gray-200">
            {qrCodeUrl && (
              <div className="inline-block bg-white p-4 rounded-xl shadow-md">
                <img
                  src={qrCodeUrl}
                  alt="Registration QR Code"
                  className="w-64 h-64 mx-auto"
                />
              </div>
            )}
            <p className="mt-4 text-sm font-medium text-gray-700">
              Show this QR code at the service location
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Code: {registrationCode}
            </p>
          </div>

          {/* Service Details */}
          {service && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Service Details
              </h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-emerald-600 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Service</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {service.title}
                    </p>
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full">
                      {service.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-emerald-600 mt-0.5"
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
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(service.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-gray-700">
                      {service.timeStart} - {service.timeEnd}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-emerald-600 mt-0.5"
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
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {service.location?.address}
                    </p>
                    <p className="text-gray-700">
                      {service.location?.city}, {service.location?.district}
                    </p>
                  </div>
                </div>

                {service.contact && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-emerald-600 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Contact</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {service.contact.person}
                      </p>
                      <p className="text-gray-700">{service.contact.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Important Reminders */}
          <div className="bg-yellow-50 border-t border-yellow-100 p-6">
            <h3 className="font-bold text-yellow-900 mb-3">
              ⚠️ Important Reminders
            </h3>
            <ul className="space-y-2 text-sm text-yellow-800">
              <li className="flex items-start">
                <span className="font-bold mr-2">•</span>
                <span>Please arrive 10-15 minutes before the service time</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">•</span>
                <span>Bring this QR code (screenshot or print)</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">•</span>
                <span>Carry a valid ID card for verification</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">•</span>
                <span>
                  You'll receive a reminder notification 24 hours before
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/profile/registrations"
            className="flex-1 px-6 py-3 bg-emerald-600 text-white text-center rounded-lg hover:bg-emerald-700 transition-colors font-medium">
            View My Registrations
          </Link>
          <Link
            href="/services"
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 text-center rounded-lg hover:bg-gray-300 transition-colors font-medium">
            Browse More Services
          </Link>
        </div>

        {/* Download Options */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">Save for later:</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.download = `registration-${registrationCode}.png`;
                link.href = qrCodeUrl;
                link.click();
              }}
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
              Download QR Code
            </button>
            <button
              onClick={() => window.print()}
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
              Print Confirmation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
