'use client';

interface BrandWordmarkProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

export function BrandWordmark({ size = 'md', showWordmark = true, className = '' }: BrandWordmarkProps) {
  const iconSize = { sm: 32, md: 44, lg: 60 }[size];
  const textClass = { sm: 'text-[9px]', md: 'text-[11px]', lg: 'text-[14px]' }[size];
  // viewBox is 119×92 → aspect ratio ≈ 0.773
  const iconHeight = Math.round(iconSize * 0.773);

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo.svg"
        width={iconSize}
        height={iconHeight}
        alt=""
        aria-hidden="true"
      />

      {showWordmark && (
        <span className={`inline-flex flex-col leading-none ${textClass}`}>
          <span className="flex justify-between font-light uppercase text-gray-400 dark:text-gray-500">
            {Array.from('BRIAN').map((c, i) => <span key={i}>{c}</span>)}
          </span>
          <span className="font-extrabold tracking-[0.28em] uppercase text-gray-900 dark:text-white">
            Hall
          </span>
          <span className="block h-[1.5px] w-full bg-primary mt-[2px]" />
        </span>
      )}
    </span>
  );
}
