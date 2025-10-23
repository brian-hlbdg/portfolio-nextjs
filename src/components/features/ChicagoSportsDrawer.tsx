// src/components/features/ChicagoSportsDrawer.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSportsStats } from '@/hooks/useSportsStats';

export function ChicagoSportsDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { teams, loading, error, lastFetch, refetch } = useSportsStats();

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const sportGroups = {
    NFL: teams.filter(t => t.sport === 'NFL'),
    MLB: teams.filter(t => t.sport === 'MLB'),
    NBA: teams.filter(t => t.sport === 'NBA'),
    NHL: teams.filter(t => t.sport === 'NHL'),
    MLS: teams.filter(t => t.sport === 'MLS'),
    WNBA: teams.filter(t => t.sport === 'WNBA')
  };

  const getSportColor = (sport: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      NFL: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700' },
      MLB: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-300 dark:border-green-700' },
      NBA: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-red-300 dark:border-red-700' },
      NHL: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-300 dark:border-purple-700' },
      MLS: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-300 dark:border-yellow-700' },
      WNBA: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-300 dark:border-orange-700' }
    };
    return colors[sport] || colors.NFL;
  };

  return (
    <>
      {/* Trigger Button - Clickable Card */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full group cursor-pointer transition-all duration-300 text-left"
        aria-expanded={isOpen}
        aria-label="View Chicago sports teams stats"
      >
        <div className="aspect-video bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden mb-4 relative">
          <Image 
            src="/images/passions/sports.jpg"
            alt="Chicago Sports"
            width={500}
            height={500}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = 'none';
              if (img.parentElement) {
                img.parentElement.innerHTML = `
                  <div class="w-full h-full bg-gradient-to-br from-blue-50 to-red-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                    <span class="text-orange-500 text-lg font-medium">Chicago Sports</span>
                  </div>
                `;
              }
            }}
          />
          {/* Active indicator */}
          <div className={`absolute inset-0 border-2 rounded-lg transition-all duration-300 pointer-events-none ${
            isOpen 
              ? 'border-orange-500 bg-orange-500/5' 
              : 'border-transparent group-hover:border-orange-300'
          }`} />
        </div>
        <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
          Chicago Sports
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Dedicated Chicago sports fan through thick and thin (click to view teams' stats)
        </p>
      </button>

      {/* Animated Drawer Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          isOpen
            ? 'bg-black/40 backdrop-blur-sm opacity-100'
            : 'bg-black/0 pointer-events-none opacity-0'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl transition-all duration-300 ease-out transform ${
          isOpen
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0 pointer-events-none'
        }`}
        style={{
          maxHeight: '90vh',
          height: 'auto'
        }}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 pb-8" style={{ maxHeight: 'calc(90vh - 60px)' }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sticky top-0 bg-white dark:bg-gray-900 pt-2 z-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Chicago Sports
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close drawer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Loading State */}
          {loading && teams.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin">
                <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-600 border-t-orange-500 rounded-full" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-4">Loading team stats...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg p-4 mb-6">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              <button
                onClick={refetch}
                className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Teams Grid */}
          {!loading && teams.length > 0 && (
            <div className="space-y-6">
              {Object.entries(sportGroups).map(([sport, sportTeams]) =>
                sportTeams.length > 0 && (
                  <div key={sport}>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                      {sport}
                    </h3>
                    <div className="space-y-3">
                      {sportTeams.map((team) => {
                        const colors = getSportColor(team.sport);
                        return (
                          <div
                            key={team.name}
                            className={`${colors.bg} ${colors.border} border rounded-lg p-4 transition-all duration-200 hover:shadow-md`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className={`font-semibold ${colors.text}`}>
                                {team.name}
                              </h4>
                              {team.logo && (
                                <Image
                                  src={team.logo}
                                  alt={team.name}
                                  width={32}
                                  height={32}
                                  className="w-8 h-8 object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-semibold">{team.record}</span>
                                <span className="text-gray-500 dark:text-gray-400 ml-2">
                                  ({team.wins}W, {team.losses}L{team.ties ? `, ${team.ties}T` : ''})
                                </span>
                              </div>
                              <span className={`text-xs font-medium ${colors.text} bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded`}>
                                {team.sport}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              )}

              {/* Last Updated */}
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                Last updated: {lastFetch?.toLocaleDateString() || 'Never'}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}