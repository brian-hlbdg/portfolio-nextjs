/**
 * src/app/chicago-sports/page.tsx
 * 
 * Chicago sports section landing page
 * Currently Bears-only, will have team selector when multi-team support ready
 */

'use client';

import Link from 'next/link';
import BearsDashboard from '@/components/features/dashboard/bears/BearsDashboard';

export default function ChicagoSportsPage() {
  // For now, show Bears dashboard
  // When ready to add other teams, add team selector here
  return <>
    <section aria-label="Advanced Bears analytics" className="bg-slate-950 text-white border-b border-slate-700 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-widest text-orange-300">Bears Intelligence</p><h2 className="text-lg font-bold">Go beyond the box score</h2><p className="text-sm text-slate-300">Explore players, team performance, game drives and opponent comparisons.</p></div>
        <Link href="/chicago-sports/bears/intelligence/" className="inline-flex min-h-11 items-center rounded border border-orange-400 px-4 py-2 text-sm font-semibold text-orange-200 hover:bg-orange-400/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-300">Explore intelligence <span aria-hidden="true" className="ml-2">↗</span></Link>
      </div>
    </section>
    <BearsDashboard />
  </>;
}