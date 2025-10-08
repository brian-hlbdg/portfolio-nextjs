import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/components/features/types/blog';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Link 
      href={`/blog/${post.slug}`}
      className={`block bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${featured ? '' : ''}`}
    >
      {/* Image */}
      <div className="relative h-64 bg-slate-700/30 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-slate-500">
          <Image 
            src={post.image ?? ''}
            alt={post.title}
            fill
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {/* Replace with actual image:
        <img 
          src={`/images/blog/${post.image}`} 
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        */}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-3 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full">
            {post.category}
          </span>
          {post.tags.slice(0, 2).map((tag, idx) => (
            <span 
              key={idx}
              className="px-3 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-orange-500 transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-slate-400 text-sm mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-700">
          <span>{formatDate(post.date)}</span>
          <span className="flex items-center gap-2">
            {post.readTime}
            <span className="text-orange-500 group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
};