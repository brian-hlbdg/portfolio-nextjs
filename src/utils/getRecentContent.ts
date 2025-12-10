/**
 * src/utils/getRecentContent.ts
 * ========================================================================
 * UTILITY: Derive Recent Updates from Existing Data Sources
 * 
 * WHY THIS IS DRY:
 * Instead of maintaining a separate "updates" file, this utility
 * automatically aggregates content from your existing data sources:
 * - Blog posts from blogPosts.ts
 * - Case studies from caseStudiesData.ts
 * - Dashboard features (manual additions for significant updates)
 * 
 * When you add a new blog post or case study, it automatically
 * appears in the Recent Updates section without extra work.
 * 
 * INTERESTING CODE:
 * - Uses discriminated union types for different content sources
 * - Sorts by date across all content types
 * - Filters out "coming soon" items
 * - Calculates "isNew" based on recency (configurable)
 * ========================================================================
 */

import { allPosts } from '@/data/blogPosts';
import { featuredStudies, allCaseStudies } from '@/data/caseStudiesData';
import { SiteUpdate, UpdateType } from '@/components/features/types/updates';

/**
 * Configuration for "NEW" badge display
 * Items published within this many days show the badge
 */
const NEW_THRESHOLD_DAYS = 14;

/**
 * Manual dashboard/feature updates
 * 
 * ADD SPECIFIC UPDATES HERE when you add new features.
 * For dashboard updates, be specific about WHAT was added (e.g., team name)
 * rather than generic "Dashboard update" which isn't helpful.
 * 
 * EXAMPLES OF GOOD SPECIFIC UPDATES:
 * - "Chicago Fire FC Added to Dashboard"
 * - "Bears Schedule Section Added"
 * - "Dark Mode Support"
 * 
 * EXAMPLES OF BAD GENERIC UPDATES:
 * - "Dashboard Update" (too vague, doesn't tell user what's new)
 * - "New Feature" (what feature?)
 */
const manualUpdates: SiteUpdate[] = [
  // EXAMPLE: When you add a new team to the dashboard
  // {
  //   id: 'dashboard-fire-fc',
  //   type: 'dashboard',
  //   title: 'Chicago Fire FC Added to Sports Dashboard',
  //   description: 'MLS team stats and schedule now available',
  //   date: '2025-01-15',
  //   slug: '/chicago-sports',
  //   isNew: true,
  // },
  
  // EXAMPLE: When you add a new feature to the site
  // {
  //   id: 'feature-dark-mode',
  //   type: 'feature',
  //   title: 'Dark Mode Support',
  //   description: 'Toggle between light and dark themes',
  //   date: '2025-01-10',
  //   slug: '/',
  // },
];

/**
 * Check if a date is within the "new" threshold
 */
function isRecent(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= NEW_THRESHOLD_DAYS;
}

/**
 * Parse year range string to a sortable date
 * Handles formats like "2024-Present", "2023", "2022-2023"
 */
function parseYearToDate(yearString: string): string {
  // Extract the first year found
  const match = yearString.match(/(\d{4})/);
  if (match) {
    return `${match[1]}-01-01`;
  }
  return '2020-01-01'; // Fallback
}

/**
 * Get all recent content aggregated from data sources
 * 
 * @param limit - Maximum number of items to return
 * @param types - Optional filter for specific content types
 * @returns Sorted array of SiteUpdate items
 * 
 * @example
 * // Get latest 5 updates of any type
 * const updates = getRecentContent(5);
 * 
 * @example
 * // Get latest 3 blog posts only
 * const blogUpdates = getRecentContent(3, ['blog']);
 */
export function getRecentContent(
  limit = 10,
  types?: UpdateType[]
): SiteUpdate[] {
  const updates: SiteUpdate[] = [];

  // Transform blog posts
  allPosts.forEach((post) => {
    updates.push({
      id: `blog-${post.id}`,
      type: 'blog',
      title: post.title,
      date: post.date,
      slug: `/blog/${post.slug}`,
      description: post.excerpt,
      isNew: isRecent(post.date),
    });
  });

  // Transform case studies (excluding "coming soon")
  [...featuredStudies, ...allCaseStudies]
    .filter((cs) => !cs.comingSoon)
    .forEach((cs) => {
      const dateStr = parseYearToDate(cs.year);
      updates.push({
        id: `case-study-${cs.id}`,
        type: 'case-study',
        title: cs.title,
        date: dateStr,
        slug: `/case-studies/${cs.slug}`,
        description: cs.description,
        isNew: isRecent(dateStr),
      });
    });

  // Add manual updates (dashboard, features)
  manualUpdates.forEach((update) => {
    updates.push({
      ...update,
      isNew: update.isNew ?? isRecent(update.date),
    });
  });

  // Filter by type if specified
  const filtered = types
    ? updates.filter((u) => types.includes(u.type))
    : updates;

  // Sort by date (newest first)
  filtered.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Return limited results
  return filtered.slice(0, limit);
}

/**
 * Get a random selection of recent content
 * Used for the homepage "Recent Updates" section
 * 
 * INTERESTING CODE:
 * This function is designed to work with React's useState initializer.
 * The randomization happens once on component mount, not on every render.
 * This is client-side only, so it works with static export.
 * 
 * @param count - Number of items to return
 * @param pool - Maximum items to consider for randomization
 * @returns Randomly selected SiteUpdate items
 */
export function getRandomRecentContent(
  count = 2,
  pool = 10
): SiteUpdate[] {
  const allRecent = getRecentContent(pool);
  
  // Fisher-Yates shuffle for better randomization
  const shuffled = [...allRecent];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, count);
}

/**
 * Get the icon component name for a given update type
 * Used by UpdateCard to display the appropriate icon
 */
export function getUpdateTypeIcon(type: UpdateType): string {
  const iconMap: Record<UpdateType, string> = {
    blog: 'FileText',
    'case-study': 'Briefcase',
    dashboard: 'BarChart3',
    feature: 'Sparkles',
  };
  return iconMap[type];
}

/**
 * Get a human-readable label for an update type
 */
export function getUpdateTypeLabel(type: UpdateType): string {
  const labelMap: Record<UpdateType, string> = {
    blog: 'Blog Post',
    'case-study': 'Case Study',
    dashboard: 'Dashboard',
    feature: 'New Feature',
  };
  return labelMap[type];
}