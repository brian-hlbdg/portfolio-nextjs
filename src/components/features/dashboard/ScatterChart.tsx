// src/components/features/dashboard/ScatterChart.tsx
import React from 'react';
import { TeamStats } from '@/hooks/useSportsStats';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ChartProps {
  title: string;
  teams: TeamStats[];
}

/**
 * SCATTER CHART COMPONENT
 * 
 * Purpose: Show relationship between wins and losses
 * 
 * Interesting Code:
 * - Each team is plotted as a bar/point
 * - X-axis = Team name, Y-axis = Wins
 * - Color/size represents team sport for visual distinction
 * - Helps identify teams under/over-performing
 * 
 * Location in main component:
 * Rendered as SCATTER CHART - FULL WIDTH at bottom
 */

export default function ScatterChart({ title, teams }: ChartProps) {
  const data = teams.map(team => ({
    name: team.name.split(' ').pop(),
    wins: team.wins,
    losses: team.losses,
    sport: team.sport,
    fullName: team.name
  }));

  const sportColors: Record<string, string> = {
    NFL: '#ea580c',
    MLB: '#dc2626',
    NBA: '#2563eb',
    NHL: '#94a3b8',
    WNBA: '#a855f7',
    MLS: '#10b981'
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
          <YAxis stroke="#94a3b8" label={{ value: 'Wins', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '6px' }}
            labelStyle={{ color: '#cbd5e1' }}
            formatter={(value: any, name: any, props: any) => {
              if (name === 'wins') return [value, 'Wins'];
              if (name === 'losses') return [value, 'Losses'];
              return value;
            }}
          />
          <Bar dataKey="wins" fill="#22d3ee" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={sportColors[entry.sport] || '#22d3ee'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}