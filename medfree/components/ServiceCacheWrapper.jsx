'use client';

import { useEffect } from 'react';
import { cacheServiceForOffline } from '@/lib/pwa';

export default function ServiceCacheWrapper({ service }) {
  useEffect(() => {
    if (service && typeof window !== 'undefined') {
      // Cache service for offline access
      cacheServiceForOffline(service).catch(err => 
        console.warn('Failed to cache service:', err)
      );
    }
  }, [service]);

  return null; // This component doesn't render anything
}
