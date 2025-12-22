import { CaseStudyDetailData } from '@/components/features/types/caseStudyDetail';

export const chicagoSportsDashboardCaseStudyData: CaseStudyDetailData = {
  hero: {
    category: 'Personal Project Case Study',
    title: 'Chicago Sports Dashboard: From a City-Wide Concept to a Bears-First System',
    role: 'UX Designer & Frontend Developer',
    client: 'Personal Project',
    technologies: ['React', 'Next.js 15', 'TypeScript', 'Tailwind CSS v4', 'ESPN API', 'Local caching'],
    timeline: 'September 2025 - Present',
    badges: ['Personal Project', 'UX Design', 'Frontend Development', 'Data Visualization'],
    whyItMatters:
      'A practical demonstration of designing and building a real-time, data-driven product. It shows how I handle messy external data, UX consistency, system constraints, and progressive delivery without sacrificing readability.'
  },

  teamComposition: {
    size: 'Solo Project',
    structure: [
      { role: 'UX Designer', location: 'Chicago' },
      { role: 'Frontend Developer', location: 'Chicago' }
    ],
    collaboration: 'Independent work with periodic peer feedback on layout clarity, interaction design, and data readability'
  },

  tldr: {
    scope:
      'Designed and built a Chicago sports dashboard concept that began as a multi-team selector experience, then intentionally narrowed to a Bears-first dashboard to establish reusable patterns, validate data structures, and reduce scope risk.',
    approach:
      'Started with a city-wide concept and a CSS-driven team selection UI. Real data inconsistencies across leagues forced a strategic pivot to one team so I could design a stable template, identify data gaps, and evolve the UI toward readable, story-driven season context.',
    leadership:
      'Solo ownership across UX strategy, information architecture, UI design, component architecture, API integration, caching strategy, error states, and deployment.',
    impact:
      'Converted a visually slick concept into a functional sports product foundation with stable layout patterns, resilient data handling, and a clearer narrative flow from season overview to deeper team context.'
  },

  overview: {
    challenge: {
      title: 'The Challenge',
      description:
        'The initial goal was to reflect the Chicago sports scene with a unified dashboard experience. The first designs focused on interaction and presentation, but real sports data is inconsistent across leagues and teams. That mismatch made the earliest city-wide dashboard feel incomplete and unstable.',
      problems: [
        'A consistent UI template breaks down when each sport exposes different stats and structures',
        'Early design prioritized slick selection behavior over long-term data readability',
        'Cross-team scope introduced complexity before a stable component and data model existed',
        'The season overview cards felt too minimal to explain context or guide users through the page',
        'Desktop layouts felt underutilized and mobile layouts felt overly spacious without added meaning'
      ]
    },

    goals: {
      title: 'Project Goals',
      description:
        'Build a dashboard that feels Chicago in spirit, but is useful in practice. The interface should be data-forward, readable, and designed around what the data can reliably support.',
      objectives: [
        'Create a team selection experience that feels modern and fast',
        'Establish a consistent dashboard template that can scale across teams over time',
        'Make the UI data-forward without becoming dense or hard to scan',
        'Design resilient data handling including caching and clear error states',
        'Create a narrative flow so the page feels like a season snapshot, not a scoreboard'
      ]
    },

    role: {
      uxResearch: [
        'Defined what “at-a-glance” means for a fan scanning a season',
        'Identified which stats communicate story versus noise',
        'Reviewed how sports products structure season context (overview, schedule, team stats, roster)',
        'Validated layout and hierarchy through iterative implementation in code'
      ],
      frontendDev: [
        'Built a Next.js + TypeScript feature architecture for team dashboards',
        'Integrated ESPN API endpoints and normalized inconsistent fields into a stable UI model',
        'Implemented local caching for resilience when fetches fail',
        'Built reusable card components for overview, stats, schedule, and roster',
        'Created status handling for live, cached, and partial data load scenarios'
      ],
      collaboration: [
        'Solo project with lightweight milestone planning and scope control',
        'Used iterative shipping to avoid waiting for a perfect “all teams” version',
        'Collected informal peer review on readability and information density'
      ]
    }
  },

  developmentApproach: {
    description:
      'This project started as a design-forward city concept, then evolved into a system-building exercise. The key shift was designing around real data constraints and building a foundation that can scale across sports over time.',
    techStack: {
      frontend: [
        'Next.js 15 with React for routing and component architecture',
        'TypeScript for strict typing and predictable data contracts',
        'Tailwind CSS v4 for consistent UI patterns and rapid iteration',
        'UI cards and data density patterns tuned for scanning'
      ],
      backend: [
        'ESPN public APIs for team data, schedules, and stats',
        'Caching for fallback states when live calls fail',
        'Status modeling for live vs cached vs partial loads'
      ]
    },
    designPrinciples: [
      'Consistency is earned through normalization, not forced through visuals',
      'Readable beats flashy when data is the product',
      'Progressively reveal complexity from overview to details',
      'Use layout density intentionally, especially on desktop',
      'Error states are part of the UI, not an edge case'
    ]
  },

  research: {
    sections: [
      {
        title: 'Why I Started the Dashboard Concept',
        content:
          'The original goal was to build something that reflects the Chicago sports scene. It started as a drawer-based selector concept, but quickly turned into a bigger question: once a user picks a team, what is the best way to show meaningful season context immediately?',
        subsections: [
          {
            title: 'The Early Interaction Idea',
            content:
              'The drawer was the initial design hook. It felt slick and lightweight, and I wanted to see how far I could push the UI with CSS-first thinking.'
          },
          {
            title: 'The Idea Expanded',
            content:
              'As soon as I considered what should be inside the experience after selecting a team, it became a dashboard problem, not just a selection problem.'
          }
        ]
      },
      {
        title: 'What Felt Wrong or Incomplete',
        content:
          'I originally wanted a dashboard where all teams looked similar and followed the same template. Once I started mapping real data across teams and leagues, the idea broke down.',
        subsections: [
          {
            title: 'Inconsistent Data Across Teams',
            content:
              'The information available was different for each team and sport, and I could not keep the experience consistent without either hiding important stats or forcing irrelevant ones.'
          },
          {
            title: 'Scope Was Too Big Too Early',
            content:
              'Trying to solve all Chicago teams at once made the project feel unbounded and made it hard to lock in any stable template decisions.'
          }
        ]
      },
      {
        title: 'The First Intentional Shift',
        content:
          'I narrowed the scope to a single Bears dashboard. This was the first systems-focused decision and it unlocked progress.',
        subsections: [
          {
            title: 'Template First, Then Scale',
            content:
              'If I could build one complete dashboard, I could prove the layout, sections, and data model before attempting to scale across teams.'
          },
          {
            title: 'Data-Forward, Less Flash',
            content:
              'I intentionally moved away from flashy interaction being the core value and shifted toward a readable, data-forward layout that feels useful.'
          },
          {
            title: 'Less Overwhelm, More Iteration',
            content:
              'Working on one team made it easier to see data management issues and design issues without drowning in cross-team complexity.'
          }
        ]
      },
      {
        title: 'After the Season Overview Cards, What Still Bothered Me',
        content:
          'Even when the Season Overview cards worked, they did not tell a complete story. They provided outcomes, not context, and the page lacked narrative flow.',
        subsections: [
          {
            title: 'Density and Spacing Problems',
            content:
              'On desktop it felt too minimal and on mobile it felt too spacious. There was too much room not to communicate more meaning.'
          },
          {
            title: 'Missing Flow',
            content:
              'I wanted a natural progression from overview to schedule to stats and roster. I did not want a dashboard that felt like a scoreboard with extra boxes.'
          },
          {
            title: 'I Wanted the UI to Do Some Thinking',
            content:
              'The next iteration needed to guide the user and communicate season context, not just list numbers.'
          }
        ]
      }
    ]
  },

  designProcess: {
    description:
      'The dashboard evolved through implementation-driven design. Each iteration revealed data constraints, layout issues, and opportunities to improve narrative flow.',
    steps: [
      {
        number: 1,
        title: 'City-Wide Concept and Team Selection',
        description:
          'Started with a Chicago-first dashboard entry experience focused on team selection. Explored a CSS-forward approach for interaction polish.'
      },
      {
        number: 2,
        title: 'Reality Check: Data Consistency Breaks',
        description:
          'Mapped real sports data across teams and leagues. Discovered structural inconsistencies that prevented a single shared template from working cleanly.'
      },
      {
        number: 3,
        title: 'Scope Pivot: Bears-First Dashboard',
        description:
          'Reduced scope intentionally to create one complete dashboard and use it as the foundation for reusable patterns.'
      },
      {
        number: 4,
        title: 'Season Overview Baseline',
        description:
          'Established the first stable UI pattern with Season Overview cards. Record and win metrics created a clear entry point.'
      },
      {
        number: 5,
        title: 'Story and Flow Improvements',
        description:
          'Focused on density, layout flow, and making stats more contextual. Began adding sections that progress from overview into deeper team understanding.'
      }
    ]
  },

  solution: {
    description:
      'The solution is a Bears-first dashboard that establishes a scalable template while acknowledging real data constraints. It prioritizes readability, narrative flow, and resilient loading behavior.',
    features: [
      {
        number: 1,
        title: 'Season Overview Cards Built for Scanning',
        description:
          'A compact at-a-glance summary (record, win rate, wins, losses) that establishes immediate season context and anchors the page.',
        image: '/images/case_studies/chicago-sports-dashboard/season-overview.jpeg'
      },
      {
        number: 2,
        title: 'Team Stats with Category Filtering',
        description:
          'Stats organized into offense, defense, and special teams to reduce cognitive load and let users control data density.',
        image: '/images/case_studies/chicago-sports-dashboard/team-stats-filters.jpeg'
      },
      {
        number: 3,
        title: 'Schedule Cards Designed for Context',
        description:
          'Upcoming games presented with location, broadcast context, and a consistent card structure that reads cleanly on dark UI.',
        image: '/images/case_studies/chicago-sports-dashboard/schedule-cards.jpeg'
      },
      {
        number: 4,
        title: 'Roster Browsing and Player Detail Pattern',
        description:
          'Roster list supports quick scanning, while a player detail panel provides core identity and a clear exit to authoritative sources when deeper stats are not available.',
        image: '/images/case_studies/chicago-sports-dashboard/roster-and-player-panel.jpeg'
      },
      {
        number: 5,
        title: 'Resilient Loading with Live, Cached, and Error States',
        description:
          'Clear system feedback when data is cached, partially loaded, or unavailable. Error states are presented as UI, not hidden failures.',
        image: '/images/case_studies/chicago-sports-dashboard/error-and-retry.jpeg'
      }
    ],
    improvements: [
      {
        title: 'Product and UX Improvements',
        items: [
          'Shifted from a city-wide concept to a stable single-team template',
          'Replaced interaction-first thinking with data readability and structure',
          'Introduced narrative flow from overview into deeper context sections',
          'Improved density so desktop space is used intentionally',
          'Made system states visible (live, cached, partial load, error)'
        ]
      },
      {
        title: 'Technical Improvements',
        items: [
          'Normalized inconsistent ESPN fields into a stable UI model',
          'Strict TypeScript typing to prevent silent data mismatches',
          'Caching to reduce failures and improve perceived reliability',
          'Component patterns designed to scale to other teams later',
          'UI-level error handling with retry support'
        ]
      }
    ],
    beforeAfter: {
      title: 'From Chicago-Wide Concept to Bears-First System',
      beforeImage: '/images/case_studies/chicago-sports-dashboard/before-city-dashboard.jpeg',
      afterImage: '/images/case_studies/chicago-sports-dashboard/after-bears-dashboard.jpeg',
      beforeLabel: 'Early Concept',
      afterLabel: 'Bears-First Dashboard',
      comparisons: [
        {
          label: 'Scope',
          before: 'All Chicago teams at once',
          after: 'One team to validate templates and data'
        },
        {
          label: 'Primary UX Goal',
          before: 'Slick selection experience',
          after: 'Readable season story and reliable data'
        },
        {
          label: 'Data Handling',
          before: 'Assumed consistent structures',
          after: 'Normalized data, cached fallback, explicit states'
        },
        {
          label: 'Layout',
          before: 'Inconsistent info density across teams',
          after: 'Stable sections and predictable card patterns'
        }
      ]
    }
  },

  results: {
    description:
      'This is a personal build, so results are measured by stability, clarity, and system maturity rather than business KPIs. The main outcome is a foundation that can scale without collapsing under inconsistent data.',
    metrics: [
      {
        label: 'Dashboard Template',
        value: '1 stable baseline',
        change: 'from cross-team inconsistency',
        description: 'System foundation',
        color: 'orange'
      },
      {
        label: 'Resilient States',
        value: 'Live, cached, error',
        change: 'explicit UI feedback',
        description: 'Reliability',
        color: 'blue'
      },
      {
        label: 'Reusable Components',
        value: 'Card-based patterns',
        change: 'across overview, schedule, roster, stats',
        description: 'Scalability',
        color: 'green'
      },
      {
        label: 'Type Safety',
        value: 'Strict TypeScript',
        change: 'reduced silent data failures',
        description: 'Stability',
        color: 'purple'
      }
    ],
    businessOutcomes: [
      { text: 'A production-ready feature that demonstrates real implementation ability', icon: 'check' },
      { text: 'A clear UX narrative that shows how I make design decisions under constraint', icon: 'check' },
      { text: 'A scalable foundation for expanding to other Chicago teams later', icon: 'check' }
    ],
    userFeedback: [
      {
        quote:
          'This feels like more than a stats page. The layout makes it easy to understand the season quickly.',
        author: 'Peer Feedback',
        role: 'Design colleague'
      },
      {
        quote:
          'The error and cached states are a nice touch. It feels like a real product, not a demo.',
        author: 'Peer Feedback',
        role: 'Engineering colleague'
      }
    ],
    longTermValue: [
      {
        title: 'Scalable Template',
        description:
          'A repeatable dashboard structure that can be adapted across teams and sports without restarting design from scratch.',
        color: 'orange'
      },
      {
        title: 'Data Constraint Practice',
        description:
          'A real example of building UI around imperfect external data, including fallback strategies.',
        color: 'blue'
      },
      {
        title: 'Portfolio Credibility',
        description:
          'A functional product feature that demonstrates both UX judgment and frontend execution.',
        color: 'green'
      }
    ]
  },

  reflections: {
    description:
      'This project reinforced that good dashboards are not about showing more data. They are about making data readable, trustworthy, and structured in a way that tells a story.',
    whatWorkedWell: [
      {
        title: 'The Bears-First Pivot',
        description:
          'Reducing scope was the difference between an idea and a system. It made progress measurable and template decisions real.'
      },
      {
        title: 'Data-Forward Layout Decisions',
        description:
          'Once I treated the data as the product, the UI became clearer. The design gained purpose and the dashboard felt more mature.'
      },
      {
        title: 'Explicit UI States',
        description:
          'Treating caching and errors as first-class UX improved trust and made the experience feel more product-like.'
      }
    ],
    challenges: [
      {
        title: 'Cross-League Consistency',
        description:
          'Different sports expose different stats and structures. Achieving consistency requires normalization, not visual sameness.',
        icon: 'alert'
      },
      {
        title: 'Telling a Complete Story',
        description:
          'The season overview cards were necessary but not sufficient. The harder work was shaping flow and context.',
        icon: 'alert'
      },
      {
        title: 'Scope Control',
        description:
          'Even within one team, it is easy to expand endlessly. I had to keep shipping in stages.',
        icon: 'alert'
      }
    ],
    keyTakeaways: [
      {
        title: 'Consistency Depends on Data Contracts',
        description:
          'Dashboards feel consistent when the data model is consistent. UI polish cannot compensate for mismatched structures.'
      },
      {
        title: 'Readable Beats Dense',
        description:
          'A good sports dashboard helps you understand the season quickly. It should not force you to work to interpret it.'
      },
      {
        title: 'Flow Creates Meaning',
        description:
          'The difference between a dashboard and a stats list is narrative flow. The page needs to guide the user from summary into context.'
      }
    ]
  }
};
