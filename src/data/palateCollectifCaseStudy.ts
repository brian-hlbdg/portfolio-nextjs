import { CaseStudyDetailData } from '@/components/features/types/caseStudyDetail';

export const palateCollectifCaseStudyData: CaseStudyDetailData = {
  hero: {
    category: 'Product Design Case Study',
    title: 'Palate Collectif: Making Wine Tasting Accessible Through Structured Learning',
    role: 'Product Designer & Frontend Developer',
    client: 'Palate Collectif',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
    timeline: '2024 - Present',
    badges: ['Greenfield', 'Mobile'],
    whyItMatters: 'End-to-end product ownership from user research through implementation, demonstrating ability to balance educational UX with technical architecture decisions.'
  },

  teamComposition: {
    size: 'Solo project',
    structure: [
      { role: 'Product Designer & Developer', count: 1, location: 'Chicago (me)' },
      { role: 'Sparkling Wine Distributor', count: 1, location: 'Chicago' }
    ],
    collaboration: 'Collaborated with wine educators for domain expertise validation'
  },

  tldr: {
    scope: 'Designed and developed a web application that helps wine drinkers capture tasting notes, learn wine vocabulary in context, and build a personal reference library. Includes both a consumer tasting interface and an admin system for managing wine data.',
    approach: 'Combined structured data inputs with educational scaffolding to reduce intimidation while maintaining the flexibility for detailed notes. Validated interaction patterns through prototype testing with users ranging from complete beginners to certified sommeliers.',
    leadership: 'Led end-to-end product design including user research, information architecture, interaction design, visual design system, and frontend implementation. Collaborated with wine educators to ensure terminology accuracy and pedagogical effectiveness.',
    impact: 'Beta users completed their first tasting note 40% faster than with traditional apps, used more specific vocabulary in their descriptions, and reported higher confidence in articulating what they tasted. The structured approach also enabled future features like personalized recommendations based on flavor profiles.'
  },

  overview: {
    challenge: {
      title: 'The Challenge',
      description: 'Wine culture carries an aura of exclusivity that intimidates newcomers. Most wine apps focus on ratings, reviews, or cellar management, but few address the core barrier: people don\'t know how to describe what they\'re tasting. Without a framework for capturing experiences, drinkers struggle to remember what they liked, learn their preferences, or develop their palate.',
      problems: [
        'Provide vocabulary and structure without overwhelming beginners',
        'Balance guided inputs with freedom for personal expression',
        'Teach wine terminology in context rather than requiring prior knowledge',
        'Create a data model that supports future discovery and recommendation features',
        'Design an admin interface for efficiently managing wine profiles at scale'
      ]
    },
    goals: {
      title: 'Project Goals',
      description: 'Create a tasting experience that educates as users engage with it, removes barriers to capturing useful notes, and builds toward a collective knowledge base where patterns emerge across users and wines.',
      objectives: [
        'Reduce time and cognitive load required to record a complete tasting note',
        'Increase use of specific wine vocabulary through inline education',
        'Design a semantic structure that makes notes searchable and comparable',
        'Establish a warm, approachable brand identity that counters wine elitism',
        'Build scalable admin tools that maintain data quality as the catalog grows'
      ]
    },
    role: {
      uxResearch: [
        'Conducted 18 user interviews with wine drinkers at various experience levels',
        'Competitive analysis of Vivino, Delectable, CellarTracker, and Wine-Searcher',
        'Contextual inquiry at wine bars and tasting events',
        'Card sorting exercises to validate information architecture',
        'Usability testing with interactive prototypes',
        'Ongoing feedback sessions with beta users'
      ],
      frontendDev: [
        'Built Next.js application with TypeScript for type safety',
        'Implemented component library using Tailwind CSS and design tokens',
        'Created accessible form patterns with keyboard navigation and screen reader support',
        'Developed theming system for light and dark modes',
        'Integrated API routes for admin CRUD operations',
        'Optimized performance for mobile devices'
      ],
      collaboration: [
        'Partnered with certified sommeliers to validate wine terminology',
        'Worked with wine educators to refine pedagogical approach',
        'Coordinated with backend developer on data model design',
        'Facilitated feedback sessions with early adopters',
        'Collaborated on content strategy for glossary and help text'
      ]
    }
  },

  developmentApproach: {
    description: 'The technical approach prioritized a clean data model that could support both immediate needs and future features like recommendations and social sharing. Rather than building everything at once, I focused on core flows that would validate the concept while establishing patterns for expansion. The frontend architecture emphasizes reusable components and consistent interaction patterns.',
    techStack: {
      frontend: [
        'Next.js 14 with App Router for file-based routing and server components',
        'TypeScript for type safety across data models and components',
        'Tailwind CSS with custom design tokens for brand consistency',
        'React Hook Form for performant form handling',
        'Radix UI primitives for accessible base components'
      ],
      backend: [
        'PostgreSQL relational database with normalized schema',
        'Prisma ORM for type-safe database queries',
        'Next.js API routes for admin operations',
        'Structured tables for wines, producers, regions, grapes, and appellations',
        'Separate vocabulary tables for aroma, flavor, and structural descriptors'
      ]
    },
    designPrinciples: [
      'Progressive disclosure: Show complexity only when needed, default to simplicity',
      'Education in context: Provide definitions and examples at the point of use',
      'Semantic structure: Use controlled vocabularies that enable comparison and search',
      'Speed without sacrifice: Optimize for quick entry while allowing depth',
      'Consistent language: Maintain design system tokens across all surfaces'
    ]
  },

  research: {
    sections: [
      {
        title: 'Understanding the Wine Intimidation Problem',
        content: 'Initial research revealed that wine terminology creates a significant barrier for newcomers. In interviews with 18 wine drinkers ranging from complete beginners to Level 2 sommeliers, three core problems emerged repeatedly: unfamiliar vocabulary, fear of saying the "wrong" thing, and no systematic way to capture preferences for future reference.',
        subsections: [
          {
            title: 'User Interviews',
            content: 'Participants described feeling overwhelmed by wine descriptors and uncertain how to begin describing what they tasted. Quote from a beginner: "I know if I like something, but I have no words for it. Is it fruity? I guess? But what kind of fruit?" This articulation gap prevents learning and makes it difficult to find similar wines later.'
          },
          {
            title: 'Competitive Analysis',
            content: 'Analysis of existing apps revealed a gap in the market. Vivino and Delectable focus on social ratings and scanning labels. CellarTracker serves serious collectors with inventory management. Wine Folly offers education but not note-taking. None combine structured tasting guidance with inline learning in a way that reduces intimidation.'
          }
        ],
        images: ['/images/case_studies/palate-collectif/wine-choices.jpeg', '/images/case_studies/palate-collectif/wine-choices-2.jpeg']
      },
      {
        title: 'Defining the Tasting Vocabulary',
        content: 'Building the vocabulary system required balancing comprehensiveness with usability. I worked with wine educators to map the Wine Aroma Wheel and other professional frameworks into categories that felt intuitive to beginners. Each descriptor includes a plain-language definition and typical examples, accessible inline without leaving the flow.',
        subsections: [
          {
            title: 'Structured vs. Freeform Input',
            content: 'Testing revealed users wanted both. Structured tags enable searching and comparison ("Show me all Pinot Noirs where I noted cherry and earthiness"). Freeform text captures context like occasion, food pairing, and emotional response. The solution provides both paths without making either feel secondary.'
          },
          {
            title: 'Reducing Steps to First Note',
            content: 'Early prototypes required too many decisions before users could save a note. Streamlining involved sensible defaults for common fields (glass type, serving temperature) and allowing users to skip sections that felt less relevant to them. The goal: let someone record a useful note in under two minutes.'
          }
        ],
        images: ['/images/case_studies/palate-collectif/wine-food-pairing.jpeg', '/images/case_studies/palate-collectif/code-example.jpeg']
      },
      {
        title: 'Information Architecture Testing',
        content: 'Card sorting sessions with eight participants validated the organization of tasting note sections. Users expected a sensory progression: appearance, aroma, taste, structure, and finish. This matched professional tasting methodology while feeling logical to beginners. Navigation hierarchy prioritized personal notes over wine discovery, reflecting that users primarily wanted to capture their own experiences.',
        images: ['/images/case_studies/palate-collectif/wine-tasting.jpeg', '/images/case_studies/palate-collectif/wine-tasting-2.png']
      },
      {
        title: 'Admin Surface Requirements',
        content: 'Managing wine data at scale requires validation and efficiency. The admin interface needed to handle both manual entry and future API imports. Key requirements included duplicate detection, region and appellation hierarchies, and the ability to correct errors without breaking existing user notes. Validation rules ensure data quality from day one.'
      }
    ]
  },

  designProcess: {
    description: 'The design process moved from rough sketches to working code quickly, validating assumptions through usability testing at each stage. Rather than perfecting static designs, I built interactive prototypes that users could tap through, revealing friction points that wouldn\'t appear in static mockups. Each iteration aimed to reduce the gap between sitting down with a glass of wine and having a complete, useful note saved.',
    steps: [
      {
        number: 1,
        title: 'Sketching and Flow Definition',
        description: 'Started with paper sketches exploring different approaches to organizing tasting notes. Tested whether appearance should come first (following professional methodology) or if aroma was more intuitive as an entry point. Mapped happy paths and edge cases like "I don\'t know what this is" scenarios.'
      },
      {
        number: 2,
        title: 'Wireframes and Information Hierarchy',
        description: 'Created digital wireframes in Figma focusing on field density, section transitions, and how to surface help text without cluttering the interface. Tested whether collapsible sections or a long scrolling form felt better. Users preferred progressive disclosure with clear section headers.'
      },
      {
        number: 3,
        title: 'Interaction Patterns for Guided Input',
        description: 'Explored multiple approaches for descriptor selection: dropdowns (too buried), autocomplete (too much typing), chips with search (winner). The chip interface made options visible while allowing quick filtering. Added the ability to quickly add frequently-used terms like "citrus" or "oak" without searching.'
      },
      {
        number: 4,
        title: 'Visual Design and Brand Identity',
        description: 'Developed a visual language that felt warm and modern rather than stuffy. Chose an amber accent color that references wine itself while standing out from typical wine app burgundy. Soft shadows and generous spacing create breathing room. Typography balances readability with personality.'
      },
      {
        number: 5,
        title: 'Component System and Tokens',
        description: 'Built a design system with reusable components: badges, chips, sliders, cards, form inputs, and buttons. Established tokens for spacing (4px base grid), border radius (6px standard, 12px cards), and color palette. This consistency accelerated development and created a cohesive feel across features.'
      },
      {
        number: 6,
        title: 'Admin Interface Design',
        description: 'Designed admin tools that prioritize speed without sacrificing accuracy. Includes inline validation, auto-suggestion for regions and producers, and preview modes. The interface mirrors the public-facing style but adds power-user features like batch operations and duplicate merging.'
      }
    ]
  },

  solution: {
    description: 'The final product makes wine tasting notes quick to capture, educational to complete, and useful to revisit. The interface guides users through each sensory dimension while teaching wine terminology in context. Structured data enables future features like personalized recommendations and community insights.',
    features: [
      {
        number: 1,
        title: 'Guided Tasting Flow',
        description: 'A single-page form organized by sensory stages: appearance (color, clarity, intensity), aroma (fruit, floral, spice, earth), taste (flavor profile), structure (acidity, tannin, body, sweetness), and finish (length, complexity). Each section uses chip selectors for common descriptors with search filtering. Sliders provide intuitive input for structural elements. Users can skip sections or add freeform notes anywhere.',
        image: '/images/case_studies/palate-collectif/solution-guided-tasting.jpeg'
      },
      {
        number: 2,
        title: 'Inline Glossary',
        description: 'Every structured field includes a help icon that reveals a plain-language definition and examples without leaving the page. For instance, tapping the help icon for "tannin" explains: "The drying sensation you feel on your tongue and gums, like after drinking black tea. Common in red wines, especially Cabernet Sauvignon and Nebbiolo." This just-in-time education reduces intimidation.',
        image: '/images/case_studies/palate-collectif/solution-guided-tasting-1.jpeg'
      },
      {
        number: 3,
        title: 'Wine Profile System',
        description: 'Each wine has a structured profile showing producer, region, grape varieties, vintage, and style characteristics. User notes appear chronologically under the profile, making it easy to see how perceptions change over time or across different bottles. Profiles support rich metadata including appellation, alcohol percentage, and aging information.',
        image: '/images/case_studies/palate-collectif/solution-guided-tasting-2.jpeg'
      },
      {
        number: 4,
        title: 'Personal Library',
        description: 'Users can view their complete tasting history, filter by grape variety or region, and search for specific descriptors. The interface surfaces patterns: "You\'ve noted cherry in 8 Pinot Noirs" or "Wines from Willamette Valley tend to be your favorites." This reflection helps users understand their own palate development.',
        image: '/images/case_studies/palate-collectif/solution-guided-tasting-3.jpeg'
      },
      {
        number: 5,
        title: 'Admin Wine Database',
        description: 'The admin interface allows efficient wine profile creation with validation for vintage years, automatic producer matching, region hierarchy navigation, and style categorization. Includes duplicate detection to prevent redundant entries. API-ready for future integrations with wine databases. Preview mode shows how entries will appear to users.',
        image: '/images/case_studies/palate-collectif/solution-guided-tasting-4.png'
      }
    ],
    improvements: [
      {
        title: 'Key UX Improvements',
        items: [
          'Reduced cognitive load by providing sensible defaults for technical fields',
          'Replaced dropdown menus with searchable chip selectors',
          'Positioned educational content inline rather than in a separate help section',
          'Enabled partial completion so users could save notes even without filling every field'
        ]
      },
      {
        title: 'Technical Foundations',
        items: [
          'Semantic data structure enables future recommendation algorithms',
          'Normalized database design prevents data duplication and inconsistency',
          'Component architecture allows rapid feature development',
          'Responsive design works equally well on phone, tablet, and desktop'
        ]
      },
      {
        title: 'Result',
        items: [
          'Beta users completed first notes 40% faster than with existing apps and reported feeling more confident using specific wine terminology in subsequent tastings'
        ]
      }
    ]
  },

  results: {
    description: 'Beta testing with 12 users over four weeks focused on measuring speed, completeness, and confidence. While the app is still in active development, early metrics validate the core hypotheses around guided structure and inline education.',
    metrics: [
      {
        label: 'Completion Time',
        value: '-40%',
        change: 'from 3.1 min vs. 5.2 min baseline',
        description: 'Reduction',
        color: 'orange'
      },
      {
        label: 'Vocabulary Usage',
        value: '+52%',
        change: 'specific descriptors used per note',
        description: 'Increase',
        color: 'green'
      },
      {
        label: 'Note Completeness',
        value: '7.2/9',
        change: 'average sections filled vs. 4.3/9 baseline',
        description: 'Sections',
        color: 'green'
      },
      {
        label: 'User Confidence',
        value: '+4.1',
        change: 'on 7-point scale pre/post study',
        description: 'Increase',
        color: 'blue'
      }
    ],
    businessOutcomes: [
      { 
        text: 'Semantic data structure enables future features like taste profile matching and personalized recommendations', 
        icon: 'check' 
      },
      { 
        text: 'Clean database design from launch reduces technical debt and scales efficiently', 
        icon: 'check' 
      },
      { 
        text: 'Approachable brand identity differentiates from competitor apps that feel exclusionary', 
        icon: 'check' 
      },
      {
        text: 'Component system accelerates development of additional features like cellar management and event planning',
        icon: 'check'
      }
    ],
    userFeedback: [
      {
        quote: 'I always felt like I needed to know more about wine before I could even talk about it. This app teaches me as I go. The little help bubbles are perfect.',
        author: 'Sarah M.',
        role: 'Beta User, Beginner'
      },
      {
        quote: 'I can finally keep track of what I actually liked instead of just vaguely remembering "that red one from two months ago." The search by flavor profile is exactly what I needed.',
        author: 'James K.',
        role: 'Beta User, Intermediate'
      },
      {
        quote: 'As someone who teaches wine classes, I appreciate that the vocabulary is accurate but not pretentious. My students would actually use this.',
        author: 'Maria R.',
        role: 'Wine Educator'
      }
    ],
    longTermValue: [
      {
        title: 'Data-Driven Discovery',
        description: 'Structured notes enable algorithmic matching: "Based on your notes, you might enjoy these Syrahs" or "Users who liked this also enjoyed..." The semantic approach makes these features possible.',
        color: 'orange'
      },
      {
        title: 'Learning Through Doing',
        description: 'Inline education reduces bounce rates and builds user confidence without requiring separate tutorial flows or documentation.',
        color: 'blue'
      },
      {
        title: 'Scalable Design System',
        description: 'Tokenized components and consistent patterns make it straightforward to expand into cellar management, event planning, or social features.',
        color: 'green'
      }
    ]
  },

  reflections: {
    description: 'Designing Palate Collectif reinforced several lessons about balancing guidance with flexibility, education with efficiency, and structure with humanity. The best tools get out of the way while quietly teaching users what they need to know.',
    whatWorkedWell: [
      {
        title: 'Just-in-Time Education',
        description: 'Providing definitions on focus rather than in a separate glossary dramatically reduced intimidation. Users felt supported without being lectured.'
      },
      {
        title: 'Progressive Disclosure',
        description: 'Not forcing users to complete every field respected different experience levels and note-taking styles while still encouraging thoroughness.'
      },
      {
        title: 'Early Technical Validation',
        description: 'Building working prototypes instead of high-fidelity mockups revealed interaction issues that would have been invisible in static designs.'
      },
      {
        title: 'Brand Warmth',
        description: 'The amber accent color and generous spacing created a welcoming atmosphere that explicitly countered wine culture\'s elitist reputation.'
      }
    ],
    challenges: [
      {
        title: 'Balancing Speed and Depth',
        description: 'Finding the right level of structure took multiple iterations. Too prescriptive felt limiting to experienced users; too open overwhelmed beginners. The solution was collapsible sections with smart defaults.',
        icon: 'alert'
      },
      {
        title: 'Admin Complexity',
        description: 'Wine data has surprising depth: region hierarchies, vintage variations, multiple producers with similar names. Building validation that catches errors without being frustrating required careful thought.',
        icon: 'alert'
      },
      {
        title: 'Expertise Spectrum',
        description: 'Designing one interface that works for first-time tasters and certified sommeliers meant constant evaluation of whether features served both groups or alienated one.',
        icon: 'alert'
      },
      {
        title: 'Scope Management',
        description: 'Resisting feature creep was difficult when so many interesting possibilities emerged. Maintaining focus on core tasting note capture ensured the foundation was solid before expanding.',
        icon: 'alert'
      }
    ],
    keyTakeaways: [
      {
        title: 'Education Belongs in the Interface',
        description: 'The best moment to teach someone is when they need the information, not before. Inline help at the point of action is far more effective than upfront tutorials.'
      },
      {
        title: 'Context is Content',
        description: 'Fields for occasion, food pairing, and companions transformed notes from data points into memories. Context makes revisiting notes meaningful and emotionally resonant.'
      },
      {
        title: 'Structure Enables Discovery',
        description: 'Semantic data isn\'t just about today\'s features. A clean schema creates possibilities for future discovery, search, and recommendation features that would be impossible with freeform text.'
      },
      {
        title: 'Constraints Can Be Freeing',
        description: 'Providing structured options reduced decision paralysis. Users didn\'t have to invent their own vocabulary—they could focus on tasting and the app provided the language.'
      }
    ]
  }
};