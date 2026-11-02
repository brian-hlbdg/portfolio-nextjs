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

const pinnedPost = allPosts.find(p => p.featured) ?? allPosts[0];

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();

export default function BlogPage() {
  const [track, setTrack]   = useState<Track>('all');
  const [search, setSearch] = useState('');

  const listPosts = useMemo(() => {
    let posts = allPosts.filter(p => p.id !== pinnedPost.id);
    if (track !== 'all') posts = posts.filter(p => getTrack(p) === track);
    if (search.trim()) {
      const q = search.toLowerCase();
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
      );
    }
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [track, search]);

  const craftCount   = allPosts.filter(p => p.id !== pinnedPost.id && getTrack(p) === 'craft').length;
  const chicagoCount = allPosts.filter(p => p.id !== pinnedPost.id && getTrack(p) === 'chicago').length;

  const tracks: { id: Track; label: string; count?: number }[] = [
    { id: 'all',     label: 'All',            count: allPosts.length - 1 },
    { id: 'craft',   label: 'Craft',          count: craftCount },
    { id: 'chicago', label: 'Chicago & life', count: chicagoCount },
  ];

  return (
    <div className="min-h-screen bg-bone-50">
      <div className="col pt-16 pb-20">

        {/* Page header */}
        <div className="flex items-baseline justify-between gap-4 mb-10">
          <div>
            <p className="font-mono text-[11px] tracking-[0.1em] text-brass uppercase mb-2">Writing</p>
            <h1 className="text-[40px] font-extrabold leading-[1.1] tracking-[-0.01em] text-ink">
              Notes on design, systems and Chicago.
            </h1>
          </div>
          <a
            href="/rss.xml"
            className="shrink-0 font-mono text-[12px] text-ink/40 hover:text-brass transition-colors duration-150"
            aria-label="RSS feed"
          >
            RSS ↗
          </a>
        </div>

        {/* Pinned essay */}
        <Link
          href={`/blog/${pinnedPost.slug}`}
          className="group flex flex-col min-[640px]:flex-row gap-6 mb-12 bg-bone-100 hover:bg-white border border-black/[0.06] rounded-[4px] overflow-hidden transition-[background-color,box-shadow] duration-200 hover:shadow-sm hover:-translate-y-[2px]"
          style={{ transition: 'background-color 200ms, box-shadow 200ms, transform 200ms' }}
        >
          {pinnedPost.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pinnedPost.image}
              alt=""
              aria-hidden="true"
              className="w-full min-[640px]:w-64 h-48 min-[640px]:h-auto object-cover shrink-0"
            />
          )}
          <div className="p-6 flex flex-col justify-center">
            <p className="font-mono text-[11px] tracking-[0.1em] text-brass uppercase mb-2">
              Pinned · {pinnedPost.category}
            </p>
            <h2 className="text-[22px] font-bold text-ink leading-snug mb-2 group-hover:text-brass transition-colors duration-150">
              {pinnedPost.title}
            </h2>
            <p className="text-[14px] text-ink/60 leading-[1.6] mb-3 line-clamp-2">{pinnedPost.excerpt}</p>
            <div className="font-mono text-[11px] text-ink/35">
              {fmtDate(pinnedPost.date)} · {pinnedPost.readTime}
            </div>
          </div>
        </Link>

        {/* Tracks + search row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex gap-2 flex-wrap">
            {tracks.map(({ id, label, count }) => (
              <button
                key={id}
                onClick={() => setTrack(id)}
                aria-pressed={track === id}
                className={`px-3 py-1.5 text-[13px] font-medium rounded-[2px] border transition-colors duration-150 min-h-[44px] ${
                  track === id
                    ? 'bg-ink text-bone-50 border-ink'
                    : 'bg-transparent text-ink/60 border-ink/20 hover:border-ink/40'
                }`}
              >
                {label}
                {count !== undefined && (
                  <span className={`ml-1.5 font-mono text-[11px] ${track === id ? 'text-bone-50/60' : 'text-ink/35'}`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 min-w-[160px]">
            <input
              type="search"
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full font-mono text-[13px] bg-transparent border border-ink/20 rounded-[2px] px-3 h-[44px] text-ink placeholder-ink/30 focus:outline-none focus:border-brass transition-colors duration-150"
            />
          </div>
        </div>

        {/* Dated index */}
        <div className="border-t-[1.5px] border-ink">
          {listPosts.length === 0 ? (
            <p className="py-12 text-center font-mono text-[13px] text-ink/35">No posts found.</p>
          ) : (
            listPosts.map(post => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex items-start gap-5 py-5 border-b border-black/10 hover:bg-bone-100 transition-colors duration-150 -mx-4 px-4"
              >
                {/* Mono date column */}
                <span className="font-mono text-[11px] text-ink/35 w-[72px] shrink-0 pt-1 leading-snug">
                  {fmtDate(post.date)}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-[17px] font-bold text-ink leading-snug mb-1 group-hover:text-brass transition-colors duration-150">
                    {post.title}
                  </h2>
                  <p className="text-[13px] text-ink/55 leading-[1.55] line-clamp-1 mb-1.5">{post.excerpt}</p>
                  <div className="font-mono text-[11px] text-ink/35 flex gap-3">
                    <span>{post.category}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Thumbnail (hidden on small screens) */}
                {post.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.image}
                    alt=""
                    aria-hidden="true"
                    className="hidden min-[560px]:block w-16 h-16 object-cover rounded-[2px] shrink-0 mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                )}
              </Link>
            ))
          )}
        </div>

      </div>
      <Footer />
    </div>
  );
}
