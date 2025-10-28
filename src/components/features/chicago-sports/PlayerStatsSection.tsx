'use client';

import Image from 'next/image';
import { ChicagoTeam } from '@/data/chicagoTeams';
import { usePlayerStats } from '@/hooks/usePlayerStats';

interface PlayerStatsSectionProps {
  team: ChicagoTeam;
}

export function PlayerStatsSection({ team }: PlayerStatsSectionProps) {
  const { playerData, loading, error } = usePlayerStats(team.id, team.sport);

  if (loading) {
    return (
      <div className="text-white">
        <h2 className="text-2xl font-bold mb-4">Player Statistics</h2>
        <div className="text-center py-8">
          <div className="inline-block animate-spin">
            <div
              className="w-8 h-8 border-4 border-gray-300 rounded-full"
              style={{
                borderTopColor: team.colors.secondary,
              }}
            />
          </div>
          <p className="text-gray-400 mt-4">Loading player data...</p>
        </div>
      </div>
    );
  }

  if (error || !playerData) {
    return (
      <div className="text-white">
        <h2 className="text-2xl font-bold mb-4">Player Statistics</h2>
        <div
          className="p-6 rounded-lg text-center opacity-75"
          style={{ backgroundColor: `${team.colors.secondary}20` }}
        >
          <p>{error || 'No player data available'}</p>
        </div>
      </div>
    );
  }

  // Find max values for scaling bar charts
  const maxStat1 = Math.max(
    ...playerData.players.map(p => 
      typeof p.stat1Value === 'number' ? p.stat1Value : 0
    )
  );
  
  const maxStat2 = Math.max(
    ...playerData.players.map(p => 
      typeof p.stat2Value === 'number' ? p.stat2Value : 0
    )
  );

  return (
    <div className="text-white space-y-6">
      <h2 className="text-2xl font-bold">Player Statistics</h2>

      {/* Stats Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: team.colors.secondary }}
          />
          <span>{playerData.statLabels.stat1}</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: team.colors.secondary, opacity: 0.6 }}
          />
          <span>{playerData.statLabels.stat2}</span>
        </div>
        {playerData.statLabels.stat3 && (
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: team.colors.secondary, opacity: 0.3 }}
            />
            <span>{playerData.statLabels.stat3}</span>
          </div>
        )}
      </div>

      {/* Player Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {playerData.players.map((player, index) => (
          <div
            key={player.id}
            className="rounded-lg p-4 border transition-all hover:shadow-lg"
            style={{
              backgroundColor: `${team.colors.secondary}${index % 2 === 0 ? '20' : '10'}`,
              borderColor: team.colors.secondary,
            }}
          >
            {/* Player Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs opacity-50 font-mono">#{player.number}</span>
                  <h3 className="text-lg font-semibold">{player.name}</h3>
                </div>
                <p className="text-sm opacity-75">{player.position}</p>
              </div>
              {player.imageUrl && (
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={player.imageUrl}
                    alt={player.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              )}
            </div>

            {/* Stats Display */}
            <div className="space-y-3">
              {/* Stat 1 - Bar Chart */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs opacity-75">{playerData.statLabels.stat1}</span>
                  <span className="text-sm font-bold">{player.stat1Value}</span>
                </div>
                {typeof player.stat1Value === 'number' && (
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(player.stat1Value / maxStat1) * 100}%`,
                        backgroundColor: team.colors.secondary,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Stat 2 - Bar Chart */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs opacity-75">{playerData.statLabels.stat2}</span>
                  <span className="text-sm font-bold">{player.stat2Value}</span>
                </div>
                {typeof player.stat2Value === 'number' && (
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(player.stat2Value / maxStat2) * 100}%`,
                        backgroundColor: team.colors.secondary,
                        opacity: 0.7,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Stat 3 - Simple Badge */}
              {player.stat3Name && player.stat3Value && (
                <div className="pt-2 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-xs opacity-75">{playerData.statLabels.stat3}</span>
                    <span
                      className="text-sm font-bold px-2 py-1 rounded"
                      style={{ backgroundColor: `${team.colors.secondary}30` }}
                    >
                      {player.stat3Value}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div
        className="p-4 rounded-lg text-sm opacity-75"
        style={{ backgroundColor: `${team.colors.secondary}10` }}
      >
        <p>
          Top {playerData.players.length} performers for {team.name}. Stats are season-to-date
          and updated regularly. Click refresh to get the latest player information.
        </p>
      </div>
    </div>
  );
}