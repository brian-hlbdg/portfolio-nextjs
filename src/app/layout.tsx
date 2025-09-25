// src/app/layout.tsx - Adjusted for single header height
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Header } from '@/components/layout/Header';
import { EnhancedFloatingThemeToggle } from '@/components/layout/EnhancedFloatingThemeToggle';
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
  description: 'Senior UX Designer and Frontend Developer specializing in LiveView, Phoenix, and Elixir. Creating intuitive interfaces that drive business growth. Chicago-based design professional.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} [scrollbar-gutter:stable]`}>
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