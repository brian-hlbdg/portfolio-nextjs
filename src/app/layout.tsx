// src/app/layout.tsx
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Header } from '@/components/layout/Header';
import { EnhancedFloatingThemeToggle } from '@/components/layout/EnhancedFloatingThemeToggle';
import type { Metadata } from 'next'
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata = {
  title: {
    default: 'Brian H. - Senior UX Designer & Frontend Developer | HLB Design Group',
    template: '%s | Brian H. - UX Designer & Frontend Developer',
  },
  icons: {
    icon: [
      { url: '/icon.png' }
    ],
    apple: [
      { url: '/apple-icon.png' }
    ],
  },
  description: 'Senior UX Designer and Frontend Developer specializing in LiveView, Phoenix, and Elixir. Creating intuitive interfaces that drive business growth. Chicago-based design professional.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} [scrollbar-gutter:stable]`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const initialTheme = theme || (systemPrefersDark ? 'dark' : 'light');
                  
                  if (initialTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 antialiased`}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow pt-16">
              {children}
            </main>
            <EnhancedFloatingThemeToggle />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}