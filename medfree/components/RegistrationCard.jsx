"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";

export default function RegistrationCard({ registration, type }) {
  const [showQR, setShowQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isCanceling, setIsCanceling] = useState(false);
  const router = useRouter();

  const service = registration.service;

  // Calculate time until service
  const getTimeUntil = () => {
    const now = new Date();
    const serviceDate = new Date(service.date);
    const diffMs = serviceDate - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (diffDays > 0) {
      return `In ${diffDays} day${diffDays !== 1 ? "s" : ""}`;
    } else if (diffHours > 0) {
      return `In ${diffHours} hour${diffHours !== 1 ? "s" : ""}`;
    } else if (diffMs > 0) {
      return "Starting soon";
    } else {
      return "Completed";
    }
  };

  // Generate QR Code
  const handleShowQR = async () => {
    if (!qrCodeUrl) {
      try {
        const url = await QRCode.toDataURL(registration.registrationCode, {
          width: 300,
          color: {
            dark: "#059669",
          },
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error("Failed to generate QR code:", err);
      }
    }
    setShowQR(true);
  };

  // Cancel registration
  const handleCancel = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel this registration? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsCanceling(true);

    try {
      const res = await fetch(`/api/services/${service._id}/register`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to cancel registration");
      }

      // Refresh the page to show updated data
      router.refresh();
    } catch (err) {
      alert("Failed to cancel registration. Please try again.");
      setIsCanceling(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Status Badge */}
        <div
          className={`px-4 py-2 text-xs font-semibold ${
            type === "upcoming"
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
              : "bg-gray-100 text-gray-600"
          }`}>
          {type === "upcoming" ? (
            <div className="flex items-center justify-between">
              <span>{getTimeUntil()}</span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Active
              </span>
            </div>
          ) : (
            "Completed"
          )}
        </div>

        {/* Service Info */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
            {service?.title || "Service Not Found"}
          </h3>

          {service && (
            <>
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mt-0.5 text-gray-400 shrink-0"
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
                  <span>
                    {new Date(service.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mt-0.5 text-gray-400 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    {service.timeStart} - {service.timeEnd}
                  </span>
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 mt-0.5 text-gray-400 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  <span>
                    {service.location?.city}, {service.location?.district}
                  </span>
                </div>
              </div>

              {/* Registration Details */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Registration Code</span>
                  <span className="font-mono font-semibold text-emerald-600">
                    {registration.registrationCode}
                  </span>
                </div>
                {registration.familyMembers &&
                  registration.familyMembers.length > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Family Members</span>
                      <span className="font-semibold text-gray-900">
                        {registration.familyMembers.length}
                      </span>
                    </div>
                  )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {type === "upcoming" && (
                  <>
                    <button
                      onClick={handleShowQR}
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                        />
                      </svg>
                      View QR
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isCanceling}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                      {isCanceling ? "Canceling..." : "Cancel"}
                    </button>
                  </>
                )}
                {type === "past" && (
                  <button
                    onClick={handleShowQR}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                    View QR
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 relative">
              <button
                onClick={() => setShowQR(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="text-center">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Registration QR Code</h3>
                <p className="text-emerald-50 mt-1">Show this at check-in</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* QR Code */}
              <div className="bg-white border-4 border-emerald-600 rounded-2xl p-6 mb-6">
                {qrCodeUrl && (
                  <img src={qrCodeUrl} alt="QR Code" className="w-full h-auto" />
                )}
              </div>

              {/* Registration Code */}
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-2">Registration Code</p>
                <p className="text-2xl font-mono font-bold text-gray-900 tracking-wider">
                  {registration.registrationCode}
                </p>
              </div>

              {/* Service Details */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <h4 className="font-semibold text-gray-900 mb-3">{service?.title}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {new Date(service?.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    {service?.timeStart} - {service?.timeEnd}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.download = `registration-${registration.registrationCode}.png`;
                    link.href = qrCodeUrl;
                    link.click();
                  }}
                  className="flex-1 px-4 py-2.5 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
