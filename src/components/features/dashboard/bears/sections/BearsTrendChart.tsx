'use client';

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useTeamStats } from '@/hooks/useTeamStats';

const BEARS_TEAM_ID = 3;

interface TrendStat {
  category: string;
  '2024': number;
  '2025': number;
  unit: string;
}

function TrendArrow({ v2024, v2025, higherIsBetter = true }: { v2024: number; v2025: number; higherIsBetter?: boolean }) {
  if (!v2024 || !v2025) return null;
  const improved = higherIsBetter ? v2025 > v2024 : v2025 < v2024;
  return (
    <span className={`text-sm font-bold ml-1 ${improved ? 'text-green-400' : 'text-red-400'}`}>
      {improved ? '▲' : '▼'}
    </span>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs shadow-xl">
      <p className="text-slate-300 font-semibold mb-1">{label}</p>
      {payload.map((entry: { color: string; name: string; value: number }) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-400">{entry.name}:</span>
          <span className="text-white font-bold">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function BearsTrendChart() {
  const { stats: stats2024, loading: loading2024 } = useTeamStats(BEARS_TEAM_ID, 2024);
  const { stats: stats2025, loading: loading2025 } = useTeamStats(BEARS_TEAM_ID, 2025);

  const isLoading = loading2024 || loading2025;
  const hasData = stats2024 || stats2025;

  const chartData = useMemo((): TrendStat[] => {
    const gp = 17; // regular season games
    const safe = (v: number | undefined | null): number => Math.round((v ?? 0) * 10) / 10;

    return [
      {
        category: 'Pass Yds/G',
        '2024': safe(stats2024 ? stats2024.passingYards / gp : 0),
        '2025': safe(stats2025 ? stats2025.passingYards / gp : 0),
        unit: 'yds',
      },
      {
        category: 'Rush Yds/G',
        '2024': safe(stats2024 ? stats2024.rushingYards / gp : 0),
        '2025': safe(stats2025 ? stats2025.rushingYards / gp : 0),
        unit: 'yds',
      },
      {
        category: 'Points/G',
        '2024': safe(stats2024?.scoring.pointsPerGame.value),
        '2025': safe(stats2025?.scoring.pointsPerGame.value),
        unit: 'pts',
      },
      {
        category: 'Sacks',
        '2024': safe(stats2024?.sacks),
        '2025': safe(stats2025?.sacks),
        unit: '',
      },
      {
        category: 'Turnovers',
        '2024': safe(stats2024?.totalTurnovers),
        '2025': safe(stats2025?.totalTurnovers),
        unit: '',
      },
    ];
  }, [stats2024, stats2025]);

  return (
    <section>
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl font-black text-white">The Caleb Williams Era</h2>
          <p className="text-xs text-slate-500 mt-0.5">Season-over-season performance · 2024–2025</p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-slate-500" />
            <span className="text-slate-400">2024</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-orange-400" />
            <span className="text-slate-400">2025</span>
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-slate-900/50 border border-slate-700/40 rounded-2xl p-5">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="space-y-3 w-full">
              <div className="flex items-end gap-6 justify-center h-48">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-1 items-end">
                    <div className="w-8 bg-slate-700/50 rounded animate-pulse" style={{ height: `${60 + i * 15}px` }} />
                    <div className="w-8 bg-slate-700/30 rounded animate-pulse" style={{ height: `${80 + i * 10}px` }} />
                  </div>
                ))}
              </div>
              <div className="h-3 bg-slate-700/30 rounded w-full animate-pulse" />
            </div>
          </div>
        ) : !hasData ? (
          <div className="h-48 flex items-center justify-center text-center">
            <div>
              <p className="text-slate-400 text-sm">Historical stats unavailable</p>
              <p className="text-slate-600 text-xs mt-1">ESPN may not serve prior-season data</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="category"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={35}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Legend
                wrapperStyle={{ display: 'none' }}
              />
              <Bar dataKey="2024" fill="#64748b" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="2025" fill="#fb923c" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Trend summary row */}
      {!isLoading && hasData && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
          {chartData.map(stat => (
            <div key={stat.category} className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3 text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{stat.category}</p>
              <p className="text-sm font-bold text-white">
                {stat['2025'] || '—'}
                <TrendArrow
                  v2024={stat['2024']}
                  v2025={stat['2025']}
                  higherIsBetter={stat.category !== 'Turnovers'}
                />
              </p>
              <p className="text-[10px] text-slate-600">was {stat['2024'] || '—'}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
