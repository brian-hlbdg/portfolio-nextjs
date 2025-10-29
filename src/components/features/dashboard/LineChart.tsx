// src/components/features/dashboard/LineChart.tsx
import React from 'react';
import { TeamStats } from '@/hooks/useSportsStats';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartProps {
  title: string;
  teams: TeamStats[];
}

/**
 * LINE CHART COMPONENT
 * 
 * Purpose: Display attendance trends over time
 * 
 * Data Strategy:
 * - Generates mock attendance data for demo (replace with real ESPN data)
 * - Each team gets its own color-coded line
 * - X-axis shows months, Y-axis shows attendance thousands
 * 
 * Location in main component:
 * Rendered in CHARTS GRID section (left side on desktop, full width on mobile)
 * 
 * Interesting Code:
 * - useMemo prevents chart re-renders on parent state changes
 * - Recharts ResponsiveContainer handles dynamic sizing
 * - Custom tooltip shows team name and value on hover
 */

export default function LineChart({ title, teams }: ChartProps) {
  const data = React.useMemo(() => {
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    return months.map(month => {
      const dataPoint: Record<string, string | number> = { name: month };
      teams.forEach((team, idx) => {
        // Generate mock data based on team index
        dataPoint[team.name] = 800 + Math.random() * 400 + idx * 50;
      });
      return dataPoint;
    });
  }, [teams]);

  const colors = ['#22d3ee', '#f97316', '#3b82f6', '#ef4444', '#8b5cf6', '#10b981'];

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '6px' }}
            labelStyle={{ color: '#cbd5e1' }}
          />
          {teams.map((team, idx) => (
            <Line
              key={team.name}
              type="monotone"
              dataKey={team.name}
              stroke={colors[idx % colors.length]}
              dot={{ r: 3 }}
              strokeWidth={2}
              isAnimationActive={false}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}