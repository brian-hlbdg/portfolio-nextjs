'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import { allPosts } from '@/data/blogPosts';
import { BlogPost } from '@/components/features/types/blog';

type Track = 'all' | 'craft' | 'chicago';

const CRAFT_CATEGORIES = new Set(['UX Design', 'Design Systems', 'Accessibility', 'Development']);

const getTrack = (post: BlogPost): 'craft' | 'chicago' =>
  CRAFT_CATEGORIES.has(post.category) ? 'craft' : 'chicago';

const fmtMonth = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });

const fmtYear = (iso: string) =>
  new Date(iso).getUTCFullYear();

const sortedPosts = [...allPosts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

const featuredPost = sortedPosts.find(p => p.featured) ?? sortedPosts[0];
const newestPost   = sortedPosts.find(p => p.id !== featuredPost.id) ?? sortedPosts[1];
const popularPost  = sortedPosts.find(p => p.popular) ?? sortedPosts.find(p => p.id !== featuredPost.id && p.id !== newestPost.id);

const highlightIds = new Set([featuredPost.id, newestPost?.id, popularPost?.id].filter(Boolean));

export default function BlogPage() {
  const [track, setTrack] = useState<Track>('all');
  const [search, setSearch] = useState('');

  const listPosts = useMemo(() => {
    let posts = allPosts;
    if (track !== 'all') posts = posts.filter(p => getTrack(p) === track);
    if (search.trim()) {
      const q = search.toLowerCase();
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
      );
    }
    return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [track, search]);

  // Group by year for ghost dividers
  const postsByYear = useMemo(() => {
    const groups: { year: number; posts: BlogPost[] }[] = [];
    for (const post of listPosts) {
      const year = fmtYear(post.date);
      const existing = groups.find(g => g.year === year);
      if (existing) existing.posts.push(post);
      else groups.push({ year, posts: [post] });
    }
    return groups;
  }, [listPosts]);

  const craftCount   = allPosts.filter(p => getTrack(p) === 'craft').length;
  const chicagoCount = allPosts.filter(p => getTrack(p) === 'chicago').length;

  const tracks: { id: Track; label: string; count: number }[] = [
    { id: 'all',     label: 'All',            count: allPosts.length },
    { id: 'craft',   label: 'Craft',          count: craftCount },
    { id: 'chicago', label: 'Chicago & life', count: chicagoCount },
  ];

  return (
    <div className="min-h-screen bg-bone-50">
      <div className="col">

        {/* Page heading */}
        <div className="pt-12 pb-8">
          <p className="font-mono text-[11px] tracking-[0.1em] text-brass uppercase mb-2">Writing</p>
          <h1 className="text-[40px] font-extrabold leading-[1.1] tracking-[-0.01em] text-ink">
            Essays & notes.
          </h1>
        </div>

        {/* Three-card featured block */}
        <div className="grid grid-cols-1 min-[760px]:grid-cols-[1fr_320px] gap-3 pb-12">

          {/* Main featured — ink bg, spans both rows */}
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="relative min-[760px]:row-span-2 bg-ink rounded-[3px] p-10 flex flex-col justify-end overflow-hidden min-h-[280px] min-[760px]:min-h-[320px] no-underline group"
          >
            {/* Ghost letterform */}
            <span
              aria-hidden="true"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[15%] text-white/[0.04] font-black leading-none select-none pointer-events-none"
              style={{ fontSize: 'clamp(200px, 30vw, 320px)', letterSpacing: '-0.05em' }}
            >
              B
            </span>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-brass-500 bg-brass-500/15 px-2 py-0.5 rounded-[2px]">
                  Featured
                </span>
                <span className="font-mono text-[10px] text-white/40">
                  {featuredPost.category} · {featuredPost.readTime}
                </span>
              </div>
              <h2 className="text-[clamp(22px,3vw,34px)] font-black leading-[1.1] tracking-[-0.02em] text-white mb-3 max-w-[500px] group-hover:text-brass-500 transition-colors duration-200">
                {featuredPost.title}
              </h2>
              <p className="text-[15px] leading-[1.6] text-white/50 mb-6 max-w-[480px] line-clamp-2">
                {featuredPost.excerpt}
              </p>
              <span className="font-mono text-[12px] text-brass-500">Read essay →</span>
            </div>
          </Link>

          {/* Newest post */}
          {newestPost && (
            <Link
              href={`/blog/${newestPost.slug}`}
              className="bg-bone-100 border border-black/[0.07] rounded-[3px] p-6 flex flex-col justify-between no-underline group hover:bg-white transition-colors duration-200"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-brass">New</span>
                  <span className="font-mono text-[10px] text-ink/35">
                    {newestPost.category} · {newestPost.readTime}
                  </span>
                </div>
                <h3 className="text-[17px] font-bold leading-snug text-ink mb-2 group-hover:text-brass transition-colors duration-150">
                  {newestPost.title}
                </h3>
                <p className="text-[13px] leading-[1.6] text-ink/55 line-clamp-2">{newestPost.excerpt}</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="font-mono text-[11px] text-ink/35">
                  {fmtMonth(newestPost.date)} {fmtYear(newestPost.date)}
                </span>
                <span className="font-mono text-[12px] text-brass">Read →</span>
              </div>
            </Link>
          )}

          {/* Most popular post */}
          {popularPost && (
            <Link
              href={`/blog/${popularPost.slug}`}
              className="bg-bone-100 border border-black/[0.07] rounded-[3px] p-6 flex flex-col justify-between no-underline group hover:bg-white transition-colors duration-200"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink/40">↑ Popular</span>
                  <span className="font-mono text-[10px] text-ink/35">
                    {popularPost.category} · {popularPost.readTime}
                  </span>
                </div>
                <h3 className="text-[17px] font-bold leading-snug text-ink mb-2 group-hover:text-brass transition-colors duration-150">
                  {popularPost.title}
                </h3>
                <p className="text-[13px] leading-[1.6] text-ink/55 line-clamp-2">{popularPost.excerpt}</p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="font-mono text-[11px] text-ink/35">
                  {fmtMonth(popularPost.date)} {fmtYear(popularPost.date)}
                </span>
                <span className="font-mono text-[12px] text-brass">Read →</span>
              </div>
            </Link>
          )}
        </div>

        {/* Track filters on ruled border */}
        <div className="border-t-[1.5px] border-ink">
          <div className="flex flex-wrap items-center gap-2 py-4">
            {tracks.map(({ id, label, count }) => (
              <button
                key={id}
                onClick={() => setTrack(id)}
                aria-pressed={track === id}
                className={`px-3 py-1.5 font-mono text-[12px] rounded-[2px] border transition-colors duration-150 min-h-[36px] ${
                  track === id
                    ? 'bg-ink text-bone-50 border-ink'
                    : 'bg-transparent text-ink/55 border-ink/20 hover:border-ink/40'
                }`}
              >
                {label}
                <span className={`ml-1.5 text-[10px] ${track === id ? 'text-bone-50/50' : 'text-ink/30'}`}>
                  {count}
                </span>
              </button>
            ))}

            {/* Search */}
            <input
              type="search"
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="ml-auto font-mono text-[12px] bg-transparent border border-ink/20 rounded-[2px] px-3 h-[36px] w-[180px] text-ink placeholder-ink/30 focus:outline-none focus:border-brass transition-colors duration-150"
            />
          </div>
        </div>

        {/* Post list with ghost year dividers */}
        {postsByYear.length === 0 ? (
          <p className="py-12 text-center font-mono text-[13px] text-ink/35">No posts found.</p>
        ) : (
          postsByYear.map(({ year, posts }) => (
            <div key={year} className="relative pt-14 pb-2">
              {/* Ghost year */}
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 font-black text-ink/[0.055] leading-none select-none pointer-events-none"
                style={{ fontSize: 'clamp(72px, 10vw, 108px)', letterSpacing: '-0.04em' }}
              >
                {year}
              </span>

              {/* Posts for this year */}
              <div className="relative z-10">
                {posts.map(post => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex items-baseline gap-4 py-4 border-b border-black/[0.08] no-underline transition-transform duration-200 hover:translate-x-2"
                  >
                    <span className="font-mono text-[11px] text-ink/35 w-9 shrink-0">
                      {fmtMonth(post.date)}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="text-[16px] font-bold text-ink leading-snug block group-hover:text-brass transition-colors duration-150">
                        {post.title}
                      </span>
                    </span>
                    <span className="font-mono text-[11px] text-ink/35 shrink-0 hidden sm:block">
                      {post.readTime}
                    </span>
                    <span
                      className="font-mono text-[13px] text-brass shrink-0 transition-all duration-200"
                      style={{ opacity: 0 }}
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}

        <div className="flex items-center justify-between py-8">
          <span className="font-mono text-[11px] text-ink/35">{listPosts.length} posts</span>
          <a
            href="/rss.xml"
            className="font-mono text-[11px] text-ink/35 hover:text-brass transition-colors duration-150"
          >
            RSS ↗
          </a>
        </div>

      </div>
      <Footer />
    </div>
  );
}
