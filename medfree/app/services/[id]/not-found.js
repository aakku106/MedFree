import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Service Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The service you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <a
            href="/services"
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors">
            Browse All Services
          </a>
        </div>
      </div>
    </>
  );
}
