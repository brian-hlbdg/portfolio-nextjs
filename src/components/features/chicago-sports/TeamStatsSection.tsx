'use client';

import { ChicagoTeam } from '@/data/chicagoTeams';
import { TeamStats } from '@/hooks/useSportsStats';

interface TeamStatsSectionProps {
  team: ChicagoTeam;
  stats: TeamStats | undefined;
}

export function TeamStatsSection({ team, stats }: TeamStatsSectionProps) {
  if (!stats) {
    return (
      <div className="text-white">
        <h2 className="text-2xl font-bold mb-4">Season Statistics</h2>
        <div
          className="p-6 rounded-lg text-center opacity-75"
          style={{ backgroundColor: `${team.colors.secondary}20` }}
        >
          <p>No stats data available for {team.fullName}</p>
        </div>
      </div>
    );
  }

  // Calculate winning percentage
  const totalGames = stats.wins + stats.losses + (stats.ties || 0);
  const winPercentage = totalGames > 0 ? ((stats.wins / totalGames) * 100).toFixed(1) : '0.0';

  return (
    <div className="text-white space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Season Statistics</h2>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Wins */}
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: `${team.colors.secondary}30` }}
          >
            <p className="text-sm opacity-75 mb-1">Wins</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold">{stats.wins}</p>
              <div
                className="h-16 w-1 rounded"
                style={{
                  backgroundColor: team.colors.secondary,
                  height: `${(stats.wins / Math.max(stats.wins, stats.losses, 10)) * 60}px`,
                }}
              />
            </div>
          </div>

          {/* Losses */}
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: `${team.colors.secondary}20` }}
          >
            <p className="text-sm opacity-75 mb-1">Losses</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold">{stats.losses}</p>
              <div
                className="h-16 w-1 rounded"
                style={{
                  backgroundColor: team.colors.secondary,
                  opacity: 0.7,
                  height: `${(stats.losses / Math.max(stats.wins, stats.losses, 10)) * 60}px`,
                }}
              />
            </div>
          </div>

          {/* Ties (if applicable) */}
          {stats.ties !== undefined && stats.ties > 0 && (
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: `${team.colors.secondary}15` }}
            >
              <p className="text-sm opacity-75 mb-1">Ties</p>
              <p className="text-3xl font-bold">{stats.ties}</p>
            </div>
          )}

          {/* Win Percentage */}
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: `${team.colors.secondary}25` }}
          >
            <p className="text-sm opacity-75 mb-1">Win %</p>
            <p className="text-3xl font-bold">{winPercentage}%</p>
          </div>
        </div>

        {/* Record Summary */}
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: `${team.colors.secondary}10`,
            borderColor: team.colors.secondary,
          }}
        >
          <p className="text-sm opacity-75 mb-2">Overall Record</p>
          <p className="text-4xl font-bold mb-2">{stats.record}</p>
          <p className="text-sm opacity-50">
            Last updated: {stats.lastUpdated}
          </p>
        </div>
      </div>

      {/* Performance Bar */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Season Performance</h3>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Win Rate</span>
              <span className="font-semibold">{winPercentage}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${winPercentage}%`,
                  backgroundColor: team.colors.secondary,
                }}
              />
            </div>
          </div>

          {/* Win/Loss Ratio */}
          <div className="mt-4">
            <p className="text-sm opacity-75 mb-2">Games Played</p>
            <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
              <div
                className="flex items-center justify-center text-xs font-semibold"
                style={{
                  width: `${(stats.wins / totalGames) * 100}%`,
                  backgroundColor: team.colors.secondary,
                  color: team.colors.primary,
                }}
              >
                {stats.wins > 0 && <span>{stats.wins}W</span>}
              </div>
              <div
                className="flex items-center justify-center text-xs font-semibold opacity-75"
                style={{
                  width: `${(stats.losses / totalGames) * 100}%`,
                  backgroundColor: `${team.colors.secondary}40`,
                  color: 'white',
                }}
              >
                {stats.losses > 0 && <span>{stats.losses}L</span>}
              </div>
              {stats.ties !== undefined && stats.ties > 0 && (
                <div
                  className="flex items-center justify-center text-xs font-semibold opacity-50"
                  style={{
                    width: `${(stats.ties / totalGames) * 100}%`,
                    backgroundColor: `${team.colors.secondary}20`,
                    color: 'white',
                  }}
                >
                  {<span>{stats.ties}T</span>}
                </div>
              )}
            </div>
            <p className="text-xs opacity-50 mt-1">
              Total Games: {totalGames}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// src/components/features/chicago-sports/TeamOverviewSection.tsx
interface TeamOverviewSectionProps {
  teamName: string;
  sport: string;
  record: string;
  stats: {
    wins: number;
    losses: number;
    ties?: number;
  };
}

export function TeamOverviewSection({
  teamName,
  sport,
  record,
  stats,
}: TeamOverviewSectionProps) {
  return (
    <div className="text-white">
      <h1 className="text-4xl font-bold mb-6">{teamName}</h1>

      {/* Sport Badge */}
      <div className="mb-6">
        <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm font-medium">
          {sport}
        </span>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <p className="text-sm opacity-75 mb-2">Record</p>
          <p className="text-3xl font-bold">{record}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <p className="text-sm opacity-75 mb-2">Wins</p>
          <p className="text-3xl font-bold">{stats.wins}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <p className="text-sm opacity-75 mb-2">Losses</p>
          <p className="text-3xl font-bold">{stats.losses}</p>
        </div>
      </div>

      <div className="bg-white/10 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">About This Season</h2>
        <p className="opacity-75 leading-relaxed">
          Check out the detailed statistics, player information, last game recap, and
          upcoming schedule in the navigation menu to the left. Track {teamName}'s season
          progress throughout the {sport} campaign.
        </p>
      </div>
    </div>
  );
}