export interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  image: string;
  date: string;
  readTime: string;
  featured?: boolean;
  content?: string;
}
