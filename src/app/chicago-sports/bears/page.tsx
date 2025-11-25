/**
 * src/app/chicago-sports/page.tsx
 * 
 * Chicago sports section landing page
 * Currently Bears-only, will have team selector when multi-team support ready
 */

'use client';

import BearsDashboard from '@/components/features/dashboard/bears/BearsDashboard';

export default function ChicagoSportsPage() {
  // For now, show Bears dashboard
  // When ready to add other teams, add team selector here
  return <BearsDashboard />;
}