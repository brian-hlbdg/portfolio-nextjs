import { HeroSection }         from '@/components/features/home/HeroSection';
import { ProofStrip }           from '@/components/features/home/ProofStrip';
import { WorkIndex }             from '@/components/features/home/WorkIndex';
import { ExperienceChapters }   from '@/components/features/home/ExperienceChapters';
import { SportsBand }            from '@/components/features/home/SportsBand';
import { Footer }                from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProofStrip />
      <WorkIndex />
      <ExperienceChapters />
      <SportsBand />
      <Footer />
    </>
  );
}
