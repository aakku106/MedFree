import { getServicesCollection } from "@/lib/mongodb";
import Link from "next/link";
import { checkAdminRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminServicesPage({ searchParams }) {
  // Check admin access
  const isAdmin = await checkAdminRole();
  if (!isAdmin) {
    redirect("/?error=unauthorized");
  }

  // Get search and filter params
  const search = searchParams.search || "";
  const category = searchParams.category || "";
  const status = searchParams.status || "";
  const page = parseInt(searchParams.page || "1");
  const limit = 25;
  const skip = (page - 1) * limit;

  // Build query
  const query = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  if (category) {
    query.category = category;
  }
  if (status === "active") {
    query.isActive = { $ne: false };
  } else if (status === "inactive") {
    query.isActive = false;
  }

  // Fetch services
  const servicesCollection = await getServicesCollection();
  const services = await servicesCollection
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  const totalServices = await servicesCollection.countDocuments(query);
  const totalPages = Math.ceil(totalServices / limit);

  // Get unique categories for filter
  const allCategories = await servicesCollection.distinct("category");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600 mt-1">
            Manage all health service listings
          </p>
        </div>
        <Link
          href="/admin/services/create"
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
          + Create New Service
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <form method="GET" className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by title or description..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              defaultValue={category}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option value="">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              defaultValue={status}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-4 flex gap-2">
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              Apply Filters
            </button>
            <Link
              href="/admin/services"
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Clear
            </Link>
          </div>
        </form>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">No services found</p>
                      <p className="text-sm mt-1">
                        Try adjusting your filters or create a new service
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service._id.toString()} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {service.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {service.location?.city}, {service.location?.district}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">
                        {service.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(service.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {service.registeredCount || 0} / {service.capacity}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          service.isActive !== false
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                        {service.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <Link
                        href={`/services/${service._id.toString()}`}
                        className="text-emerald-600 hover:text-emerald-900">
                        View
                      </Link>
                      <Link
                        href={`/admin/services/edit/${service._id.toString()}`}
                        className="text-blue-600 hover:text-blue-900">
                        Edit
                      </Link>
                      <Link
                        href={`/admin/services/delete/${service._id.toString()}`}
                        className="text-red-600 hover:text-red-900">
                        Delete
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {skip + 1} to {Math.min(skip + limit, totalServices)} of{" "}
              {totalServices} services
            </div>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`?page=${page - 1}${search ? `&search=${search}` : ""}${
                    category ? `&category=${category}` : ""
                  }${status ? `&status=${status}` : ""}`}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Previous
                </Link>
              )}
              <span className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`?page=${page + 1}${search ? `&search=${search}` : ""}${
                    category ? `&category=${category}` : ""
                  }${status ? `&status=${status}` : ""}`}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
