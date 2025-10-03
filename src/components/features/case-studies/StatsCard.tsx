'use client';

import { StatItem } from '@/components/features/types';
import { AnimatedCounter } from '@/components/features/case-studies/AnimatedCounter';

interface StatsCardProps {
  stat: StatItem;
  index: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stat, index }) => {
  return (
    <div 
      className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 transition-all duration-500 hover:bg-slate-800/70"
      style={{ 
        animation: `fadeIn 0.5s ease-out ${index * 0.1}s both` 
      }}
    >
      <div className="text-3xl font-bold text-orange-500 mb-2">
        <AnimatedCounter end={stat.value} />
      </div>
      <div className="text-slate-300 text-sm">{stat.label}</div>
    </div>
  );
};