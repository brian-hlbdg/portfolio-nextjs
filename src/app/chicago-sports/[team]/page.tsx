'use client';

import { use } from 'react';
import { useSportsStats } from '@/hooks/useSportsStats';
import { chicagoTeams } from '@/data/chicagoTeams';
import TeamStatsSection from '@/components/features/chicago-sports/TeamStatsSection';
import PlayerStatsSection from '@/components/features/chicago-sports/PlayerStatsSection';
import { useParams, useRouter } from 'next/navigation';

export default function TeamPage() {
  const params = useParams();
  const router = useRouter();
  const { teams, loading, error } = useSportsStats();
  
  const teamId = params.team as string;
  const team = chicagoTeams.find(t => t.id === teamId);
  const teamStats = teams.find(t => t.name === team?.fullName);

  if (!team || !teamStats) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Team not found. Go back.
        </button>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen bg-slate-950 animate-pulse" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      <button
        onClick={() => router.push('/chicago-sports')}
        className="absolute top-4 left-4 px-4 py-2 bg-slate-800 text-white rounded"
      >
        ← Back
      </button>
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-white">
          {team.fullName}
        </h1>
        
        <div className="space-y-8">
          <TeamStatsSection team={team} stats={teamStats} />
          <PlayerStatsSection team={team} />
        </div>
      </div>
    </div>
  );
}