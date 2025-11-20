// src/components/layout/DropdownMenu.tsx
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

export function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

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
      {/* Hamburger Button - positioned below the header */}
      <button
        onClick={toggleMenu}
        className={`fixed top-20 right-6 z-50 p-3 rounded-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg' 
            : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800'
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

      {/* Background Blur Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          isOpen 
            ? 'backdrop-blur-md bg-black/20 dark:bg-black/40 opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
      />

      {/* Dropdown Menu Panel - slides down from top, no background */}
      <div
        className={`fixed top-16 left-0 right-0 z-40 transition-all duration-500 ease-out ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">

            {/* Menu Items - Vertical Centered Layout */}
            <nav className="mb-12">
              <ul className="space-y-8 max-w-2xl mx-auto">
                {menuItems.map((item, index) => (
                  <li 
                    key={item.href}
                    className={`transition-all duration-300 delay-${(index + 1) * 100} ${
                      isOpen ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
                    }`}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className="group block p-8 rounded-xl hover:bg-white/10 dark:hover:bg-black/20 transition-all duration-200 text-center backdrop-blur-sm"
                    >
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white group-hover:text-primary group-hover:scale-105 transition-all duration-200 drop-shadow-lg">
                        {item.label}
                      </h3>
                      {item.description && (
                        <p className="text-gray-600 dark:text-white/80 group-hover:text-white mt-2 drop-shadow">
                          {item.description}
                        </p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* CTA and Social Links */}
            <div className={`text-center transition-all duration-500 delay-400 ${
              isOpen ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}>
              <a 
                href="mailto:brian.HLBDG@outlook.com?subject=Project Discussion"
                onClick={closeMenu}
                className="inline-block px-8 py-4 bg-primary hover:bg-primary-dark text-gray-800 dark:text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-2xl mb-8 drop-shadow-lg"
              >
                Start a Conversation
              </a>
              
              <div className="flex justify-center space-x-6 text-gray-900 dark:text-white/70">
                <a 
                  href="https://www.linkedin.com/in/hlbdg/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors transform hover:scale-110 drop-shadow"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="https://github.com/brian-hlbdg" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors transform hover:scale-110 drop-shadow"
                >
                  <span className="sr-only">GitHub</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.239 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
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

