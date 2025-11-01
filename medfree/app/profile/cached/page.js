import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Database } from 'lucide-react';
import CachedServicesViewer from '@/components/CachedServicesViewer';

export default async function CachedServicesPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <Database className="h-8 w-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Offline Cached Services
            </h1>
          </div>
          <p className="text-gray-600">
            Services you&apos;ve viewed are cached for offline access
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            About Offline Access
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-emerald-600 mr-2">•</span>
              <span>
                Services are automatically cached when you view their details
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 mr-2">•</span>
              <span>
                Cached services remain accessible even without an internet connection
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 mr-2">•</span>
              <span>
                Cache updates automatically when you&apos;re back online
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 mr-2">•</span>
              <span>
                Registration requires an active internet connection
              </span>
            </li>
          </ul>
        </div>

        {/* Cached Services List */}
        <CachedServicesViewer />
      </div>
    </div>
  );
}
