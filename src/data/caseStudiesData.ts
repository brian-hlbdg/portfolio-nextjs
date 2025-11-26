import { CaseStudy, ApproachItem } from '@/components/features/types';

export const featuredStudies: CaseStudy[] = [
  {
    id: '1', 
    title: 'Portfolio Redesign: A Decade of Growth',
    description: 'Complete rebuild of a decade-old HTML portfolio into a modern React/Next.js application featuring case studies, a blog system, and a live Chicago Sports Dashboard.',
    tags: ['React', 'Next.js', 'TypeScript', 'Personal Project', 'UX Design'],
    client: 'Personal Project',
    year: 'Aug 2025-Present',
    readTime: '10 min',
    icon: 'code',
    badge: 'Web Development',
    featured: true,
    slug: 'portfolio-redesign'
  },
  {
    id: '2',
    title: 'Wine Tasting app with Admin Panel',
    description: 'A mobile application that makes wine education accessible through guided tasting experiences, smart journaling, and community insights, addressing the intimidation factor that prevents user research.',
    tags: ['Mobile App Design', 'User Research', 'UX Design', 'React Development'],
    client: 'App Development',
    year: '2025',
    readTime: '15 min',
    icon: 'chart',
    badge: 'App creation', 
    slug: 'wine-tasting-app', 
    featured: true
  }
];

export const allCaseStudies: CaseStudy[] = [
    {
    id: '3',
    title: 'Transportation Management System Development',
    description: 'Ground-up development of enterprise logistics platform using Phoenix LiveView and Elixir. Created logical user workflows for complex transportation operations while collaborating with cross-functional teams.',
    tags: ['Phoenix LiveView', 'Elixir', 'Enterprise UX', 'Cross-functional Collaboration'],
    client: 'NFI Industries',
    year: '2017-Present',
    readTime: '12 min',
    icon: 'truck',
    featured: false,
    badge: 'Full Stack Development', 
    slug: 'nfi-tms-platform'  
    },
    {
    id: '4',
    title: 'Exception Handling in Relay TMS',
    description: 'Redesigned exception workflows to reduce context switching and standardize how logistics teams resolve shipment issues. Improved resolution times by 30% and enhanced user satisfaction.',
    tags: ['Exception Handling', 'LiveView', 'Design System', 'User Workflows'],
    client: 'NFI Industries',
    year: '2022-2023',
    readTime: '8 min',
    icon: 'layers',
    comingSoon: false,
    slug: 'nfi-relay-exception-handling'
  },
  {
    id: '5',
    title: 'E-commerce Platform Optimization',
    description: 'Complete redesign of checkout flow and product discovery for major retailer. Improved conversion rates by 28% and reduced cart abandonment by 40%.',
    tags: ['E-commerce', 'Conversion Optimization', 'A/B Testing', 'Mobile First'],
    client: 'PMall',
    year: '2010-2012',
    readTime: '8 min',
    icon: 'cart',
    comingSoon: true,
    slug: 'ecommerce-optimization'
  },
  {
    id: '6',
    title: 'Marketing Platform Redesign',
    description: 'Complete redesign of GKiC\'s marketing website and resource hub. Increased lead generation by 50% and improved content engagement metrics.',
    tags: ['Marketing', 'Lead Generation', 'Content Strategy', 'Information Architecture'],
    client: 'GKiC',
    year: '2012-2014',
    readTime: '6 min',
    icon: 'megaphone',
    comingSoon: true,
    slug: 'marketing-platform-redesign'
  },
  {
    id: '7',
    title: 'Design System Implementation',
    description: 'Built a design system across platforms. Reduced development time by 40% and ensured consistent user experience across multiple applications.',
    tags: ['Design Systems', 'Component Library', 'Scalability', 'Documentation'],
    client: 'NFI Industries',
    year: '2022-2023',
    readTime: '9 min',
    icon: 'layers',
    comingSoon: true,
    slug: 'design-system-implementation'
  }
];

export const approachItems: ApproachItem[] = [
  {
    title: 'Research & Discovery',
    description: 'Understanding user needs, business goals, and technical constraints through research and stakeholder interviews.',
    icon: 'search'
  },
  {
    title: 'Design & Development',
    description: 'Creating user-centered solutions through iterative design and implementation with modern technologies.',
    icon: 'wrench'
  },
  {
    title: 'Measure & Iterate',
    description: 'Tracking success metrics, gathering user feedback, and continuously improving the solution.',
    icon: 'chart'
  }
];