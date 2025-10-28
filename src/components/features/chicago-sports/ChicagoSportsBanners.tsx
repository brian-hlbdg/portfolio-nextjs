'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { chicagoTeams } from '@/data/chicagoTeams';
import { useSportsStats } from '@/hooks/useSportsStats';

export function ChicagoSportsBanners() {
  const router = useRouter();
  const { teams } = useSportsStats();

  const getTeamStats = (teamName: string) => {
    return teams.find(t => t.name === teamName);
  };

  const handleBannerClick = (teamId: string) => {
    router.push(`/chicago-sports/${teamId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Chicago Sports Dashboard
          </h1>
          <p className="text-gray-400">
            Click a team to view detailed stats and information
          </p>
        </div>

        {/* Banners Grid - Full height on desktop, square on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-max lg:auto-rows-[calc(100vh-200px)]">
          {chicagoTeams.map((team) => {
            const stats = getTeamStats(team.fullName);
            
            return (
              <button
                key={team.id}
                onClick={() => handleBannerClick(team.id)}
                className="group relative aspect-square lg:aspect-auto overflow-hidden rounded-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900"
                style={{
                  backgroundColor: team.colors.primary,
                  borderColor: team.colors.secondary,
                }}
              >
                {/* Banner Background with Gradient Overlay */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${team.colors.primary} 0%, ${team.colors.secondary} 100%)`,
                  }}
                />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-4 text-white">
                  {/* Top Section - Logo and Sport */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-xs font-semibold opacity-75 mb-1">
                        {team.sport}
                      </div>
                      <h2 className="text-xl font-bold leading-tight">
                        {team.fullName}
                      </h2>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <div className="relative w-12 h-12">
                        <Image
                          src={team.logo}
                          alt={team.fullName}
                          width={48}
                          height={48}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section - Stats */}
                  <div className="border-t border-white/20 pt-3">
                    {stats ? (
                      <div className="space-y-1">
                        <div className="text-sm font-semibold">
                          Record: {stats.record}
                        </div>
                        <div className="text-xs opacity-75">
                          {stats.wins}W - {stats.losses}L
                          {stats.ties ? ` - ${stats.ties}T` : ''}
                        </div>
                        <div className="text-xs opacity-50 pt-1">
                          Last updated: {stats.lastUpdated}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs opacity-50">
                        No data available
                      </div>
                    )}
                  </div>

                  {/* Hover Indicator */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-lg" />
                </div>

                {/* Border */}
                <div
                  className="absolute inset-0 rounded-lg border-2 pointer-events-none"
                  style={{
                    borderColor: team.colors.secondary,
                    opacity: 0.3,
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>Select a team to view season stats, player information, and game recaps</p>
        </div>
      </div>
    </div>
  );
}