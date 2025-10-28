import { ReactNode } from 'react';

export const metadata = {
  title: 'Chicago Sports Dashboard',
  description: 'Live stats and information for all Chicago professional sports teams',
};

export default function ChicagoSportsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-950">
      {children}
    </div>
  );
}