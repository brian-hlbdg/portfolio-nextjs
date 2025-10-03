'use client';

import { useState, useEffect } from 'react';
import { StatItem } from '@/components/features/types';
import { StatsCard } from '@/components/features/case-studies/StatsCard';
import { allStats } from '@/data/statsData';

export const RotatingStats: React.FC = () => {
  const [visibleStats, setVisibleStats] = useState<StatItem[]>([]);

  useEffect(() => {
    // Initialize with first 3 stats
    setVisibleStats(allStats.slice(0, 3));

    // Rotate stats every 7 seconds
    const interval = setInterval(() => {
      setVisibleStats(prev => {
        const currentIndices = prev.map(stat => allStats.indexOf(stat));
        const nextIndices = currentIndices.map(i => (i + 3) % allStats.length);
        return nextIndices.map(i => allStats[i]);
      });
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      {visibleStats.map((stat, index) => (
        <StatsCard key={`${stat.label}-${index}`} stat={stat} index={index} />
      ))}
    </div>
  );
};