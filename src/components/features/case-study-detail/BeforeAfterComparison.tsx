'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ComparisonItem {
  label: string;
  before: string;
  after: string;
}

interface BeforeAfterComparisonProps {
  beforeImage?: string;
  afterImage?: string;
  beforeAlt?: string;
  afterAlt?: string;
  comparisons: ComparisonItem[];
  title?: string;
}

/**
 * BeforeAfterComparison Component
 * 
 * A visual comparison component showing old vs new design decisions.
 * Used in the Portfolio Redesign case study to highlight the transformation.
 * 
 * Features:
 * - Side-by-side image comparison (optional)
 * - Tabular comparison of specific elements
 * - Animated hover states
 * - Responsive layout
 * 
 * @example
 * <BeforeAfterComparison
 *   beforeImage="/images/old-site.png"
 *   afterImage="/images/new-site.png"
 *   comparisons={[
 *     { label: 'Hero', before: 'Emoji animation', after: 'Professional value prop' },
 *     { label: 'Navigation', before: 'Scroll-based', after: 'Multi-page architecture' },
 *   ]}
 * />
 */
export function BeforeAfterComparison({
  beforeImage,
  afterImage,
  beforeAlt = 'Before redesign',
  afterAlt = 'After redesign',
  comparisons,
  title = 'Design Evolution',
}: BeforeAfterComparisonProps) {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('after');

  return (
    <div className="bg-gray-50 dark:bg-slate-800/30 border border-gray-200 dark:border-slate-700 rounded-xl p-6 md:p-8">
      {/* Section Title */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        {title}
      </h3>

      {/* Image Comparison (if images provided) */}
      {(beforeImage || afterImage) && (
        <div className="mb-8">
          {/* Tab Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('before')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'before'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600'
              }`}
            >
              First Vision
            </button>
            <button
              onClick={() => setActiveTab('after')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'after'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600'
              }`}
            >
              Bears Centric
            </button>
          </div>

          {/* Image Display */}
          <div className="relative aspect-video bg-gray-100 dark:bg-slate-900 rounded-lg overflow-hidden">
            {activeTab === 'before' && beforeImage && (
              <Image
                src={beforeImage}
                alt={beforeAlt}
                fill
                className="object-contain"
              />
            )}
            {activeTab === 'after' && afterImage && (
              <Image
                src={afterImage}
                alt={afterAlt}
                fill
                className="object-contain"
              />
            )}
            {!beforeImage && activeTab === 'before' && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                Before image placeholder
              </div>
            )}
            {!afterImage && activeTab === 'after' && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                After image placeholder
              </div>
            )}

            {/* Year Badge */}
            <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 text-white text-sm font-medium rounded-full">
              {activeTab === 'before' ? 'January 2014' : 'November 2025'}
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div className="space-y-3">
        {/* Header Row */}
        <div className="grid grid-cols-3 gap-4 pb-3 border-b border-gray-200 dark:border-slate-700">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            Element
          </div>
          <div className="text-sm font-semibold text-red-500 dark:text-red-400">
            Before (2014)
          </div>
          <div className="text-sm font-semibold text-green-500 dark:text-green-400">
            After (2024)
          </div>
        </div>

        {/* Comparison Rows */}
        {comparisons.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100 dark:border-slate-800 last:border-0 hover:bg-gray-100 dark:hover:bg-slate-800/50 -mx-2 px-2 rounded-lg transition-colors"
          >
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {item.label}
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-400">
              {item.before}
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-300">
              {item.after}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Default comparison data for the Portfolio Redesign case study
 * Can be imported and used directly or as a reference
 */
export const portfolioComparisonData: ComparisonItem[] = [
  {
    label: 'Hero Section',
    before: 'Animated emojis with playful copy',
    after: 'Professional value proposition',
  },
  {
    label: 'Navigation',
    before: 'Single-page scroll anchors',
    after: 'Multi-page routing with dedicated sections',
  },
  {
    label: 'Skills Display',
    before: 'Percentage bars (Photoshop 95%)',
    after: 'Contextual groupings with domain expertise',
  },
  {
    label: 'Portfolio',
    before: 'Modal-based image gallery',
    after: 'Full case studies with process documentation',
  },
  {
    label: 'About Section',
    before: 'Generic personality traits',
    after: 'Professional narrative with HCI focus',
  },
  {
    label: 'Tech Stack',
    before: 'jQuery, HTML, CSS',
    after: 'React, Next.js 15, TypeScript, Tailwind',
  },
  {
    label: 'Content Strategy',
    before: 'Static showcase',
    after: 'Blog system for ongoing thought leadership',
  },
  {
    label: 'Personal Touch',
    before: 'Whimsical design language',
    after: 'Chicago Sports Dashboard integration',
  },
  {
    label: 'Dark Mode',
    before: 'Not supported',
    after: 'Full light/dark mode with semantic tokens',
  },
  {
    label: 'Type Safety',
    before: 'None',
    after: '100% TypeScript coverage, zero any',
  },
];

export default BeforeAfterComparison;