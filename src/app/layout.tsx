import { Archivo, IBM_Plex_Mono } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/ui/CommandPalette';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-archivo',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ibm-mono',
});

export const metadata = {
  title: {
    default: 'Brian Hall · Full-Stack Engineer & HCI Researcher',
    template: '%s · Brian Hall',
  },
  icons: {
    icon: [{ url: '/icon.png' }],
    apple: [{ url: '/apple-icon.png' }],
  },
  description:
    'Full-stack engineer with an M.S. in HCI. Fifteen years from contextual inquiry to production Elixir and React. Chicago.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${ibmPlexMono.variable} [scrollbar-gutter:stable]`}
    >
      <body className="font-sans antialiased bg-bone-50 text-ink">
        <div className="min-h-screen flex flex-col">
          <Header />
          <CommandPalette />
          <main className="flex-grow pt-[60px]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
