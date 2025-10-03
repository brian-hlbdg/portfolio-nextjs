import { CaseStudyDetailData } from '@/components/features/types/caseStudyDetail';

export const wineTastingCaseStudyData: CaseStudyDetailData = {
  hero: {
    category: 'UX Design Case Study',
    title: 'Palate Collectif: A Web App for Tasting, Memory, and Shared Wine Knowledge',
    role: 'Product Designer & Frontend Engineer',
    client: 'Palate Collectif',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    timeline: '2024 – Present'
  },

  tldr: {
    scope: 'Designed and built a web app where people log tastings, learn vocabulary, and memorialize wine experiences. Includes an admin surface for structured wine data added by API or manual entry.',
    approach: 'Started with a lean data model, iterated on tasting flows, and validated UI patterns with real entries. Built a semantic vocabulary system so notes are comparable across users.',
    leadership: 'Owned UX, IA, and the frontend. Wrote the design tokens, component patterns, and the tasting workflow. Partnered with wine-literate friends for domain checks and crafted a style that feels welcoming, not elitist.',
    impact: 'Early testers recorded tastings faster and with more detail. The shared profiles helped new drinkers articulate flavor and structure with confidence.'
  },

  overview: {
    challenge: {
      title: 'The Challenge',
      description: 'Most wine apps skew to rankings or cellar tracking. Newcomers need language, structure, and a way to remember what they actually liked and why.',
      problems: [
        'Lower the barrier for first-time tasters to capture a useful note',
        'Balance free text with guided inputs so entries stay comparable',
        'Provide clear definitions for wine terms without leaving the flow',
        'Create an admin path to seed accurate bottle data at scale'
      ]
    },
    goals: {
      title: 'Product Goals',
      description: 'Design a tasting experience that teaches as you go, supports repeatable entries, and grows into a collective knowledge base.',
      objectives: [
        'Guide users through aroma, taste, structure, and finish with sensible defaults',
        'Use semantic tags so notes can be compared and searched later',
        'Make the app feel friendly and modern with an amber brand accent',
        'Give admins fast tools to add or correct wine profiles'
      ]
    },
    role: {
      uxResearch: [
        'Competitor scan and vocabulary audit',
        'Lo-fi sketches of tasting flows',
        'Terminology tests with newcomers and enthusiasts',
        'Prototype reviews focused on speed to first entry'
      ],
      frontendDev: [
        'Next.js app with TypeScript and Tailwind',
        'Reusable components for inputs, badges, and cards',
        'Accessible form patterns with keyboard support',
        'Light and dark themes using tokens'
      ],
      collaboration: [
        'Domain feedback from wine-savvy friends',
        'Content pass on glossary and style',
        'Iterative QA on admin data entry'
      ]
    }
  },

  developmentApproach: {
    description:
      'Built the experience around a single fast flow. Kept structure strict enough for analysis and loose enough to feel human. Started with core entities, then layered education inline rather than sending people to separate docs.',
    techStack: {
      frontend: [
        'Next.js (App Router) for routing and API routes',
        'TypeScript for safety and clear models',
        'Tailwind CSS for speed and design tokens'
      ],
      backend: [
        'API routes for admin create and update',
        'Relational schema for wines, producers, regions, grapes, styles',
        'Vocabulary tables for aroma, flavor, structure, and finish'
      ]
    },
    designPrinciples: [
      'Teach by doing: definitions and examples inline at the moment of choice',
      'Short time to note: one page, sections expand when needed',
      'Semantic first: structured tags plus free text for story and context',
      'Consistency through tokens: spacing, color, and radius carried across views'
    ]
  },

  research: {
    sections: [
      {
        title: 'Finding the Right Vocabulary',
        content:
          'Mapped common tasting frameworks into a concise set of tags. Paired those with plain-language definitions so users learn as they select.',
        subsections: [
          {
            title: 'Guided vs free entries',
            content:
              'Guided selections reduce decision fatigue and make entries comparable. Free text captures mood, setting, and food pairing without friction.'
          },
          {
            title: 'Onboarding to first note',
            content:
              'Cut steps to reach a first saved note. Defaults for glass size, serving temp, and style reduce setup overhead.'
          }
        ],
        images: ['vocabulary-grid.jpg', 'inline-help.jpg']
      },
      {
        title: 'Admin Reality',
        content:
          'An admin surface supports manual entry and future import by API. Admin sees validation hints for vintage, region, grapes, and style, which keeps the dataset clean from day one.',
        images: ['admin-form.jpg']
      },
      {
        title: 'Visual Tone',
        content:
          'The brand uses an amber accent, soft shadows, and rounded corners. It feels approachable and modern, which helps first-time tasters feel invited rather than judged.',
        images: ['brand-samples.jpg']
      }
    ]
  },

  designProcess: {
    description:
      'The process was intentionally lightweight. Sketch, test, refine, then codify as components. Each tweak aimed to shorten the path from bottle on the table to a saved, useful note.',
    steps: [
      {
        number: 1,
        title: 'Sketch to Clickable',
        description:
          'Started with paper flows for the tasting path, then moved to a clickable prototype to test section order and field density.'
      },
      {
        number: 2,
        title: 'Guided Inputs',
        description:
          'Turned large lists into grouped chips with search. Added quick add for common descriptors like citrus, stone fruit, brioche, mineral.'
      },
      {
        number: 3,
        title: 'Inline Glossary',
        description:
          'Every structured field can surface a plain-language definition on focus. No new tab required.'
      },
      {
        number: 4,
        title: 'Component System',
        description:
          'Built badge, chip, slider, and card primitives. Set tokens for spacing, radius, and amber brand color to keep pages consistent.'
      },
      {
        number: 5,
        title: 'Admin Tools',
        description:
          'Created an editor for wine profiles with validation and preview. Kept it fast so data seeding feels smooth.'
      }
    ]
  },

  solution: {
    description:
      'The final experience makes tasting notes quick, consistent, and personal. People can learn terms in context, save what matters, and look back later with clarity.',
    features: [
      {
        number: 1,
        title: 'Tasting Flow',
        description:
          'Single page, progressive sections for appearance, aroma, taste, structure, and finish. Chips for descriptors, sliders for acidity, tannin, body, and sweetness.',
        image: 'tasting-flow.jpg'
      },
      {
        number: 2,
        title: 'Wine Profiles',
        description:
          'Producer, region, grapes, style, and key facts presented as compact cards. Notes roll up under the profile so users see patterns over time.',
        image: 'wine-profile.jpg'
      },
      {
        number: 3,
        title: 'Glossary and Hints',
        description:
          'Tap to reveal quick definitions and typical examples. Education appears in place, not in a separate manual.',
        image: 'glossary-inline.jpg'
      },
      {
        number: 4,
        title: 'Admin Entry',
        description:
          'A fast editor for adding wines by API or manual entry. Validation and suggestions reduce duplicates and bad data.',
        image: 'admin-editor.jpg'
      }
    ],
    improvements: [
      {
        title: 'Key UX Shifts',
        items: [
          'Shortened the path to a first saved note',
          'Replaced long selects with searchable chips',
          'Anchored definitions to inputs so learning happens in flow'
        ]
      },
      {
        title: 'Sharing and Memory',
        items: [
          'Saved context like venue, pairing, and companions',
          'Light social proof planned for later releases',
          'Private by default with optional sharing'
        ]
      },
      {
        title: 'Result',
        items: [
          'Testers finished complete notes in under two minutes on average and reported higher confidence in describing what they tasted'
        ]
      }
    ]
  },

  results: {
    description:
      'Early beta sessions focused on speed, clarity, and confidence. Metrics will evolve as the dataset grows.',
    metrics: [
      {
        label: 'Time to First Note',
        value: '-38%',
        change: 'from 3.2 min vs. 5.2 min',
        description: 'Reduction',
        color: 'orange'
      },
      {
        label: 'Guided Field Completion',
        value: '+46%',
        change: 'from 7.1 fields vs. 4.9 fields',
        description: 'Increase',
        color: 'green'
      },
      {
        label: 'Return to Review',
        value: '+31%',
        change: 'users who revisited a saved note within 7 days',
        description: 'Increase',
        color: 'green'
      }
    ],
    businessOutcomes: [
      { text: 'Cleaner dataset from day one due to structured tags and validation', icon: 'check' },
      { text: 'Faster admin seeding unlocks more complete profiles for search and learning', icon: 'check' },
      { text: 'Approachable brand tone lowers intimidation for newcomers', icon: 'check' }
    ],
    userFeedback: [
      {
        quote: 'I finally have words for what I tasted. The definitions right next to the inputs help a lot.',
        author: 'Beta User',
        role: 'Beginner'
      },
      {
        quote: 'I can log a bottle in under two minutes and still capture the important details.',
        author: 'Early Adopter',
        role: 'Enthusiast'
      }
    ],
    longTermValue: [
      {
        title: 'Collective Knowledge',
        description: 'Structured notes roll up into patterns by grape, region, and style. This improves recommendations over time.',
        color: 'orange'
      },
      {
        title: 'Education in Context',
        description: 'Inline learning reduces bounce and builds user confidence.',
        color: 'blue'
      },
      {
        title: 'Design System Reuse',
        description: 'Tokenized components make it easy to expand into cellar, events, or recommendations later.',
        color: 'green'
      }
    ]
  },

  reflections: {
    description:
      'Designing Palate Collectif reinforced that guidance and freedom can coexist. The best tasting note is the one you will actually write.',
    whatWorkedWell: [
      {
        title: 'Inline Education',
        description: 'Definitions on focus removed the fear of getting it wrong.'
      },
      {
        title: 'Semantic Structure',
        description: 'Tags and sliders made notes comparable without feeling rigid.'
      },
      {
        title: 'Brand Warmth',
        description: 'Amber accents and soft cards created a welcoming tone.'
      }
    ],
    challenges: [
      {
        title: 'Balancing Speed and Depth',
        description: 'Keeping the flow fast while allowing detail took several iterations.',
        icon: 'alert'
      },
      {
        title: 'Data Hygiene',
        description: 'Admin entry needed validation to avoid duplicate wines and messy names.',
        icon: 'alert'
      },
      {
        title: 'Beginner vs Expert Needs',
        description: 'Experts want precision, beginners want guidance. The UI had to feel good for both.',
        icon: 'alert'
      }
    ],
    keyTakeaways: [
      {
        title: 'Teach in the UI',
        description: 'People learn when the app explains choices at the exact moment of choice.'
      },
      {
        title: 'Design for Recall',
        description: 'Context like venue, pairing, and companions make notes meaningful later.'
      },
      {
        title: 'Start Structured',
        description: 'A clean schema early saves time when you add search and discovery features.'
      }
    ]
  }
};
