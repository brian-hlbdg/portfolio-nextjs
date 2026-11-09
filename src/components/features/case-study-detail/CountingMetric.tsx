'use client';

import { useEffect, useRef, useState } from 'react';

interface CountingMetricProps {
  value: string;   // e.g. "50%", "120+", "2 yrs"
  label: string;
  description?: string;
}

function parseValue(raw: string): { num: number; prefix: string; suffix: string } {
  const match = raw.match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { num: 0, prefix: '', suffix: raw };
  return { num: parseFloat(match[2]), prefix: match[1], suffix: match[3] };
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function CountingMetric({ value, label, description }: CountingMetricProps) {
  const { num, prefix, suffix } = parseValue(value);
  const [displayed, setDisplayed] = useState(0);
  const [started, setStarted]     = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1100;
    const startTime = performance.now();
    function step(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      setDisplayed(Math.round(easeOut(progress) * num));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [started, num]);

  const isDecimal = num % 1 !== 0;
  const display   = isDecimal ? displayed.toFixed(1) : String(displayed);

  return (
    <div ref={ref} className="bg-white/[0.04] border border-white/10 rounded-[4px] p-5">
      <div className="font-mono text-[28px] font-bold text-brass leading-none mb-1">
        {prefix}{display}{suffix}
      </div>
      <div className="text-[13px] font-medium text-white mb-1">{label}</div>
      {description && (
        <div className="text-[12px] text-white/45 leading-snug">{description}</div>
      )}
    </div>
  );
}
