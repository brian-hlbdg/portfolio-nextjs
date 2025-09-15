import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Header } from '@/components/layout/Header';
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
  keywords: 'Senior UX Design, UI Design, Frontend Development, Phoenix LiveView, Elixir, User Experience, User Interface, Product Design, Chicago Designer',
  authors: [{ name: 'Brian H. - UX Designer & Frontend Developer' }],
  creator: 'Brian H. - UX Designer & Frontend Developer',
  robots: 'index, follow',
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hlbdesigngroup.com',
    siteName: 'HLB Design Group',
    title: 'Brian H. - UX Designer & Frontend Developer | HLB Design Group',
    description: 'UX Designer and Frontend Developer specializing in LiveView, Phoenix, and Elixir. Creating intuitive interfaces that drive business growth.',
    images: [
      {
        url: 'https://hlbdesigngroup.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Brian H. - UX Designer & Frontend Developer',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Brian H. - UX Designer & Frontend Developer | HLB Design Group',
    description: 'UX Designer and Frontend Developer specializing in LiveView, Phoenix, and Elixir. Creating intuitive interfaces that drive business growth.',
    images: ['https://hlbdesigngroup.com/images/bluesky-image.jpg'],
    creator: '@hlbdg',
  },
  
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
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
            <main className="flex-grow pt-20">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}