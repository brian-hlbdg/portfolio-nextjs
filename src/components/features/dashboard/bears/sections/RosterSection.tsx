/**
 * src/components/features/dashboard/bears/sections/RosterSection.tsx
 * ========================================================================
 * UPDATED: Uses useBearsRoster hook for real ESPN data
 * 
 * No mock data - fetches from ESPN with:
 * - Loading states with skeleton screens
 * - Error messaging
 * - Data source indicator (live/cache/unavailable)
 * - Refetch capability
 * ========================================================================
 */

'use client';

import React, { useMemo, useState } from 'react';
import { BearsPlayer } from '@/components/features/types/bears.types';
import { useBearsRoster } from '@/hooks/useBearsRoster';
import PlayerCard from './components/PlayerCard';
import PlayerDetailPanel from './components/PlayerDetailPanel';

/**
 * Position ordering (top to bottom matches viewing order in sports)
 */
const POSITION_ORDER = [
  'QB',
  'RB',
  'WR',
  'TE',
  'OT',
  'OG',
  'C',
  'DE',
  'DT',
  'LB',
  'CB',
  'S',
  'K',
  'P',
] as const;

type Position = (typeof POSITION_ORDER)[number];

/**
 * Group players by position, maintaining consistent order
 */
function groupPlayersByPosition(players: BearsPlayer[]): Map<Position, BearsPlayer[]> {
  const grouped = new Map<Position, BearsPlayer[]>();

  // Initialize empty arrays for all positions
  POSITION_ORDER.forEach((pos) => {
    grouped.set(pos, []);
  });

  // Distribute players
  players.forEach((player) => {
    const pos = player.position as Position;
    if (grouped.has(pos)) {
      grouped.get(pos)!.push(player);
    }
  });

  // Remove positions with no players
  Array.from(grouped.entries()).forEach(([pos, players]) => {
    if (players.length === 0) {
      grouped.delete(pos);
    }
  });

  return grouped;
}

export default function RosterSection() {
  // Fetch roster from ESPN
  const { activePlayers, injuredPlayers, loading, error, lastUpdated, source, refetch } =
    useBearsRoster();

  // State for side panel
  const [selectedPlayer, setSelectedPlayer] = useState<BearsPlayer | null>(null);
  const [panelType, setPanelType] = useState<'active' | 'injured'>('active');

  // Group players by position (memoized)
  const activeGrouped = useMemo(
    () => groupPlayersByPosition(activePlayers),
    [activePlayers]
  );
  const injuredGrouped = useMemo(
    () => groupPlayersByPosition(injuredPlayers),
    [injuredPlayers]
  );

  const handlePlayerClick = (player: BearsPlayer, type: 'active' | 'injured'): void => {
    console.log('🎯 Player clicked:', player);
    console.log('Player keys:', Object.keys(player));
    console.log('Player.name:', player.name);
    console.log('Player.number:', player.number);
    setSelectedPlayer(player);
    setPanelType(type);
  };

  const handleClosePanel = (): void => {
    setSelectedPlayer(null);
  };

  /**
   * LOADING STATE - Skeleton screens
   */
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-7 bg-slate-700/30 rounded w-40 animate-pulse mb-2" />
            <div className="h-4 bg-slate-700/20 rounded w-64 animate-pulse" />
          </div>
          <div className="h-5 bg-slate-700/20 rounded w-32 animate-pulse" />
        </div>

        <div className="space-y-6">
          {[...Array(3)].map((_, sectionIdx) => (
            <div key={sectionIdx} className="space-y-3">
              <div className="h-4 bg-slate-700/25 rounded w-24 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[...Array(4)].map((_, cardIdx) => (
                  <div
                    key={cardIdx}
                    className="h-20 bg-slate-700/15 rounded border border-slate-700/20 animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /**
   * ERROR STATE - ESPN unavailable
   */
  if (error && activePlayers.length === 0 && injuredPlayers.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Roster</h2>
          <p className="text-sm text-slate-400">
            Real-time roster data from ESPN
          </p>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 space-y-3">
          <div>
            <h3 className="font-semibold text-red-300 mb-1">Roster Data Unavailable</h3>
            <p className="text-sm text-red-300/80">{error}</p>
          </div>

          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg transition-all text-sm text-red-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>

          <p className="text-xs text-slate-400 pt-2 border-t border-red-500/20">
            Last attempted: {lastUpdated}
          </p>
        </div>
      </div>
    );
  }

  /**
   * MAIN RENDER - Roster with real data
   */
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Roster</h2>
          <p className="text-sm text-slate-400">
            Click any player to view details.{' '}
            {activePlayers.length > 0 && (
              <>
                {activePlayers.length} on active roster
                {injuredPlayers.length > 0 && `, ${injuredPlayers.length} injured`}
              </>
            )}
          </p>
        </div>

        {/* Data Source Indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              source === 'live'
                ? 'bg-green-500/20 border-green-500/50 text-green-300'
                : source === 'cache'
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                : 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full mr-1.5 bg-current" />
            {source === 'live' ? 'Live' : source === 'cache' ? 'Cached' : 'Offline'}
          </div>

          {/* Refetch Button */}
          <button
            onClick={() => refetch()}
            className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors text-slate-400 hover:text-white"
            title="Refresh roster data"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-xs text-slate-500">
        Updated: {lastUpdated}
      </div>

      {/* Active Roster Section */}
      {activePlayers.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white uppercase tracking-wide text-xs">
            Active Roster
          </h3>

          <div className="space-y-6">
            {Array.from(activeGrouped.entries()).map(([position, players]) => (
              <div key={position} className="space-y-2">
                {/* Position Header */}
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {position} <span className="text-slate-500">({players.length})</span>
                </h4>

                {/* Player Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      onClick={() => handlePlayerClick(player, 'active')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handlePlayerClick(player, 'active');
                        }
                      }}
                    >
                      <PlayerCard player={player} isInjured={false} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-slate-400 text-sm">
          No active players loaded
        </div>
      )}

      {/* Injury Report Section */}
      {injuredPlayers.length > 0 && (
        <div className="space-y-4 border-t border-slate-800 pt-8">
          <h3 className="text-lg font-semibold text-white uppercase tracking-wide text-xs">
            Injury Report
          </h3>

          <div className="space-y-6">
            {Array.from(injuredGrouped.entries()).map(([position, players]) => (
              <div key={position} className="space-y-2">
                {/* Position Header */}
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {position} <span className="text-slate-500">({players.length})</span>
                </h4>

                {/* Player Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      onClick={() => handlePlayerClick(player, 'injured')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handlePlayerClick(player, 'injured');
                        }
                      }}
                    >
                      <PlayerCard player={player} isInjured={true} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Side Panel - Non-Invasive Detail View */}
      {selectedPlayer && selectedPlayer.name && selectedPlayer.number && (
        <PlayerDetailPanel
          player={selectedPlayer}
          isInjured={panelType === 'injured'}
          onClose={handleClosePanel}
        />
      )}
    </div>
  );
}