/**
 * src/components/ui/RockerSwitch.tsx
 * ========================================================================
 * A reusable rocker/toggle switch component for switching between two options.
 * 
 * Features:
 * - Smooth animated transitions
 * - Accessible keyboard navigation
 * - Customizable colors and labels
 * - Supports both controlled and uncontrolled modes
 * 
 * UX: Clear visual feedback, intuitive interaction pattern
 * ========================================================================
 */

'use client';

import React from 'react';

interface RockerSwitchProps {
  /** Currently selected option: 'left' or 'right' */
  selected: 'left' | 'right';
  /** Callback when selection changes */
  onToggle: (selected: 'left' | 'right') => void;
  /** Label for the left option */
  leftLabel: string;
  /** Label for the right option */
  rightLabel: string;
  /** Optional icon for left option */
  leftIcon?: React.ReactNode;
  /** Optional icon for right option */
  rightIcon?: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

/**
 * RockerSwitch Component
 * 
 * A pill-shaped toggle switch that smoothly transitions between two states.
 * The sliding indicator shows which option is currently active.
 * 
 * Interesting code note:
 * The sliding indicator uses CSS transform for smooth GPU-accelerated animation.
 * We calculate the width dynamically and use translate-x to slide between positions.
 */
export default function RockerSwitch({
  selected,
  onToggle,
  leftLabel,
  rightLabel,
  leftIcon,
  rightIcon,
  size = 'md',
  className = '',
}: RockerSwitchProps) {
  // Size-based styling
  const sizeStyles = {
    sm: {
      container: 'h-8 text-xs',
      padding: 'px-3 py-1',
      indicator: 'h-6',
    },
    md: {
      container: 'h-10 text-sm',
      padding: 'px-4 py-2',
      indicator: 'h-8',
    },
    lg: {
      container: 'h-12 text-base',
      padding: 'px-5 py-2.5',
      indicator: 'h-10',
    },
  };

  const styles = sizeStyles[size];

  const handleKeyDown = (e: React.KeyboardEvent, option: 'left' | 'right') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(option);
    }
    // Arrow key navigation
    if (e.key === 'ArrowLeft' && selected === 'right') {
      onToggle('left');
    }
    if (e.key === 'ArrowRight' && selected === 'left') {
      onToggle('right');
    }
  };

  return (
    <div
      className={`
        relative inline-flex items-center rounded-full
        bg-gray-200 dark:bg-slate-800/60
        border border-gray-300 dark:border-slate-700/50
        ${styles.container}
        ${className}
      `}
      role="tablist"
      aria-label="Toggle view"
    >
      {/* Sliding Indicator Background */}
      {/* 
        This is the "pill" that slides between options.
        Using transform for smooth 60fps animation via GPU acceleration.
        The `left-1` positions it with a 4px margin, and we use calc() 
        to make it exactly half width minus the margins.
      */}
      <div
        className={`
          absolute top-1 left-1
          w-[calc(50%-4px)] ${styles.indicator}
          rounded-full
          bg-white dark:bg-slate-700
          shadow-sm
          border border-gray-200 dark:border-slate-600/50
          transition-transform duration-300 ease-out
          ${selected === 'right' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'}
        `}
        aria-hidden="true"
      />

      {/* Left Option */}
      <button
        role="tab"
        aria-selected={selected === 'left'}
        tabIndex={selected === 'left' ? 0 : -1}
        onClick={() => onToggle('left')}
        onKeyDown={(e) => handleKeyDown(e, 'left')}
        className={`
          relative z-10 flex-1 flex items-center justify-center gap-1.5
          ${styles.padding}
          font-semibold rounded-full
          transition-colors duration-200
          ${
            selected === 'left'
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
          }
        `}
      >
        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <span>{leftLabel}</span>
      </button>

      {/* Right Option */}
      <button
        role="tab"
        aria-selected={selected === 'right'}
        tabIndex={selected === 'right' ? 0 : -1}
        onClick={() => onToggle('right')}
        onKeyDown={(e) => handleKeyDown(e, 'right')}
        className={`
          relative z-10 flex-1 flex items-center justify-center gap-1.5
          ${styles.padding}
          font-semibold rounded-full
          transition-colors duration-200
          ${
            selected === 'right'
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
          }
        `}
      >
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        <span>{rightLabel}</span>
      </button>
    </div>
  );
}