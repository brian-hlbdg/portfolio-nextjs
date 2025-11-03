/**
 * src/components/features/bears-dashboard/header/BearsDashboardHeader.tsx
 * 
 * IMPORTANT CODE CONCEPT: Header Component with State
 * 
 * This demonstrates:
 * - Bears branding with team colors
 * - Error state handling
 * - Last updated timestamp
 * - Refetch button for manual data refresh
 */

import React from 'react';
import { BEARS_TEAM } from '@/data/bears';
import Image from 'next/image';

interface BearsDashboardHeaderProps {
  error?: string | null;
  onRefetch?: () => void;
  lastUpdated?: string | null;
  loading?: boolean;
}

/**
 * BearsDashboardHeader Component
 * 
 * Shows Bears branding, status, and controls
 */
export default function BearsDashboardHeader({
  error,
  onRefetch,
  lastUpdated,
  loading = false,
}: BearsDashboardHeaderProps) {
  const formatLastUpdated = (timestamp?: string | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleDateString();
  };

  return (
    <header className="border-b border-slate-800/50 bg-gradient-to-b from-slate-950/80 to-slate-950/40 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Bears Logo */}
            <div className="w-16 h-16 relative">
              <Image
                src={BEARS_TEAM.logo}
                alt="Chicago Bears"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent">
                CHICAGO BEARS
              </h1>
              <p className="text-slate-400 text-sm">NFL • 2024 Season</p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="text-right">
            <div
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                loading
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                  : error
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                  : 'bg-green-500/20 text-green-400 border border-green-500/50'
              }`}
            >
              {loading ? 'LOADING' : error ? 'ERROR' : 'LIVE'}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Updated {formatLastUpdated(lastUpdated)}
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-red-200 font-medium text-sm">Data Load Error</p>
              <p className="text-red-300 text-xs mt-1">{error}</p>
            </div>
            {onRefetch && (
              <button
                onClick={onRefetch}
                disabled={loading}
                className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded font-medium text-sm transition-colors whitespace-nowrap"
              >
                {loading ? 'Retrying...' : 'Retry'}
              </button>
            )}
          </div>
        )}

        {/* Subtext */}
        <p className="text-slate-400 text-sm tracking-wide mt-4">
          Real-time stats powered by ESPN
        </p>
      </div>
    </header>
  );
}