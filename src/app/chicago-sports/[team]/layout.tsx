import { ReactNode } from 'react';

export const metadata = {
  title: 'Chicago Sports Dashboard',
  description: 'Chicago team stats and game information',
};

export default function TeamDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}