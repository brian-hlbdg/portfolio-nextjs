import { useState } from 'react';
import { BlogCard } from './BlogCard';
import { BlogPost } from '@/components/features/types/blog';

interface FeaturedPostsSectionProps {
  posts: BlogPost[];
}

export const FeaturedPostsSection: React.FC<FeaturedPostsSectionProps> = ({ posts }) => {
  // Randomly select 2 featured posts on component mount
  const [randomFeatured] = useState(() => {
    const featured = posts.filter(p => p.featured);
    return featured.sort(() => Math.random() - 0.5).slice(0, 2);
  });

  // Only show section if there are featured posts to display
  if (randomFeatured.length === 0) {
    return null;
  }

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-semibold mb-6 text-white">Featured Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {randomFeatured.map(post => (
          <BlogCard key={post.id} post={post} featured />
        ))}
      </div>
    </section>
  );
};