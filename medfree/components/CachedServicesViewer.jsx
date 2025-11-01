'use client';

import { useState, useEffect } from 'react';
import { getCachedServices } from '@/lib/pwa';
import { Calendar, MapPin, Users, Database } from 'lucide-react';
import Link from 'next/link';

export default function CachedServicesViewer() {
  const [cachedServices, setCachedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(() => 
    typeof window !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    loadCachedServices();
  }, []);

  const loadCachedServices = async () => {
    try {
      setLoading(true);
      const services = await getCachedServices();
      setCachedServices(services || []);
    } catch (error) {
      console.error('Failed to load cached services:', error);
      setCachedServices([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (cachedServices.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <Database className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Cached Services
        </h3>
        <p className="text-gray-600 mb-6">
          {isOnline 
            ? 'View service details while online to cache them for offline access.'
            : 'You need to view services while online first to access them offline.'
          }
        </p>
        {isOnline && (
          <Link
            href="/services"
            className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Browse Services
          </Link>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <Database className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-blue-900 mb-1">
            Offline Cache Active
          </h3>
          <p className="text-sm text-blue-700">
            {cachedServices.length} service{cachedServices.length !== 1 ? 's' : ''} available offline. 
            {isOnline && ' You can view these even without an internet connection.'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cachedServices.map((service) => (
          <Link
            key={service._id}
            href={`/services/${service._id}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div className="p-6">
              {/* Category Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-medium px-3 py-1 rounded-full">
                  {service.category}
                </span>
                <Database className="h-4 w-4 text-gray-400" title="Cached offline" />
              </div>

              {/* Service Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {service.title}
              </h3>

              {/* Location */}
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-2 shrink-0" />
                <span className="line-clamp-1">
                  {service.location.city}, {service.location.district}
                </span>
              </div>

              {/* Date */}
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Calendar className="h-4 w-4 mr-2 shrink-0" />
                <span>
                  {new Date(service.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                  {service.time && ` • ${service.time}`}
                </span>
              </div>

              {/* Capacity */}
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2 shrink-0" />
                <span>
                  {service.registeredCount || 0} / {service.maxCapacity} registered
                </span>
              </div>

              {/* View Button */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-emerald-600 text-sm font-medium hover:text-emerald-700">
                  View Details →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
