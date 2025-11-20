import { CaseStudyDetailData } from '../types/caseStudyDetail';

interface HeroSectionProps {
  hero: CaseStudyDetailData['hero'];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ hero }) => {
  return (
    <section className="mb-16">
      <div className="text-orange-500 text-sm font-semibold mb-4 uppercase tracking-wide">
        {hero.category}
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
        {hero.title}
      </h1>
      
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