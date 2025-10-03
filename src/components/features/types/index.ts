export interface StatItem {
  value: string;
  label: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  tags: string[];
  client: string;
  year: string;
  readTime: string;
  icon: string;
  featured?: boolean;
  badge?: string;
  comingSoon?: boolean;
  slug: string;
}

export interface ApproachItem {
  title: string;
  description: string;
  icon: string;
}