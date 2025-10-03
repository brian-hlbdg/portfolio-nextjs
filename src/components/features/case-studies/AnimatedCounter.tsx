'use client';

import { useState, useEffect } from 'react';

interface AnimatedCounterProps {
  end: string;
  duration?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  end, 
  duration = 2000 
}) => {
  const [count, setCount] = useState(0);
  const numericEnd = parseInt(end.replace(/\D/g, ''));
  const suffix = end.replace(/[\d,]/g, '');

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(numericEnd * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(numericEnd);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [numericEnd, duration]);

  return <>{count}{suffix}</>;
};