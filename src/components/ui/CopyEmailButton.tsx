'use client';

import { useState } from 'react';

const EMAIL = 'brian@hlbdesigngroup.com';

interface CopyEmailButtonProps {
  variant?: 'ghost' | 'brass';
  className?: string;
}

export function CopyEmailButton({ variant = 'ghost', className = '' }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const el = document.createElement('textarea');
      el.value = EMAIL;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const base = 'inline-flex items-center gap-2 text-[13px] font-mono font-medium px-5 py-3 rounded-[2px] transition-colors duration-200 cursor-pointer border';

  const styles =
    variant === 'brass'
      ? 'bg-brass-500 text-ink-950 border-transparent hover:bg-brass-500/90'
      : 'bg-transparent text-ink border-ink/30 hover:border-ink/60';

  return (
    <button onClick={handleCopy} className={`${base} ${styles} ${className}`} type="button">
      {copied ? (
        <>
          <span className="text-[10px]">✓</span> Copied
        </>
      ) : (
        <>Copy email</>
      )}
    </button>
  );
}
