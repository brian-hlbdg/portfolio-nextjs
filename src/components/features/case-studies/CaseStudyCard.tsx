import { BarChart3, ArrowRight } from 'lucide-react';
import { CaseStudy } from '@/components/features/types';
import Link from 'next/link';
import { JSX } from 'react';

interface CaseStudyCardProps {
  study: CaseStudy;
  featured?: boolean;
}

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ 
  study, 
  featured = false 
}) => {
  const iconMap: { [key: string]: JSX.Element } = {
    truck: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M18 18.5a1.5 1.5 0 01-1.5-1.5 1.5 1.5 0 011.5-1.5 1.5 1.5 0 011.5 1.5 1.5 1.5 0 01-1.5 1.5m1.5-9l1.96 2.5H17V9.5m-11 9A1.5 1.5 0 014.5 17 1.5 1.5 0 016 15.5 1.5 1.5 0 017.5 17 1.5 1.5 0 016 18.5M20 8h-3V4H3c-1.11 0-2 .89-2 2v11h2a3 3 0 003 3 3 3 0 003-3h6a3 3 0 003 3 3 3 0 003-3h2v-5l-3-4z"/></svg>,
    chart: <BarChart3 className="w-8 h-8" />,
    cart: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17 18a2 2 0 010 4 2 2 0 010-4M1 2h3.27l.94 2H20a1 1 0 01.78 1.63l-4.5 5.5a1 1 0 01-.78.37H8.53L7.06 14H19v2H7a2 2 0 01-2-2 2 2 0 01.25-1l1.5-2.7L3 4H1V2m6 16a2 2 0 010 4 2 2 0 010-4z"/></svg>,
    megaphone: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8v13H9V8H3a1 1 0 01-1-1V6a1 1 0 011-1h18a1 1 0 011 1v1a1 1 0 01-1 1h-9z"/></svg>,
    layers: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
    code: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 3a2 2 0 00-2 2v4a2 2 0 01-2 2H3v2h1a2 2 0 012 2v4a2 2 0 002 2h2v-2H8v-5a2 2 0 00-2-2 2 2 0 002-2V5h2V3H8zm8 0a2 2 0 012 2v4a2 2 0 002 2h1v2h-1a2 2 0 00-2 2v4a2 2 0 01-2 2h-2v-2h2v-5a2 2 0 012-2 2 2 0 01-2-2V5h-2V3h2z"/></svg>,
  };

  // For coming soon cards, use a div instead of Link
  if (study.comingSoon) {
    return (
      <div className={`bg-gray-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative ${featured ? 'md:col-span-1' : ''}`}>
        <div className={`flex ${featured ? 'flex-col' : 'flex-col sm:flex-row'} h-full`}>
          {/* Icon Section */}
          <div className={`relative bg-gray-100 dark:bg-slate-800/40 flex items-center justify-center ${
            featured 
              ? 'h-48 w-full' 
              : 'h-32 sm:h-auto sm:w-40 md:w-48 shrink-0'
          }`}>
            {/* Badge - Top Right - Show either category badge OR coming soon */}
              {study.comingSoon ? (
                <span className="absolute top-3 right-3 px-2.5 py-1 bg-orange-500 text-gray-300 dark:text-white rounded-md text-xs font-semibold">
                  COMING SOON
                </span>
              ) : study.badge && (
                <span className={`absolute top-3 right-3 px-3 py-1 rounded-md text-xs font-semibold ${
                  study.badge === 'Featured' ? 'bg-green-600 text-gray-300 dark:text-white' : 'bg-blue-600 text-gray-300 dark:text-white'
                }`}>
                  {study.badge}
                </span>
              )}
            <div className="bg-slate-200 dark:bg-slate-700 p-4 rounded-lg text-orange-500">
              {iconMap[study.icon] || iconMap.cart}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 sm:p-6 flex flex-col justify-between flex-grow">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors flex-1">
                  {study.title}
                </h3>
                <ArrowRight className="text-slate-600 dark:text-slate-300 flex-shrink-0 mt-1 hidden sm:block" size={20} />
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-3 sm:mb-4 leading-relaxed">
                {study.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                {study.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-2.5 py-1 bg-gray-100 dark:bg-slate-700/50 text-gray-600 dark:text-slate-300 text-xs rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-700">
              <span>{study.client} • {study.year}</span>
              <span className="hidden sm:inline">{study.readTime}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For clickable cards, use Link
  return (
    <Link 
      href={`/case-studies/${study.slug}`}
      className={`block bg-gray-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative ${featured ? 'md:col-span-1' : ''}`}
    >
      <div className={`flex ${featured ? 'flex-col' : 'flex-col sm:flex-row'} h-full`}>
        {/* Icon Section */}
        <div className={`relative bg-gray-100 dark:bg-slate-800/40 flex items-center justify-center ${
          featured 
            ? 'h-48 w-full' 
            : 'h-32 sm:h-auto sm:w-40 md:w-48 shrink-0'
        }`}>
          {/* Badge - Top Right */}
          {study.badge && (
            <span className={`absolute top-3 right-3 px-3 py-1 rounded-md text-xs font-semibold ${
              study.badge === 'Featured' ? 'bg-green-600 text-gray-300 dark:text-white' : 'bg-blue-600 text-gray-300 dark:text-white'
            }`}>
              {study.badge}
            </span>
          )}
          <div className="bg-slate-200 dark:bg-slate-700 p-4 rounded-lg text-orange-500">
            {iconMap[study.icon] || iconMap.cart}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-6 flex flex-col justify-between flex-grow">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors flex-1">
                {study.title}
              </h3>
              <ArrowRight className="text-slate-600 dark:text-slate-300 flex-shrink-0 mt-1 hidden sm:block" size={20} />
            </div>
            
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-3 sm:mb-4 leading-relaxed">
              {study.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
              {study.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-2.5 py-1 bg-gray-100 dark:bg-slate-700/50 text-gray-600 dark:text-slate-300 text-xs rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-900 dark:text-slate-300 pt-3 sm:pt-4 border-t border-gray-200 dark:border-slate-700">
            <span>{study.client} • {study.year}</span>
            <span className="hidden sm:inline">{study.readTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};