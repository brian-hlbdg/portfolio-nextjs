// src/components/layout/Header.tsx - Single bar header only
'use client';

import { useState, useEffect } from 'react';
import { DropdownMenu } from './DropdownMenu';

export function Header() {
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric', 
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'America/Chicago'
      };
      setCurrentDateTime(now.toLocaleDateString('en-US', options) + ' Chicago, IL');
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Single Header Bar - Only time/date and name */}
      <header className="fixed w-full bg-white/90 backdrop-blur-sm z-30 border-b border-gray-100 dark:bg-gray-900/90 dark:border-gray-800">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>{currentDateTime}</span>
          <span className="font-medium">Brian Hall</span>
        </div>
      </header>

      {/* Dropdown Menu Component */}
      <DropdownMenu />
    </>
  );
}

