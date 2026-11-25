import { ReactNode } from 'react';

export const metadata = {
  title: 'Bears Intelligence Lab | Visualization Laboratory',
  description:
    'Football analytics visualization laboratory — component prototypes and data visualization experiments. Fixture data only.',
};

export default function LabLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
