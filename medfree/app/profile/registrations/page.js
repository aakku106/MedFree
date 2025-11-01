import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import RegistrationCard from "@/components/RegistrationCard";

export default async function UserRegistrationsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch user's registrations
  const client = await clientPromise;
  const db = client.db("medfree");

  const registrations = await db
    .collection("registrations")
    .find({ userId })
    .sort({ registeredAt: -1 })
    .toArray();

  // Fetch service details for each registration
  const serviceIds = registrations.map((r) => new ObjectId(r.serviceId));
  const services = await db
    .collection("services")
    .find({ _id: { $in: serviceIds } })
    .toArray();

  // Map services to registrations
  const registrationsWithServices = registrations.map((reg) => {
    const service = services.find(
      (s) => s._id.toString() === reg.serviceId.toString()
    );
    return {
      ...reg,
      service,
    };
  });

  // Split into upcoming and past
  const now = new Date();
  const upcomingRegistrations = registrationsWithServices.filter((r) => {
    const serviceDate = new Date(r.service?.date);
    return serviceDate >= now;
  });

  const pastRegistrations = registrationsWithServices.filter((r) => {
    const serviceDate = new Date(r.service?.date);
    return serviceDate < now;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/profile"
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              My Registrations
            </h1>
            <p className="mt-2 text-gray-600">
              View and manage your healthcare service registrations
            </p>
          </div>

          {/* Upcoming Registrations */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <svg
                  className="w-6 h-6 text-emerald-600"
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
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Upcoming Services
                </h2>
                <p className="text-sm text-gray-600">
                  {upcomingRegistrations.length} active registration
                  {upcomingRegistrations.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {upcomingRegistrations.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingRegistrations.map((registration) => (
                  <RegistrationCard
                    key={registration._id.toString()}
                    registration={registration}
                    type="upcoming"
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="max-w-sm mx-auto">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Upcoming Services
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You don&apos;t have any upcoming service registrations.
                    Browse available services to register.
                  </p>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                    <svg
                      className="w-5 h-5"
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
                    Browse Services
                  </Link>
                </div>
              </div>
            )}
          </section>

          {/* Past Registrations */}
          {pastRegistrations.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <svg
                    className="w-6 h-6 text-gray-600"
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
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Past Services
                  </h2>
                  <p className="text-sm text-gray-600">
                    {pastRegistrations.length} completed registration
                    {pastRegistrations.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastRegistrations.map((registration) => (
                  <RegistrationCard
                    key={registration._id.toString()}
                    registration={registration}
                    type="past"
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
