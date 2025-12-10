/**
 * src/components/features/updates/RecentUpdates.tsx
 * ========================================================================
 * COMPONENT: Recent Updates Section
 * 
 * Displays a randomized selection of recent content updates.
 * Shows 2 items by default, randomized on each page load.
 * 
 * WHY THIS WORKS WITH STATIC EXPORT (IONOS):
 * - Randomization happens in useEffect (client-side only)
 * - Server renders a loading/empty state
 * - Client hydrates, then useEffect runs to pick random items
 * - No hydration mismatch because randomization is deferred
 * 
 * HYDRATION FIX:
 * We use useEffect instead of useState initializer because Math.random()
 * would produce different results on server vs client, causing a mismatch.
 * ========================================================================
 */

'use client';

import { useState, useEffect } from 'react';
import { UpdateCard } from './UpdateCard';
import { getRecentContent } from '@/utils/getRecentContent';
import { RecentUpdatesProps, SiteUpdate } from '@/components/features/types/updates';

/**
 * RecentUpdates Component
 * 
 * Displays a section with randomly selected recent content.
 * Content rotates on each page load (client-side randomization).
 * 
 * @param limit - Number of updates to show (default: 2)
 * @param types - Filter by content type (optional)
 * @param title - Section title (default: "Recent Updates")
 * 
 * @example
 * // Homepage usage - 2 random updates
 * <RecentUpdates limit={2} />
 * 
 * @example
 * // Blog-only updates with custom title
 * <RecentUpdates 
 *   limit={3} 
 *   types={['blog']} 
 *   title="Latest Posts" 
 * />
 */
export function RecentUpdates({
  limit = 2,
  types,
  title = 'Recent Website Updates',
}: RecentUpdatesProps) {
  // Start with empty array to avoid hydration mismatch
  const [randomUpdates, setRandomUpdates] = useState<SiteUpdate[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  /**
   * HYDRATION FIX: Defer randomization to client-side only
   * 
   * useEffect only runs on the client after hydration completes.
   * This prevents the server/client mismatch that Math.random() causes.
   */
  useEffect(() => {
    // Get a pool of recent content (more than we need)
    const pool = getRecentContent(20, types);
    
    // Fisher-Yates shuffle for better randomization
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Set the random selection
    setRandomUpdates(shuffled.slice(0, limit));
    setIsLoaded(true);
  }, [limit, types]);

  // Don't render until client-side randomization is complete
  // This prevents layout shift by reserving space
  if (!isLoaded) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-light mb-8 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              {title}
            </h2>
            {/* Skeleton loader to prevent layout shift */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: limit }).map((_, i) => (
                <div 
                  key={i}
                  className="h-24 bg-gray-100 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-700 rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Don't render if no updates available
  if (randomUpdates.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header - matches homepage section styling */}
          <h2 className="text-2xl font-light mb-8 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            {title}
          </h2>

          {/* Updates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {randomUpdates.map((update) => (
              <UpdateCard key={update.id} update={update} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}