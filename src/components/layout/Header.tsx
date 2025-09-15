// src/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { Navigation } from './Navigation';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100 dark:bg-gray-900/90 dark:border-gray-800">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link 
            href="/" 
            className="text-xl font-medium text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-orange-400 transition-colors"
          >
            Brian H.
          </Link>
          <Navigation />
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}