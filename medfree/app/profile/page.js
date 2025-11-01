import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const profileSections = [
    {
      title: "My Registrations",
      description: "View your registered services and QR codes",
      icon: Calendar,
      href: "/profile/registrations",
      color: "bg-blue-50 text-blue-600 border-blue-200",
      hoverColor: "hover:bg-blue-100",
    },
    {
      title: "Saved Services",
      description: "Services you&apos;ve bookmarked for later",
      icon: Heart,
      href: "/profile/saved",
      color: "bg-red-50 text-red-600 border-red-200",
      hoverColor: "hover:bg-red-100",
    },
    {
      title: "Notifications",
      description: "Manage your notification preferences",
      icon: Bell,
      href: "/profile/notifications",
      color: "bg-purple-50 text-purple-600 border-purple-200",
      hoverColor: "hover:bg-purple-100",
    },
    {
      title: "Offline Cache",
      description: "Services cached for offline access",
      icon: Database,
      href: "/profile/cached",
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      hoverColor: "hover:bg-emerald-100",
    },
    {
      title: "Settings",
      description: "Update preferences and account settings",
      icon: Settings,
      href: "/profile/settings",
      color: "bg-gray-50 text-gray-600 border-gray-200",
      hoverColor: "hover:bg-gray-100",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 bg-emerald-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.fullName || user.firstName || "Welcome"}
                </h1>
                <p className="text-gray-600">
                  {user.emailAddresses?.[0]?.emailAddress}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Activity className="h-4 w-4 text-emerald-600" />
              <span>Manage your healthcare services and preferences</span>
            </div>
          </div>

          {/* Profile Sections Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {profileSections.map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className={`group bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all ${section.hoverColor} hover:shadow-md`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg border ${section.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                          {section.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 transition-colors shrink-0 mt-1" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-emerald-900 mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/services"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                Browse Services
              </Link>
              <Link
                href="/profile/settings"
                className="px-4 py-2 bg-white text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium">
                Update Preferences
              </Link>
              <Link
                href="/profile/notifications"
                className="px-4 py-2 bg-white text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium">
                Manage Notifications
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
