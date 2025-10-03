import { ArrowRight, BarChart3 } from 'lucide-react';
import { CaseStudy } from '@/components/features/types';
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
  };

  return (
    <div className={`bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative ${featured ? 'md:col-span-1' : ''}`}>
      {/* Horizontal Layout for non-featured cards */}
      <div className={`flex ${featured ? 'flex-col' : 'flex-row'} h-full`}>
        {/* Icon Section */}
        <div className={`relative bg-slate-700/30 flex items-center justify-center ${featured ? 'h-48 w-full' : 'w-64 shrink-0'}`}>
          {study.badge && (
            <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
              study.badge === 'Featured' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
            }`}>
              {study.badge}
            </span>
          )}
          <div className="bg-slate-700 p-4 rounded-lg text-orange-500">
            {iconMap[study.icon] || iconMap.cart}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col justify-between flex-grow">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-orange-500 transition-colors">
              {study.title}
            </h3>
            
            <p className="text-slate-400 text-sm mb-4 line-clamp-2">
              {study.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {study.tags.map((tag, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-700">
            <span>{study.client} • {study.year}</span>
            <span>{study.readTime} read</span>
          </div>
        </div>

        {/* Coming Soon Badge - Bottom Left */}
        {study.comingSoon && (
          <div className="absolute bottom-6 left-6">
            <span className="inline-block px-4 py-2 bg-orange-500/90 text-white rounded-full text-sm font-semibold">
              COMING SOON
            </span>
          </div>
        )}
      </div>
    </div>
  );
};