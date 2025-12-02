export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string; // Full markdown content
  category: BlogCategory;
  tags: string[];
  image: string;
  date: string; // ISO date string
  readTime: string;
  featured?: boolean;
}

export type BlogCategory = 
  | 'UX Design' 
  | 'Systems Design' 
  | 'Personal' 
  | 'Culture' 
  | 'Chicago' 
  | 'Development' 
  | 'Design Systems' 
  | 'Accessibility' 
  | 'Cultural'
  | 'Community'
  | 'Component Library'
  | 'Scalability'
  | 'WCAG'
  | 'Inclusive Design'
  | 'Elixir'
  | 'Phoenix LiveView'
  | 'Personal'
  | 'UX Insight';

