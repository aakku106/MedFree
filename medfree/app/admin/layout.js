"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Services", href: "/admin/services", icon: "🏥" },
    { name: "Registrations", href: "/admin/registrations", icon: "📋" },
    { name: "Notifications", href: "/admin/notifications", icon: "🔔" },
    { name: "Analytics", href: "/admin/analytics", icon: "📈" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="flex items-center space-x-2">
                <span className="text-2xl">🏥</span>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">MedFree</h1>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <Link
                href="/services"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                View Public Site
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Secondary Navigation */}
        <nav className="mb-8">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                    ${
                      isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}>
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Page Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
