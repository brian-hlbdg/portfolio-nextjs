// src/components/features/dashboard/TeamCard.tsx
import React from 'react';
import Image from 'next/image';
import { TeamStats } from '@/hooks/useSportsStats';

interface TeamCardProps {
  team: TeamStats;
  isSelected?: boolean;
  onSelect?: () => void;
}

/**
 * TEAM CARD COMPONENT
 * 
 * Purpose: Display individual team record with logo and interactive selection
 * 
 * Key Features:
 * - Sport-specific color coding (NFL, NBA, NHL, MLB, WNBA, MLS)
 * - Team logo display with fallback
 * - Win-Loss record display
 * - Selection state (highlighted when selected)
 * - Responsive sizing
 * 
 * Location in main component:
 * Rendered in TEAMS GRID section (6-column grid on desktop, responsive mobile)
 * 
 * UX Details:
 * - Cursor pointer on hover indicates interactivity
 * - Scale transform on hover for tactile feedback
 * - Color scheme matches team identity
 */

function getSportColor(sport: string) {
  const colors: Record<string, { bg: string; border: string; text: string; accent: string }> = {
    NFL: { bg: 'bg-orange-950/40', border: 'border-orange-700', text: 'text-orange-400', accent: 'orange' },
    MLB: { bg: 'bg-red-950/40', border: 'border-red-700', text: 'text-red-400', accent: 'red' },
    NBA: { bg: 'bg-blue-950/40', border: 'border-blue-700', text: 'text-blue-400', accent: 'blue' },
    NHL: { bg: 'bg-slate-900/40', border: 'border-slate-700', text: 'text-slate-400', accent: 'slate' },
    WNBA: { bg: 'bg-purple-950/40', border: 'border-purple-700', text: 'text-purple-400', accent: 'purple' },
    MLS: { bg: 'bg-green-950/40', border: 'border-green-700', text: 'text-green-400', accent: 'green' }
  };
  return colors[sport] || colors.NFL;
}

export default function TeamCard({ team, isSelected, onSelect }: TeamCardProps) {
  const colors = getSportColor(team.sport);

  return (
    <button
      onClick={onSelect}
      className={`
        ${colors.bg} ${colors.border} border-2 rounded-lg p-4 
        transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-cyan-400
        ${isSelected ? `ring-2 ring-cyan-400 shadow-lg shadow-cyan-400/20` : 'hover:border-opacity-100 border-opacity-60'}
      `}
    >
      {/* Logo Section */}
      <div className="flex justify-center mb-3">
        {team.logo ? (
          <div className="relative w-12 h-12">
            <Image
              src={team.logo}
              alt={team.name}
              fill
              className="object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center">
            <span className="text-xs font-bold text-slate-400">{team.name.slice(0, 2)}</span>
          </div>
        )}
      </div>

      {/* Team Info */}
      <div className="text-center space-y-2">
        <h3 className="text-sm font-bold text-white uppercase truncate">
          {team.name.split(' ').pop()}
        </h3>
        
        {/* Record */}
        <div>
          <p className={`text-2xl font-bold ${colors.text}`}>
            {team.wins}-{team.losses}
          </p>
          <p className="text-xs text-slate-400 tracking-wide">
            {team.sport}
          </p>
        </div>

        {/* Last Updated */}
        <p className="text-xs text-slate-500 mt-1">{team.lastUpdated}</p>
      </div>
    </button>
  );
}