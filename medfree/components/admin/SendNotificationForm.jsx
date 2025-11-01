"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SendNotificationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    url: "",
    notificationType: "serviceReminders",
    targetAll: true,
    targetUserIds: "",
  });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setResult(null);

    try {
      const payload = {
        title: formData.title,
        body: formData.body,
        url: formData.url || "/",
        notificationType: formData.notificationType,
      };

      if (!formData.targetAll && formData.targetUserIds) {
        payload.targetUserIds = formData.targetUserIds
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id);
      }

      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send notification");
      }

      setResult({
        success: true,
        message: data.message,
        stats: data.stats,
      });

      // Reset form
      setFormData({
        title: "",
        body: "",
        url: "",
        notificationType: "serviceReminders",
        targetAll: true,
        targetUserIds: "",
      });
    } catch (error) {
      console.error("Send notification error:", error);
      setResult({
        success: false,
        message: error.message || "Failed to send notification",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g., Free Health Camp Tomorrow"
              maxLength={50}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.title.length}/50 characters
            </p>
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g., Your registered health service is starting at 9 AM tomorrow. Don't forget to bring your registration code!"
              rows={4}
              maxLength={200}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.body.length}/200 characters
            </p>
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link URL (Optional)
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="/services/123 or https://example.com"
            />
            <p className="mt-1 text-xs text-gray-500">
              Where users will be redirected when they click the notification
            </p>
          </div>

          {/* Notification Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.notificationType}
              onChange={(e) =>
                setFormData({ ...formData, notificationType: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required>
              <option value="serviceReminders">Service Reminders</option>
              <option value="newServices">New Services</option>
              <option value="updates">Service Updates</option>
              <option value="marketing">Marketing & Promotions</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Only users who enabled this notification type will receive it
            </p>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Target Audience
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={formData.targetAll}
                  onChange={() => setFormData({ ...formData, targetAll: true })}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  All subscribed users
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!formData.targetAll}
                  onChange={() =>
                    setFormData({ ...formData, targetAll: false })
                  }
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Specific users (by Clerk User ID)
                </span>
              </label>
            </div>

            {!formData.targetAll && (
              <div className="mt-3">
                <input
                  type="text"
                  value={formData.targetUserIds}
                  onChange={(e) =>
                    setFormData({ ...formData, targetUserIds: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="user_xxx, user_yyy, user_zzz"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter Clerk User IDs separated by commas
                </p>
              </div>
            )}
          </div>

          {/* Result Message */}
          {result && (
            <div
              className={`p-4 rounded-lg border ${
                result.success
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}>
              <div className="flex items-start gap-3">
                <svg
                  className={`w-5 h-5 mt-0.5 shrink-0 ${
                    result.success ? "text-emerald-600" : "text-red-600"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  {result.success ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  )}
                </svg>
                <div>
                  <p className="font-medium">{result.message}</p>
                  {result.stats && (
                    <div className="mt-2 text-sm space-y-1">
                      <p>Total Recipients: {result.stats.total}</p>
                      <p>Successfully Sent: {result.stats.success}</p>
                      {result.stats.failed > 0 && (
                        <p>Failed: {result.stats.failed}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            disabled={sending}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            {sending ? (
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
                Sending...
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
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                Send Notification
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
