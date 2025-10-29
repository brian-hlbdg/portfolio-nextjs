// src/components/features/dashboard/HeatmapChart.tsx
import React from 'react';
import { TeamStats } from '@/hooks/useSportsStats';

interface ChartProps {
  title: string;
  teams: TeamStats[];
}

/**
 * HEATMAP CHART COMPONENT
 * 
 * Purpose: Display performance distribution across season
 * 
 * Interesting Code:
 * - Generates 8x7 grid representing months and weeks
 * - Color intensity based on mock performance score (0-100)
 * - Hover tooltip shows exact value
 * 
 * Location in main component:
 * Rendered in CHARTS GRID section (right side on desktop, full width on mobile)
 */

export default function HeatmapChart({ title, teams }: ChartProps) {
  const generateHeatmapData = React.useMemo(() => {
    const months = ['APR', 'JUL', 'AUG', 'SEP', 'OCT', 'APR'];
    const grid = [];
    
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        // Mock performance score based on teams
        const score = Math.random() * 100;
        grid.push({
          x: j,
          y: i,
          value: Math.round(score),
          month: months[i]
        });
      }
    }
    return grid;
  }, []);

  const getHeatColor = (value: number) => {
    if (value < 20) return 'bg-red-900';
    if (value < 40) return 'bg-orange-800';
    if (value < 60) return 'bg-yellow-700';
    if (value < 80) return 'bg-lime-700';
    return 'bg-green-700';
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">{title}</h3>
      <div className="space-y-2">
        <div className="flex gap-1 flex-wrap">
          {generateHeatmapData.map((cell, idx) => (
            <div
              key={idx}
              className={`w-8 h-8 rounded transition-all hover:scale-110 cursor-pointer ${getHeatColor(cell.value)} group relative`}
            >
              <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-900 border border-slate-700 px-2 py-1 rounded text-xs text-slate-200 whitespace-nowrap z-10">
                {cell.value}% - {cell.month} W{cell.x + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}