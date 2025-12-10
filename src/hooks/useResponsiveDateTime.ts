// src/hooks/useResponsiveDateTime.ts
import { useState, useEffect } from 'react';

interface DateTimeFormats {
  desktop: string;
  mobile: string;
}

const MOBILE_BREAKPOINT = 768;

export function useResponsiveDateTime() {
  const [dateTime, setDateTime] = useState<DateTimeFormats>({
    desktop: '',
    mobile: ''
  });
  const [isMobile, setIsMobile] = useState<boolean | null>(null); // Changed: null = "not yet determined"

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const desktopOptions: Intl.DateTimeFormatOptions = {
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

      const mobileOptions: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Chicago'
      };

      const desktopDateTime = now.toLocaleDateString('en-US', desktopOptions);
      const mobileDateTime = now.toLocaleDateString('en-US', mobileOptions);

      const tzFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Chicago',
        timeZoneName: 'short'
      });
      const parts = tzFormatter.formatToParts(now);
      const tzPart = parts.find(p => p.type === 'timeZoneName');
      const tzAbbr = tzPart?.value || 'CST';

      setDateTime({
        desktop: `${desktopDateTime} Chicago, IL`,
        mobile: `${mobileDateTime} ${tzAbbr}`
      });
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Return empty string until client has determined the viewport
  const display = isMobile === null 
    ? '' 
    : isMobile 
      ? dateTime.mobile 
      : dateTime.desktop;

  return {
    display,
    isMobile: isMobile ?? false // Fallback for consumers that need a boolean
  };
}