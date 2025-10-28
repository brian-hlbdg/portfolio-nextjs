'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TeamOverviewSection, TeamStatsSection } from './TeamStatsSection';
import Image from 'next/image';
import { chicagoTeams, getTeamById } from '@/data/chicagoTeams';
import { useSportsStats } from '@/hooks/useSportsStats';
import { PlayerStatsSection } from './PlayerStatsSection';
import { ScheduleSection } from './ScheduleSection';

interface TeamDashboardProps {
  team: string;
}

export function TeamDashboard({ team }: TeamDashboardProps) {
  const router = useRouter();
  const { teams: statsTeams } = useSportsStats();
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isAnimating, setIsAnimating] = useState(true);

  const currentTeam = getTeamById(team);
  const otherTeams = chicagoTeams.filter(t => t.id !== team);
  const currentStats = statsTeams.find(t => t.name === currentTeam?.fullName);

  useEffect(() => {
    // Trigger animation completion after mount
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!currentTeam) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Team not found</h1>
          <button
            onClick={() => router.push('/chicago-sports')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleTeamClick = (teamId: string) => {
    router.push(`/chicago-sports/${teamId}`);
  };

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'season-stats', label: 'Season Stats' },
    { id: 'players', label: 'Players' },
    { id: 'last-game', label: 'Last Game' },
    { id: 'schedule', label: 'Schedule' },
  ];

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: currentTeam.colors.primary }}
    >
      <div className="flex h-screen overflow-hidden">
        {/* Side Navigation - Main Team */}
        <div
          className={`transition-all duration-500 ${
            isAnimating ? 'w-full md:w-64' : 'w-full md:w-64'
          } border-r flex flex-col`}
          style={{ borderColor: currentTeam.colors.secondary }}
        >
          {/* Team Header */}
          <div
            className="p-6 border-b text-white"
            style={{ borderColor: currentTeam.colors.secondary }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-16 h-16">
                <Image
                  src={currentTeam.logo}
                  alt={currentTeam.fullName}
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-xs opacity-75">{currentTeam.sport}</p>
                <h2 className="text-xl font-bold">{currentTeam.name}</h2>
              </div>
            </div>

            {currentStats && (
              <div className="space-y-2 text-sm">
                <div>
                  <p className="opacity-75">Record</p>
                  <p className="text-2xl font-bold">{currentStats.record}</p>
                </div>
                <div>
                  <p className="opacity-75 text-xs">
                    {currentStats.wins}W - {currentStats.losses}L
                    {currentStats.ties ? ` - ${currentStats.ties}T` : ''}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full text-left px-4 py-2 rounded transition-all duration-200 ${
                  activeSection === item.id
                    ? 'font-semibold'
                    : 'opacity-75 hover:opacity-100'
                }`}
                style={{
                  backgroundColor:
                    activeSection === item.id
                      ? `${currentTeam.colors.secondary}40`
                      : 'transparent',
                  color: 'white',
                  borderLeft:
                    activeSection === item.id
                      ? `4px solid ${currentTeam.colors.secondary}`
                      : '4px solid transparent',
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Back Button */}
          <div className="p-4 border-t" style={{ borderColor: currentTeam.colors.secondary }}>
            <button
              onClick={() => router.push('/chicago-sports')}
              className="w-full px-4 py-2 rounded text-white opacity-75 hover:opacity-100 transition-opacity text-sm"
              style={{ backgroundColor: `${currentTeam.colors.secondary}20` }}
            >
              ← Back to All Teams
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Sticky Top Nav - Other Teams */}
          <div
            className="sticky top-0 z-40 overflow-x-auto border-b flex gap-2 p-2"
            style={{
              backgroundColor: `${currentTeam.colors.primary}dd`,
              borderColor: currentTeam.colors.secondary,
            }}
          >
            {otherTeams.map(otherTeam => (
              <button
                key={otherTeam.id}
                onClick={() => handleTeamClick(otherTeam.id)}
                className="flex-shrink-0 px-3 py-2 rounded text-white text-sm font-medium transition-all duration-200 hover:shadow-lg active:scale-95"
                style={{
                  backgroundColor: otherTeam.colors.primary,
                  borderColor: otherTeam.colors.secondary,
                  border: '2px solid',
                }}
                title={otherTeam.fullName}
              >
                <div className="flex items-center gap-2">
                  <div className="relative w-6 h-6">
                    <Image
                      src={otherTeam.logo}
                      alt={otherTeam.fullName}
                      width={24}
                      height={24}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="hidden sm:inline">{otherTeam.name}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              {activeSection === 'overview' && (
                <TeamOverviewSection
                    teamName={currentTeam.fullName}
                    sport={currentTeam.sport}
                    record={currentStats?.record || 'N/A'}
                    stats={{
                    wins: currentStats?.wins || 0,
                    losses: currentStats?.losses || 0,
                    ties: currentStats?.ties,
                    }}
                />
                )}

              {activeSection === 'season-stats' && (
                <TeamStatsSection team={currentTeam} stats={currentStats} />
                )}

              {activeSection === 'players' && (
                <PlayerStatsSection team={currentTeam} />
              )}

              {activeSection === 'last-game' && (
                <div className="text-white">
                  <h2 className="text-2xl font-bold mb-4">Last Game Recap</h2>
                  <p className="opacity-75">Game recap coming soon...</p>
                </div>
              )}

              {activeSection === 'schedule' && (
                <ScheduleSection team={currentTeam} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}