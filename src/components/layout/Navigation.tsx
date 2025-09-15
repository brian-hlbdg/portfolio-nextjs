// src/components/layout/Navigation.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/#about', label: 'About' },
  { href: '/#skills', label: 'Skills' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/blog', label: 'Blog' },
  { href: '/hobbies', label: 'Hobbies' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex space-x-6">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href.replace('/#', '/'));
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              text-gray-600 dark:text-gray-300 
              hover:text-primary dark:hover:text-orange-400 
              transition-colors
              ${isActive ? 'text-primary dark:text-orange-400 font-medium' : ''}
            `}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}