'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface PaletteItem {
  label: string;
  description: string;
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState('');
  const [idx, setIdx]     = useState(0);
  const router            = useRouter();
  const inputRef          = useRef<HTMLInputElement>(null);

  const items: PaletteItem[] = [
    { label: 'Selected work',    description: 'Jump to work index',           action: () => { router.push('/#work');       close(); } },
    { label: 'Experience',       description: 'Jump to experience section',    action: () => { router.push('/#experience'); close(); } },
    { label: 'Chicago Sports',   description: 'Jump to sports band',           action: () => { router.push('/#sports');     close(); } },
    { label: 'Writing',          description: 'Go to blog',                    action: () => { router.push('/blog');        close(); } },
    { label: 'Case studies',     description: 'Go to case studies index',      action: () => { router.push('/case-studies'); close(); } },
    {
      label: 'Copy email',
      description: 'brian@hlbdesigngroup.com',
      action: () => {
        navigator.clipboard.writeText('brian@hlbdesigngroup.com').catch(() => {});
        close();
      },
    },
  ];

  const filtered = query.trim()
    ? items.filter(it =>
        it.label.toLowerCase().includes(query.toLowerCase()) ||
        it.description.toLowerCase().includes(query.toLowerCase())
      )
    : items;

  const close = useCallback(() => { setOpen(false); setQuery(''); setIdx(0); }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(v => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) { setIdx(0); setTimeout(() => inputRef.current?.focus(), 20); }
  }, [open]);

  useEffect(() => { setIdx(0); }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown')  { e.preventDefault(); setIdx(i => (i + 1) % filtered.length); }
    if (e.key === 'ArrowUp')    { e.preventDefault(); setIdx(i => (i - 1 + filtered.length) % filtered.length); }
    if (e.key === 'Enter')      { e.preventDefault(); filtered[idx]?.action(); }
    if (e.key === 'Escape')     close();
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Open command palette (⌘K)"
        className="hidden min-[760px]:flex fixed bottom-6 right-6 z-40 items-center gap-2 font-mono text-[11px] text-ink/40 bg-bone-50 border border-ink/15 rounded-[2px] px-3 py-2 shadow-sm hover:border-ink/30 hover:text-ink/60 transition-colors duration-150"
      >
        <span>⌘K</span>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      onClick={close}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" aria-hidden="true" />

      {/* Palette */}
      <div
        className="relative w-full max-w-[520px] mx-4 bg-bone-50 border border-ink/15 rounded-[4px] shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-label="Command palette"
        onKeyDown={handleKeyDown}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Jump to…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full font-mono text-[14px] px-4 py-4 border-b border-ink/10 bg-transparent text-ink placeholder-ink/30 focus:outline-none"
          aria-label="Search commands"
        />

        <ul role="listbox" className="max-h-72 overflow-y-auto">
          {filtered.length === 0 ? (
            <li className="px-4 py-6 text-center font-mono text-[12px] text-ink/35">No results</li>
          ) : (
            filtered.map((item, i) => (
              <li
                key={item.label}
                role="option"
                aria-selected={i === idx}
                onClick={item.action}
                onMouseEnter={() => setIdx(i)}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors duration-100 ${
                  i === idx ? 'bg-bone-100' : 'hover:bg-bone-100/50'
                }`}
              >
                <span className="text-[14px] font-medium text-ink">{item.label}</span>
                <span className="font-mono text-[12px] text-ink/40">{item.description}</span>
              </li>
            ))
          )}
        </ul>

        <div className="px-4 py-2 border-t border-ink/10 flex gap-4 font-mono text-[11px] text-ink/30">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>Esc close</span>
        </div>
      </div>
    </div>
  );
}
