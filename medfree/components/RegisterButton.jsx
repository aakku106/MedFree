"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function RegisterButton({ service }) {
  const router = useRouter();
  const { isSignedIn, userId } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    userName: "",
    userPhone: "",
    familyMembers: [""],
  });

  // Calculate spots remaining
  const spotsLeft = service.capacity - (service.registeredCount || 0);
  const isFull = spotsLeft <= 0;
  const isAlmostFull = spotsLeft <= 10 && spotsLeft > 0;

  const handleRegister = () => {
    if (!isSignedIn) {
      router.push(`/sign-in?redirect_url=/services/${service._id}`);
      return;
    }
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFamilyMemberChange = (index, value) => {
    const newMembers = [...formData.familyMembers];
    newMembers[index] = value;
    setFormData({
      ...formData,
      familyMembers: newMembers,
    });
  };

  const addFamilyMember = () => {
    setFormData({
      ...formData,
      familyMembers: [...formData.familyMembers, ""],
    });
  };

  const removeFamilyMember = (index) => {
    const newMembers = formData.familyMembers.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      familyMembers: newMembers,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/services/${service._id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: formData.userName,
          userPhone: formData.userPhone,
          familyMembers: formData.familyMembers.filter((m) => m.trim() !== ""),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to register");
      }

      const data = await response.json();

      // Redirect to confirmation page
      router.push(
        `/services/${service._id}/confirmation?code=${data.registrationCode}`
      );
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Capacity Badge */}
      <div className="mb-4">
        {isFull ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-800 font-bold text-lg">🚫 Service Full</p>
            <p className="text-red-600 text-sm mt-1">
              No spots available. Check back later or contact organizers.
            </p>
          </div>
        ) : isAlmostFull ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-yellow-800 font-bold text-lg">
              ⚡ Only {spotsLeft} spots left!
            </p>
            <p className="text-yellow-600 text-sm mt-1">
              Register now before it fills up
            </p>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
            <p className="text-emerald-800 font-bold text-lg">
              ✓ {spotsLeft} spots available
            </p>
            <p className="text-emerald-600 text-sm mt-1">
              out of {service.capacity} total
            </p>
          </div>
        )}
      </div>

      {/* Register Button */}
      {!isFull && (
        <button
          onClick={handleRegister}
          className="w-full px-6 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-bold text-lg shadow-lg hover:shadow-xl">
          Register for this Service
        </button>
      )}

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slideUp"
            onClick={(e) => e.stopPropagation()}>
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-6 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 rounded-full p-3">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Complete Registration
                  </h2>
                  <p className="text-emerald-50 text-sm mt-1">
                    Fill in your details to secure your spot
                  </p>
                </div>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
              {/* Service Info */}
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-5 mb-6 border border-emerald-100">
                <div className="flex items-start gap-3">
                  <div className="shrink-0">
                    <svg
                      className="w-5 h-5 text-emerald-600 mt-0.5"
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
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-lg">
                      {service.title}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
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
                        {new Date(service.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
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
                        {service.timeStart} - {service.timeEnd}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
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
                        {service.location?.city}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-red-500 mt-0.5 mr-3 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Personal Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.userName}
                      onChange={(e) =>
                        setFormData({ ...formData, userName: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.userPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, userPhone: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                {/* Family Members Section */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-emerald-600"
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
                        Family Members
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 ml-6">
                        Add names of family members attending with you
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addFamilyMember}
                      className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add
                    </button>
                  </div>

                  {formData.familyMembers.length > 0 && (
                    <div className="space-y-2">
                      {formData.familyMembers.map((member, index) => (
                        <div
                          key={index}
                          className="flex gap-2 items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <input
                            type="text"
                            value={member}
                            onChange={(e) =>
                              handleFamilyMemberChange(index, e.target.value)
                            }
                            placeholder={`Family member ${index + 1}`}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                          />
                          {formData.familyMembers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFamilyMember(index)}
                              className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Capacity Info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-blue-600 mt-0.5 shrink-0"
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
                    <div className="text-sm">
                      <p className="font-medium text-blue-900">
                        {spotsLeft} spots remaining
                      </p>
                      <p className="text-blue-700 mt-1">
                        Your registration is subject to availability
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-5 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-600 font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Complete Registration
                      </>
                    )}
                  </button>
                </div>
                    className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50">
                    {loading ? "Registering..." : "Confirm Registration"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
