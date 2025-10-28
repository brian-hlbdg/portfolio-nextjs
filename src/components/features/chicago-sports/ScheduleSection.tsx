'use client';

import Image from 'next/image';
import { ChicagoTeam } from '@/data/chicagoTeams';
import { useTeamSchedule } from '@/hooks/useTeamSchedule';

interface ScheduleSectionProps {
  team: ChicagoTeam;
}

export function ScheduleSection({ team }: ScheduleSectionProps) {
  const { scheduleData, loading, error } = useTeamSchedule(team.id, team.sport);

  if (loading) {
    return (
      <div className="text-white">
        <h2 className="text-2xl font-bold mb-4">Schedule</h2>
        <div className="text-center py-8">
          <div className="inline-block animate-spin">
            <div
              className="w-8 h-8 border-4 border-gray-300 rounded-full"
              style={{
                borderTopColor: team.colors.secondary,
              }}
            />
          </div>
          <p className="text-gray-400 mt-4">Loading schedule...</p>
        </div>
      </div>
    );
  }

  if (error || !scheduleData) {
    return (
      <div className="text-white">
        <h2 className="text-2xl font-bold mb-4">Schedule</h2>
        <div
          className="p-6 rounded-lg text-center opacity-75"
          style={{ backgroundColor: `${team.colors.secondary}20` }}
        >
          <p>{error || 'No schedule available'}</p>
        </div>
      </div>
    );
  }

  const upcomingGames = scheduleData.games.filter(game => game.status === 'scheduled');

  return (
    <div className="text-white space-y-6">
      <h2 className="text-2xl font-bold">Schedule</h2>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div
            className="px-2 py-1 rounded text-xs font-semibold"
            style={{ backgroundColor: `${team.colors.secondary}50` }}
          >
            HOME
          </div>
          <span className="opacity-75">Home Game</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="px-2 py-1 rounded text-xs font-semibold"
            style={{ backgroundColor: `${team.colors.secondary}20` }}
          >
            AWAY
          </div>
          <span className="opacity-75">Away Game</span>
        </div>
      </div>

      {/* Games List */}
      {upcomingGames.length > 0 ? (
        <div className="space-y-3">
          {upcomingGames.map((game) => (
            <div
              key={game.id}
              className="p-4 rounded-lg border transition-all hover:shadow-lg"
              style={{
                backgroundColor:
                  game.homeAway === 'home'
                    ? `${team.colors.secondary}15`
                    : `${team.colors.secondary}08`,
                borderColor: team.colors.secondary,
                borderLeftWidth: '4px',
              }}
            >
              {/* Game Date and Broadcast */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm opacity-75 mb-1">{game.date}</p>
                  <p className="font-semibold text-lg">{game.time}</p>
                </div>
                <div className="text-right">
                  <div
                    className="px-3 py-1 rounded text-xs font-semibold mb-1"
                    style={{
                      backgroundColor:
                        game.homeAway === 'home'
                          ? `${team.colors.secondary}50`
                          : `${team.colors.secondary}20`,
                    }}
                  >
                    {game.homeAway === 'home' ? 'HOME' : 'AWAY'}
                  </div>
                  {game.broadcast && (
                    <p className="text-xs opacity-50 mt-1">{game.broadcast}</p>
                  )}
                </div>
              </div>

              {/* Matchup */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
                <div className="flex-1">
                  <p className="opacity-75 text-sm mb-1">vs</p>
                  <div className="flex items-center gap-3">
                    {game.opponentLogo && (
                      <div className="relative w-8 h-8 flex-shrink-0">
                        <Image
                          src={game.opponentLogo}
                          alt={game.opponent}
                          width={32}
                          height={32}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <span className="font-semibold">{game.opponent}</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-2 text-sm">
                <svg
                  className="w-4 h-4 mt-0.5 opacity-50 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                </svg>
                <div className="opacity-75">
                  <p>{game.venue}</p>
                  <p className="text-xs opacity-50">{game.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="p-6 rounded-lg text-center opacity-75"
          style={{ backgroundColor: `${team.colors.secondary}10` }}
        >
          <p>No upcoming games scheduled</p>
        </div>
      )}

      {/* Summary */}
      <div
        className="p-4 rounded-lg text-sm opacity-75"
        style={{ backgroundColor: `${team.colors.secondary}10` }}
      >
        <p>
          {team.name} has {upcomingGames.length} upcoming {team.sport} games. Schedule is
          subject to change. Check official sources for the most current information.
        </p>
      </div>
    </div>
  );
}