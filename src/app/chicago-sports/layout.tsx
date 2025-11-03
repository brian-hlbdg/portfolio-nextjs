/**
 * src/app/chicago-sports/layout.tsx
 * 
 * Next.js layout for chicago-sports section
 * Provides metadata and wrapper for all sports pages
 */

import { ReactNode } from 'react';

export const metadata = {
  title: 'Chicago Bears Dashboard | Live Stats & Schedule',
  description:
    'Live Chicago Bears statistics, game schedule, and player performance data powered by ESPN.',
};

export default function ChicagoSportsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {children}
    </div>
  );
}