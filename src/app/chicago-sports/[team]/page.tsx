import { use } from 'react';
import { chicagoTeams } from '@/data/chicagoTeams';
import { TeamDashboard } from '@/components/features/chicago-sports/TeamDashboard';

interface PageProps {
  params: Promise<{
    team: string;
  }>;
}

export async function generateStaticParams() {
  return chicagoTeams.map(team => ({
    team: team.id,
  }));
}

export default function TeamPage({ params }: PageProps) {
  const { team } = use(params);

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-950">
      <TeamDashboard team={team} />
    </div>
  );
}