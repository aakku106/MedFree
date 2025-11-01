import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DebugPage() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            🔍 Clerk Session Debug
          </h1>

          <div className="space-y-6">
            {/* User ID */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                User ID
              </h2>
              <code className="block bg-gray-100 p-4 rounded text-sm">
                {userId}
              </code>
            </div>

            {/* Session Claims */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Session Claims (Full)
              </h2>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
                {JSON.stringify(sessionClaims, null, 2)}
              </pre>
            </div>

            {/* Metadata */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Metadata (What middleware checks)
              </h2>
              <code className="block bg-gray-100 p-4 rounded text-sm">
                {JSON.stringify(sessionClaims?.metadata, null, 2)}
              </code>
            </div>

            {/* Public Metadata */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Public Metadata
              </h2>
              <code className="block bg-gray-100 p-4 rounded text-sm">
                {JSON.stringify(sessionClaims?.publicMetadata, null, 2) ||
                  "null"}
              </code>
            </div>

            {/* Extracted Role */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Extracted Role (from metadata)
              </h2>
              <code className="block bg-emerald-100 p-4 rounded text-sm font-bold">
                {sessionClaims?.metadata?.role || "user"}
              </code>
            </div>

            {/* Extracted Role from Public Metadata */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Extracted Role (from publicMetadata)
              </h2>
              <code className="block bg-blue-100 p-4 rounded text-sm font-bold">
                {sessionClaims?.publicMetadata?.role || "user"}
              </code>
            </div>

            {/* Instructions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">
                📝 How to Set Role in Clerk:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800">
                <li>Go to Clerk Dashboard: https://dashboard.clerk.com</li>
                <li>Select your application</li>
                <li>Go to &quot;Users&quot; in the sidebar</li>
                <li>Click on your user</li>
                <li>
                  Scroll to &quot;Metadata&quot; section and click &quot;Edit
                  Public Metadata&quot;
                </li>
                <li>
                  Add this JSON:
                  <code className="block bg-white p-2 rounded mt-2">
                    {`{ "role": "admin" }`}
                  </code>
                </li>
                <li>Click &quot;Save&quot;</li>
                <li>Sign out and sign back in (or refresh this page)</li>
              </ol>
            </div>

            {/* Admin Access Status */}
            <div
              className={`p-6 rounded-lg ${
                sessionClaims?.publicMetadata?.role === "admin" ||
                sessionClaims?.publicMetadata?.role === "agent" ||
                sessionClaims?.metadata?.role === "admin" ||
                sessionClaims?.metadata?.role === "agent"
                  ? "bg-green-100 border border-green-300"
                  : "bg-red-100 border border-red-300"
              }`}>
              <h3 className="font-bold text-lg mb-2">
                {sessionClaims?.publicMetadata?.role === "admin" ||
                sessionClaims?.publicMetadata?.role === "agent" ||
                sessionClaims?.metadata?.role === "admin" ||
                sessionClaims?.metadata?.role === "agent"
                  ? "✅ Admin Access: GRANTED"
                  : "❌ Admin Access: DENIED"}
              </h3>
              <p className="text-sm">
                {sessionClaims?.publicMetadata?.role === "admin" ||
                sessionClaims?.publicMetadata?.role === "agent" ||
                sessionClaims?.metadata?.role === "admin" ||
                sessionClaims?.metadata?.role === "agent"
                  ? "You should be able to access /admin routes"
                  : 'Set your role to "admin" or "agent" in Clerk Dashboard'}
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex gap-4">
              <Link
                href="/admin"
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Try Admin Panel →
              </Link>
              <Link
                href="/services"
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Back to Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
