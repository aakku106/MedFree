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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Register for Service
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600">
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
              </div>

              {/* Service Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="font-semibold text-gray-900">{service.title}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(service.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  • {service.timeStart} - {service.timeEnd}
                </p>
                <p className="text-sm text-gray-600">
                  {service.location?.city}, {service.location?.district}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  {error}
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Ram Prasad Sharma"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="userPhone"
                    value={formData.userPhone}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 9841234567"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                {/* Family Members */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Family Members (Optional)
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    Add names of family members attending with you
                  </p>

                  {formData.familyMembers.map((member, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={member}
                        onChange={(e) =>
                          handleFamilyMemberChange(index, e.target.value)
                        }
                        placeholder={`Family member ${index + 1}`}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      {formData.familyMembers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFamilyMember(index)}
                          className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                          Remove
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addFamilyMember}
                    className="mt-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                    + Add Another Family Member
                  </button>
                </div>

                {/* Capacity Warning */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> {spotsLeft} spots remaining. Your
                    registration is subject to availability.
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
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
