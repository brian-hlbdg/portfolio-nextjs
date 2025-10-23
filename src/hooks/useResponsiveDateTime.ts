// src/hooks/useResponsiveDateTime.ts
import { useState, useEffect } from 'react';

interface DateTimeFormats {
  desktop: string;
  mobile: string;
}

// Mobile breakpoint: 768px (matches Tailwind's md: breakpoint)
// Below 768px = mobile view (shortened format)
// 768px and above = desktop view (full format)
const MOBILE_BREAKPOINT = 768;

export function useResponsiveDateTime() {
  const [dateTime, setDateTime] = useState<DateTimeFormats>({
    desktop: '',
    mobile: ''
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if screen width is below mobile breakpoint
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

      // Desktop format: "Thursday, October 23, 2025, 09:40:53 AM Chicago, IL"
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

      // Mobile format: "Thu, 10/23/25, 09:40 AM CST"
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

      // Get timezone abbreviation (CST/CDT for Chicago) - only for mobile
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

  return {
    display: isMobile ? dateTime.mobile : dateTime.desktop,
    isMobile
  };
}