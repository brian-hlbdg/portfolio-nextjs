/**
 * src/components/features/types/updates.ts
 * ========================================================================
 * TYPE DEFINITIONS FOR SITE UPDATES
 * 
 * These types define the shape of update items that appear in the
 * "Recent Updates" section. Content is derived from existing data sources
 * to keep things DRY.
 * ========================================================================
 */

/**
 * The type of content update
 * - blog: New blog post
 * - case-study: New or updated case study
 * - dashboard: New dashboard feature (e.g., new team added)
 * - feature: Site feature or enhancement
 */
export type UpdateType = 'blog' | 'case-study' | 'dashboard' | 'feature';

/**
 * Represents a single update item for display
 */
export interface SiteUpdate {
  id: string;
  type: UpdateType;
  title: string;
  date: string; // ISO date string for sorting
  slug: string; // URL path to the content
  description?: string;
  icon?: string; // Optional icon identifier
  isNew?: boolean; // Show "NEW" badge if true
}

/**
 * Props for the UpdateCard component
 */
export interface UpdateCardProps {
  update: SiteUpdate;
  variant?: 'compact' | 'full';
}

/**
 * Props for the RecentUpdates section component
 */
export interface RecentUpdatesProps {
  limit?: number;
  types?: UpdateType[];
  title?: string;
}