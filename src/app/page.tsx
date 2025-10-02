import { EnhancedHeroSection } from '@/components/features/EnhancedHeroSection';
import { AboutMeSection } from '@/components/features/AboutMeSection';
import { PassionsSection } from '@/components/features/PassionsSection';
import { EducationSection } from '@/components/features/EducationSection';
import { CoreStrengthsSection } from '@/components/features/CoreStrengthsSection';
import { TechnicalToolbox } from '@/components/features/TechnicalToolbox';
import { InteractiveSkillsSection } from '@/components/features/InteractiveSkillsSection';
import { ExperienceTimeline } from '@/components/features/ExperienceTimeline';
import { LookingForward } from '@/components/features/LookingForward';
import { ContactSection } from '@/components/features/ContactSection';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <>
      <EnhancedHeroSection />
      <AboutMeSection />
      <PassionsSection />
      <EducationSection />
      <CoreStrengthsSection />
      <TechnicalToolbox />
      <InteractiveSkillsSection />
      <ExperienceTimeline />
      <LookingForward />
      <ContactSection />
      <Footer />
    </>
  );
}