import { BlogPost } from '@/components/features/types/blog';
import { BlogCategory } from '@/components/features/types/blog';

export const featuredPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'ux-principles-complex-systems',
    title: 'UX Principles for Complex Systems',
    excerpt: 'Designing intuitive interfaces for complex systems requires a different approach than consumer applications. This article explores key principles for simplifying complexity while maintaining power and flexibility.',
    category: 'UX Design',
    tags: ['Systems Design'],
    image: '/images/blog/ux-complex-systems.gif',
    date: '2025-05-01',
    readTime: '6 min read',
    featured: true
  },
  {
    id: '2',
    slug: 'chosen-few-picnic',
    title: 'Chosen Few Picnic: A Chicago Rite of Passage',
    excerpt: 'A first-timer\'s perspective on Chicago\'s most iconic summer tradition. After 35 years, the Chosen Few Picnic continues to prove that the best cultural experiences can\'t be manufactured—they grow organically from community, history, and 12 hours of house music that moves both body and soul.',
    category: 'Personal',
    tags: ['Culture', 'Chicago'],
    image: '/images/blog/chosen-few-picnic.jpeg',
    date: '2025-06-14',
    readTime: '8 min read',
    featured: true
  }
];

export const allPosts: BlogPost[] = [
  ...featuredPosts,
  {
    id: '3',
    slug: 'design-systems-scale',
    title: 'Building Design Systems That Scale',
    excerpt: 'Lessons learned from building component libraries for enterprise applications. How to balance consistency with flexibility.',
    category: 'Design Systems',
    tags: ['Component Library', 'Scalability'],
    image: '/images/blog/design-system.jpg',
    date: '2025-04-15',
    readTime: '12 min read'
  },
  {
    id: '4',
    slug: 'accessibility-basics',
    title: 'Accessibility Is Not Optional',
    excerpt: 'Practical steps for making your applications usable by everyone. From keyboard navigation to screen readers.',
    category: 'Accessibility',
    tags: ['WCAG', 'Inclusive Design'],
    image: '/images/blog/accessibility.svg',
    date: '2025-03-22',
    readTime: '10 min read'
  },
  {
    id: '5',
    slug: 'chicago-design-community',
    title: 'The Chicago Design Community',
    excerpt: 'Exploring the vibrant design scene in Chicago. From meetups to mentorship opportunities.',
    category: 'Chicago',
    tags: ['Community', 'Personal'],
    image: '/images/blog/chicago-skyline.webp',
    date: '2025-02-18',
    readTime: '15 min read'
  },
  {
    id: '6',
    slug: 'elixir-for-designers',
    title: 'Why Designers Should Learn Elixir',
    excerpt: 'Understanding the tools your developers use can make you a better designer. My journey learning functional programming.',
    category: 'Development',
    tags: ['Elixir', 'Phoenix LiveView'],
    image: '/images/blog/elixir-code.png',
    date: '2025-01-30',
    readTime: '15 min read'
  },
  {
  id: '7',
  slug: 'growing-up-104th-parnell-part-1',
  title: 'Growing Up on 104th and Parnell, Part 1: The 90s Chicago Experience',
  image: '/images/blog/chicago1990.jpeg',
  excerpt: 'A personal dive into 1990s Chicago—where the Bulls were ascending, Black television was thriving, hip-hop was everywhere, and a block in Fernwood was its own complete world.',
  category: 'Personal',
  tags: ['Chicago', '1990s', 'Culture', 'Hip-Hop', 'Television', 'Sports'],
  date: '2025-03-15',
  readTime: '12 min read'
  },
  {
  id: '8',
  slug: 'event-storms-tms',
  title: 'Event Storms Over Journey Maps and Why It Worked',
  image: '/images/blog/event-storms-tms.jpeg',
  excerpt:'Journey maps are useful, but they break down quickly inside complex enterprise systems. Event storms helped us uncover system behavior, team misalignment, and hidden dependencies that traditional UX tools could not surface.',
  category: 'UX Insight',
  tags: ['UX Research', 'Event Storming', 'Enterprise UX', 'TMS', 'Workflow Design'],
  date: '2025-12-10',
  readTime: '9 min read'  
  }

];

export const categories: BlogCategory[] = [
  'UX Design',
  'Development',
  'Design Systems',
  'Accessibility',
  'Personal',
  'Chicago',
  'Cultural'
];