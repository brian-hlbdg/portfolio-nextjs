export interface CaseStudyDetailData {
  // Hero Section
  hero: {
    category: string;
    title: string;
    role: string;
    client: string;
    technologies: string[];
    timeline: string;
    badges?: ('Greenfield' | 'Legacy Modernization' | 'Design System' | 'Mobile' | 'Enterprise' | 'Personal Project' | 'UX Design' | 'Frontend Development')[];
    whyItMatters?: string;
  };

  teamComposition?: {
  size: string;
  structure: TeamMember[];
  collaboration?: string; // e.g., "Distributed team across 3 time zones"
  };

  // TL;DR Section
  tldr: {
    scope: string;
    approach: string;
    leadership: string;
    impact: string;
  };

  // Project Overview
  overview: {
    challenge: {
      title: string;
      description: string;
      problems: string[];
    };
    goals: {
      title: string;
      description: string;
      objectives: string[];
    };
    role: {
      uxResearch: string[];
      frontendDev: string[];
      collaboration: string[];
    };
  };

  // Development Approach
  developmentApproach: {
    description: string;
    techStack: {
      frontend: string[];
      backend: string[];
    };
    designPrinciples: string[];
  };

  // Research & Discovery
  research: {
    sections: ResearchSection[];
  };

  // Design Process
  designProcess: {
    description: string;
    steps: ProcessStep[];
  };

  // Solution
  solution: {
    description: string;
    features: SolutionFeature[];
    improvements: {
      title: string;
      items: string[];
    }[];
    beforeAfter?: BeforeAfterData;
  };

  // Results & Impact
  results: {
    description: string;
    metrics: Metric[];
    businessOutcomes: BusinessOutcome[];
    userFeedback: UserQuote[];
    longTermValue: LongTermValue[];
  };

  // Reflections
  reflections: {
    description: string;
    whatWorkedWell: ReflectionItem[];
    challenges: ReflectionItem[];
    keyTakeaways: KeyTakeaway[];
  };
}

export interface TeamMember {
  role: string;
  count?: number;
  location?: string;
  responsibilities?: string[];
}


export interface ComparisonItem {
  label: string;
  before: string;
  after: string;
}

  export interface BeforeAfterData {
  title?: string;
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  comparisons: ComparisonItem[];
}

export interface ResearchSection {
  title: string;
  content: string;
  subsections?: {
    title: string;
    content: string;
  }[];
  images?: string[];
}

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

export interface SolutionFeature {
  number: number;
  title: string;
  description: string;
  image?: string;
}

export interface Metric {
  label: string;
  value: string;
  change: string;
  description: string;
  color: 'orange' | 'green' | 'blue' | 'purple';
}

export interface BusinessOutcome {
  text: string;
  icon: 'check' | 'arrow' | 'chart';
}

export interface UserQuote {
  quote: string;
  author: string;
  role: string;
}

export interface LongTermValue {
  title: string;
  description: string;
  color: 'orange' | 'green' | 'blue';
}

export interface ReflectionItem {
  title: string;
  description: string;
  icon?: 'check' | 'alert';
}

export interface KeyTakeaway {
  title: string;
  description: string;
}