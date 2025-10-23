import { Linkedin, Instagram, Briefcase, LucideIcon } from 'lucide-react';
import { socialLinks } from '@/components/ui/socialLinks';
import { JSX } from 'react';


const iconMap: Record<string, LucideIcon | (() => JSX.Element)> = {
  linkedin: Linkedin,
  indeed: Briefcase,
  instagram: Instagram,
  bluesky: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 10.5c-2.5-2-5.5-4-7-4.5-2-.7-3 .3-3 2 0 1.5.5 8.5 1 9.5s2 1.5 3.5.5c1-.7 3-2 5.5-3.5 2.5 1.5 4.5 2.8 5.5 3.5 1.5 1 3 .5 3.5-.5s1-8 1-9.5c0-1.7-1-2.7-3-2-.5.2-4.5 2.5-7 4.5z"/>
    </svg>
  )
};

export function Footer() {


  return (
    <footer className="bg-slate-800 text-gray-300 py-8 mt-auto border-t border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-6">
          
          <div className="flex gap-6">
            {socialLinks.map((link) => {
              const Icon = iconMap[link.platform];
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.ariaLabel}
                  className="text-gray-400 hover:text-orange-500 transition-colors duration-200 hover:scale-110 transform"
                >
                  <Icon />
                </a>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-sm">
              © 2025 Brian Hall. All rights reserved.
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Designed and developed by B. Hall
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}