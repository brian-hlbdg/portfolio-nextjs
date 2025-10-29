// src/components/features/dashboard/DashboardSkeleton.tsx
/**
 * DASHBOARD SKELETON COMPONENT
 * 
 * Purpose: Loading state that prevents layout shift (CLS)
 * 
 * UX Best Practices:
 * - Matches exact layout dimensions of loaded content
 * - Animated pulse effect indicates loading without distracting
 * - Prevents jarring content reflows when data loads
 * - Accessible: includes aria-busy for screen readers
 * 
 * Location in main component:
 * Rendered conditionally: if (loading) return <DashboardSkeleton />
 * This is at the very top of the component return statement
 */

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" aria-busy="true">
      {/* Header Skeleton */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="h-10 bg-slate-800 rounded-lg w-3/4 animate-pulse mb-4" />
          <div className="h-4 bg-slate-800 rounded-lg w-1/2 animate-pulse" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Metrics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="h-4 bg-slate-700 rounded w-1/2 animate-pulse mb-4" />
              <div className="h-10 bg-slate-700 rounded w-3/4 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Teams Grid Skeleton */}
        <div>
          <div className="h-6 bg-slate-700 rounded w-1/4 animate-pulse mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="w-12 h-12 bg-slate-700 rounded mx-auto mb-3 animate-pulse" />
                <div className="h-4 bg-slate-700 rounded w-full mb-2 animate-pulse" />
                <div className="h-6 bg-slate-700 rounded w-3/4 mx-auto animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="h-6 bg-slate-700 rounded w-1/3 animate-pulse mb-4" />
              <div className="h-64 bg-slate-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}