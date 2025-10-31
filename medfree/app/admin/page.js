import { Suspense } from "react";
import { getUserMetadata } from "@/lib/auth";
import {
  getServicesCollection,
  getRegistrationsCollection,
} from "@/lib/mongodb";

async function getAnalyticsData() {
  try {
    const servicesCollection = await getServicesCollection();
    const registrationsCollection = await getRegistrationsCollection();

    // Get total active services
    const totalServices = await servicesCollection.countDocuments({
      isActive: true,
    });

    // Get total registrations this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const totalRegistrations = await registrationsCollection.countDocuments({
      registeredAt: { $gte: startOfMonth },
      status: { $ne: "cancelled" },
    });

    // Get most popular category
    const categoryStats = await servicesCollection
      .aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ])
      .toArray();

    const mostPopularCategory = categoryStats[0]?._id || "N/A";

    // Calculate average capacity utilization
    const capacityStats = await servicesCollection
      .aggregate([
        { $match: { isActive: true, capacity: { $gt: 0 } } },
        {
          $project: {
            utilization: {
              $multiply: [{ $divide: ["$registeredCount", "$capacity"] }, 100],
            },
          },
        },
        {
          $group: {
            _id: null,
            avgUtilization: { $avg: "$utilization" },
          },
        },
      ])
      .toArray();

    const avgCapacityUtilization = Math.round(
      capacityStats[0]?.avgUtilization || 0
    );

    // Get services by category for chart
    const servicesByCategory = await servicesCollection
      .aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    return {
      totalServices,
      totalRegistrations,
      mostPopularCategory,
      avgCapacityUtilization,
      servicesByCategory,
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return {
      totalServices: 0,
      totalRegistrations: 0,
      mostPopularCategory: "N/A",
      avgCapacityUtilization: 0,
      servicesByCategory: [],
    };
  }
}

async function AnalyticsDashboard() {
  const user = await getUserMetadata();
  const data = await getAnalyticsData();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Here&apos;s what&apos;s happening with your health services today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Services */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">
                Active Services
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {data.totalServices}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏥</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Total active health services
          </p>
        </div>

        {/* Total Registrations */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Registrations</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {data.totalRegistrations}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">This month</p>
        </div>

        {/* Most Popular Category */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">
                Popular Category
              </p>
              <p className="text-xl font-bold text-gray-900 mt-2">
                {data.mostPopularCategory}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Most listed services</p>
        </div>

        {/* Capacity Utilization */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Avg. Capacity</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {data.avgCapacityUtilization}%
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">Registration fill rate</p>
        </div>
      </div>

      {/* Services by Category Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          Services by Category
        </h2>
        <div className="space-y-4">
          {data.servicesByCategory.map((item) => {
            const percentage = (item.count / data.totalServices) * 100;
            return (
              <div key={item._id}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 font-medium">{item._id}</span>
                  <span className="text-gray-600">{item.count} services</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-emerald-500 h-3 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/services/new"
            className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <span className="text-xl">➕</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Create Service</p>
              <p className="text-sm text-gray-600">Add new health service</p>
            </div>
          </a>

          <a
            href="/admin/services"
            className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <span className="text-xl">📝</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Manage Services</p>
              <p className="text-sm text-gray-600">View & edit services</p>
            </div>
          </a>

          <a
            href="/admin/registrations"
            className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all group">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <span className="text-xl">👥</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">View Registrations</p>
              <p className="text-sm text-gray-600">Check attendees</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading dashboard...</p>
          </div>
        </div>
      }>
      <AnalyticsDashboard />
    </Suspense>
  );
}
