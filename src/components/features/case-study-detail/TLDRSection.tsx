import { CaseStudyDetailData } from '@/components/features/types/caseStudyDetail';

interface TLDRSectionProps {
  tldr: CaseStudyDetailData['tldr'];
}

export const TLDRSection: React.FC<TLDRSectionProps> = ({ tldr }) => {
  return (
    <section className="mb-16 bg-orange-500/10 border border-orange-500/30 rounded-xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-orange-500">TL;DR: Building a TMS Platform from the Ground Up</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Scope:</h3>
          <p className="text-slate-300">{tldr.scope}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Approach:</h3>
          <p className="text-slate-300">{tldr.approach}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">What I did:</h3>
          <p className="text-slate-300">{tldr.leadership}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Impact:</h3>
          <p className="text-slate-300">{tldr.impact}</p>
        </div>
      </div>
    </section>
  );
};