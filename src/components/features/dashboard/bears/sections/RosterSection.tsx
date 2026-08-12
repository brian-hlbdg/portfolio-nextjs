'use client';

import React, { useMemo, useState } from 'react';
import { BearsPlayer } from '@/components/features/types/bears.types';
import { useBearsRoster } from '@/hooks/useBearsRoster';
import PlayerCard from './components/PlayerCard';
import PlayerDetailPanel from './components/PlayerDetailPanel';

// ── Position grouping ────────────────────────────────────────────────────────

const POSITION_GROUPS: Record<string, string[]> = {
  Offense:       ['QB', 'RB', 'WR', 'TE', 'OT', 'OG', 'C'],
  Defense:       ['DE', 'DT', 'LB', 'CB', 'S'],
  'Special Teams': ['K', 'P', 'LS'],
};

const SHOW_LIMIT = 5;

function groupByUnit(players: BearsPlayer[]): Record<string, BearsPlayer[]> {
  return Object.fromEntries(
    Object.entries(POSITION_GROUPS).map(([group, positions]) => [
      group,
      players.filter(p => positions.includes(p.position)).slice().sort((a, b) => {
        const na = (a.number as number) || 99;
        const nb = (b.number as number) || 99;
        return na - nb;
      }),
    ])
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function RosterSection() {
  const { activePlayers, injuredPlayers, loading, error, lastUpdated, source, refetch } =
    useBearsRoster();

  const [selectedPlayer, setSelectedPlayer] = useState<BearsPlayer | null>(null);
  const [panelType, setPanelType] = useState<'active' | 'injured'>('active');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const activeGroups = useMemo(() => groupByUnit(activePlayers), [activePlayers]);
  const injuredGroups = useMemo(() => groupByUnit(injuredPlayers), [injuredPlayers]);

  const handlePlayerClick = (player: BearsPlayer, type: 'active' | 'injured'): void => {
    setSelectedPlayer(player);
    setPanelType(type);
  };

  const toggleGroup = (group: string): void => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-7 bg-slate-700/30 rounded w-40 animate-pulse mb-2" />
            <div className="h-4 bg-slate-700/20 rounded w-64 animate-pulse" />
          </div>
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 bg-slate-700/25 rounded w-28 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-20 bg-slate-700/15 rounded border border-slate-700/20 animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && activePlayers.length === 0 && injuredPlayers.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Roster</h2>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 space-y-3">
          <p className="font-semibold text-red-300">Roster Data Unavailable</p>
          <p className="text-sm text-red-300/80">{error}</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-sm text-red-300 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Roster</h2>
          <p className="text-sm text-slate-400">
            Click any player to view details.{' '}
            {activePlayers.length > 0 && `${activePlayers.length} active`}
            {injuredPlayers.length > 0 && `, ${injuredPlayers.length} on IR/injured`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            source === 'live'  ? 'bg-green-500/20 border-green-500/50 text-green-300'
            : source === 'cache' ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
            : 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
          }`}>
            <span className="inline-block w-2 h-2 rounded-full mr-1.5 bg-current" />
            {source === 'live' ? 'Live' : source === 'cache' ? 'Cached' : 'Offline'}
          </div>
          <button
            onClick={() => refetch()}
            className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors text-slate-400 hover:text-white"
            title="Refresh roster"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-600 -mt-4">Updated: {lastUpdated}</p>

      {/* Active roster — 3 position groups */}
      {Object.entries(activeGroups).map(([group, players]) => {
        if (players.length === 0) return null;
        const isExpanded = expandedGroups.has(group);
        const visible = isExpanded ? players : players.slice(0, SHOW_LIMIT);
        const hasMore = players.length > SHOW_LIMIT;

        return (
          <div key={group} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">{group}</h3>
              <span className="text-xs text-slate-500">{players.length} players</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {visible.map((player) => (
                <div
                  key={player.id}
                  onClick={() => handlePlayerClick(player, 'active')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePlayerClick(player, 'active'); }}
                >
                  <PlayerCard player={player} isInjured={false} />
                </div>
              ))}
            </div>

            {hasMore && (
              <button
                onClick={() => toggleGroup(group)}
                className="text-xs text-slate-400 hover:text-orange-400 transition-colors mt-1"
              >
                {isExpanded ? 'Show fewer' : `Show all ${players.length} players ↓`}
              </button>
            )}
          </div>
        );
      })}

      {/* Injury report — collapsed by default behind a toggle */}
      {injuredPlayers.length > 0 && (() => {
        const injuredGroupKey = 'injured';
        const isExpanded = expandedGroups.has(injuredGroupKey);
        return (
          <div className="border-t border-slate-800 pt-6">
            <button
              onClick={() => toggleGroup(injuredGroupKey)}
              className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest mb-4"
            >
              <span>Injury Report</span>
              <span className="text-slate-600">({injuredPlayers.length})</span>
              <span className="text-slate-600 text-xs">{isExpanded ? '▲' : '▼'}</span>
            </button>
            {isExpanded && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {injuredPlayers.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => handlePlayerClick(player, 'injured')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePlayerClick(player, 'injured'); }}
                  >
                    <PlayerCard player={player} isInjured={true} />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {selectedPlayer && selectedPlayer.name && selectedPlayer.number && (
        <PlayerDetailPanel
          player={selectedPlayer}
          isInjured={panelType === 'injured'}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
}
