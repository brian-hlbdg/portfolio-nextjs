import { CaseStudyDetailData } from '../types/caseStudyDetail';

interface HeroSectionProps {
  hero: CaseStudyDetailData['hero'];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ hero }) => {
  return (
    <section className="mb-8">
      <div className="text-orange-500 text-sm font-semibold mb-4 uppercase tracking-wide">
        {hero.category}
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
        {hero.title}
      </h1>

      {/* Badges */}
      {hero.badges && hero.badges.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {hero.badges.map((badge) => (
            <span 
              key={badge}
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                badge === 'Greenfield' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : badge === 'Enterprise'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  : badge === 'Design System'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                  : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
              }`}
            >
              {badge}
            </span>
          ))}
        </div>
      )}

      {/* Why It Matters */}
      {hero.whyItMatters && (
        <div className="bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-500 p-4 mb-8 rounded-r-lg">
          <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
            <span className="font-semibold">Why this matters:</span> {hero.whyItMatters}
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-100 dark:bg-slate-800/30 border border-gray-200 dark:border-slate-700 rounded-xl p-6">
        <div>
          <div className= "text-gray-600 dark:text-slate-300 text-sm mb-1">CLIENT</div>
          <div className="text-gray-800 dark:text-white font-medium">{hero.client}</div>
        </div>
        <div>
          <div className= "text-gray-600 dark:text-slate-300 text-sm mb-1">MY ROLE</div>
          <div className="text-gray-800 dark:text-white font-medium">{hero.role}</div>
        </div>
        <div>
          <div className= "text-gray-600 dark:text-slate-300 text-sm mb-1">TIMELINE</div>
          <div className="text-gray-800 dark:text-white font-medium">{hero.timeline}</div>
        </div>
        <div>
          <div className= "text-gray-600 dark:text-slate-300 text-sm mb-1">TECHNOLOGIES</div>
          <div className="text-gray-800 dark:text-white font-medium">{hero.technologies.join(', ')}</div>
        </div>
      </div>
    </section>
  );
};