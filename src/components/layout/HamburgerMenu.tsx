// src/components/layout/HamburgerMenu.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface MenuItem {
  href: string;
  label: string;
  description?: string;
}

const menuItems: MenuItem[] = [
  { 
    href: '/', 
    label: 'Home',
    description: 'Go Back to Step One'
  },
  { 
    href: '/experience', 
    label: 'Professional Experience',
    description: 'My career journey and roles'
  },
  { 
    href: '/case-studies', 
    label: 'Case Studies',
    description: 'Deep dives into design projects'
  },
  { 
    href: '/blog', 
    label: 'Blog',
    description: 'Thoughts on design and development'
  }
];

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className={`fixed top-6 right-6 z-50 p-3 rounded-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white' 
            : 'bg-white/90 dark:bg-gray-800/90 text-gray-500 dark:text-gray-300 backdrop-blur-sm border border-gray-200 dark:border-gray-700'
        }`}
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
            isOpen ? 'rotate-45 translate-y-1' : '-translate-y-1.5'
          }`} />
          <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`} />
          <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
            isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1.5'
          }`} />
        </div>
      </button>

      {/* Backdrop Blur Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          isOpen 
            ? 'backdrop-blur-md bg-black/20 dark:bg-black/40 opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
      />

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-gray-200 dark:border-gray-700 transition-all duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="pt-20 pb-8 px-8 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Navigation</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Explore my work and experience</p>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-8 py-8">
            <ul className="space-y-6">
              {menuItems.map((item, _index) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="group block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                          {item.label}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <svg 
                        className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              <a 
                href="mailto:brian.HLBDG@outlook.com?subject=Project Discussion"
                onClick={closeMenu}
                className="w-full px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors text-center"
              >
                Start a Conversation
              </a>
              <div className="flex justify-center space-x-4 text-gray-500 dark:text-gray-400">
                <a href="https://www.linkedin.com/in/hlbdg/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://github.com/brian-hlbdg" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}