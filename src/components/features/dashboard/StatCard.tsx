// src/components/features/dashboard/StatCard.tsx
import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

/**
 * STAT CARD COMPONENT
 * 
 * Purpose: Display aggregate metrics in a consistent card format
 * 
 * Design Pattern:
 * - Minimal, data-forward design
 * - Consistent spacing and typography
 * - Optional trend indicator
 * - Hover state for interactivity
 * 
 * Location in main component:
 * Rendered in the TOP METRICS ROW section (first grid after header)
 */

export default function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:bg-slate-800 transition-colors group cursor-pointer">
      {/* Icon + Label Row */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">
          {label}
        </p>
        {icon && <div className="text-cyan-400 group-hover:scale-110 transition-transform">{icon}</div>}
      </div>

      {/* Value + Trend Row */}
      <div className="flex items-baseline justify-between">
        <p className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
          {value}
        </p>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              trend === 'up'
                ? 'bg-green-900/30 text-green-400'
                : trend === 'down'
                ? 'bg-red-900/30 text-red-400'
                : 'bg-slate-700/30 text-slate-300'
            }`}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
    </div>
  );
}