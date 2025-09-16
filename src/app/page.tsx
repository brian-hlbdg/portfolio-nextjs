import { HeroSection } from '@/components/features/HeroSection';
import { SkillsSection } from '@/components/features/SkillsSection';
import { AboutSection } from '@/components/features/AboutSection';
import { ExperienceTimeline } from '@/components/features/ExperienceTimeline';
import { TechnicalToolbox } from '@/components/features/TechnicalToolbox';
import { LookingForward } from '@/components/features/LookingForward';
import { ContactSection } from '@/components/features/ContactSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SkillsSection />
      <AboutSection />
      <ExperienceTimeline />
      <TechnicalToolbox />
      <LookingForward />
      <ContactSection />
    </>
  );
}