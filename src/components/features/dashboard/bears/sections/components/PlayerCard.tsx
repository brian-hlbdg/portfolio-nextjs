import React, { useState } from 'react';
import { BearsPlayer } from '@/components/features/types/bears.types';

interface PlayerCardProps {
  player: BearsPlayer;
  isInjured?: boolean;
}

function Headshot({ nflId, name }: { nflId?: string; name: string }) {
  const [errored, setErrored] = useState(false);
  if (nflId && !errored) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${nflId}.png&w=96&h=70`}
        alt={name}
        className="w-10 h-10 rounded-full object-cover object-top bg-slate-700 flex-shrink-0"
        onError={() => setErrored(true)}
        loading="lazy"
      />
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
      <span className="text-slate-400 text-sm font-bold">{name.charAt(0)}</span>
    </div>
  );
}

function experienceLabel(exp: number | undefined): string {
  if (exp === undefined) return '';
  if (exp === 0) return 'Rookie';
  if (exp === 1) return 'Yr 2';
  if (exp <= 4) return `Yr ${exp + 1}`;
  return 'Veteran';
}

export default function PlayerCard({ player, isInjured = false }: PlayerCardProps) {
  const expLabel = experienceLabel(player.experience);

  return (
    <div
      className={`
        relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all duration-150 cursor-pointer
        ${isInjured
          ? 'bg-slate-800/20 border-red-500/30 hover:border-red-500/60 hover:bg-slate-800/40'
          : 'bg-slate-800/30 border-slate-700/40 hover:border-orange-500/50 hover:bg-slate-800/50'
        }
      `}
    >
      {/* Headshot */}
      <Headshot nflId={player.nflId} name={player.name} />

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white truncate leading-tight">{player.name}</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isInjured ? 'text-red-400' : 'text-orange-400'}`}>
            #{player.number}
          </span>
          <span className="text-[10px] text-slate-500">·</span>
          <span className="text-[10px] text-slate-400 font-medium">{player.position}</span>
          {expLabel && (
            <>
              <span className="text-[10px] text-slate-600">·</span>
              <span className="text-[10px] text-slate-500">{expLabel}</span>
            </>
          )}
        </div>
        {player.college && (
          <p className="text-[10px] text-slate-600 truncate leading-tight mt-0.5">{player.college}</p>
        )}
      </div>

      {/* Injury badge */}
      {isInjured && (
        <span className="text-[9px] font-black uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/20 rounded px-1.5 py-0.5 flex-shrink-0">
          Out
        </span>
      )}

      {/* Click affordance */}
      <svg className="w-3 h-3 text-slate-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}
