// src/components/layout/Header.tsx
'use client';
import { useState, useEffect } from 'react';
import { useResponsiveDateTime } from '@/hooks/useResponsiveDateTime';
import { DropdownMenu } from './DropdownMenu';
import Link from 'next/link';

export function Header() {
  const { display: currentDateTime } = useResponsiveDateTime();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Single Header Bar - Only time/date and name */}
      <header className="fixed w-full bg-white/90 backdrop-blur-sm z-30 border-b border-gray-100 dark:bg-gray-900/90 dark:border-gray-800">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span className="truncate">{currentDateTime}</span>
          <Link 
            href="/" 
            className="font-medium whitespace-nowrap ml-4 hover:text-primary dark:hover:text-primary transition-colors">
            {isMobile ? 'Brian H.' : 'Brian L. Hall'}
          </Link>
        </div>
      </header>
      {/* Dropdown Menu Component */}
      <DropdownMenu />
    </>
  );
}