// src/app/page.tsx
import { HeroSection } from '@/components/features/HeroSection';
import { SkillsSection } from '@/components/features/SkillsSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SkillsSection />
    </>
  );
}