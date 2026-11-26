'use client';

export default function PrintButton() {
  return (
    <button type="button"
          onClick={() => window.print()}
          className="bg-white/10 hover:bg-white/20 transition-colors text-white px-4 py-1.5 rounded-[3px] text-[11px] tracking-[0.05em] cursor-pointer"
        >
          Print / Save as PDF
        </button>
  );
}
