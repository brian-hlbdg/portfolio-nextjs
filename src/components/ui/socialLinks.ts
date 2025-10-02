export interface SocialLink {
  name: string;
  url: string;
  platform: 'linkedin' | 'indeed' | 'bluesky' | 'instagram';
  ariaLabel: string;
}

export const socialLinks: SocialLink[] = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/hlbdg',
    platform: 'linkedin',
    ariaLabel: 'Visit Brian H on LinkedIn'
  },
  {
    name: 'Indeed',
    url: 'https://profile.indeed.com/p/brianh-pg6dm6y',
    platform: 'indeed',
    ariaLabel: 'Visit Brian H on Indeed'
  },
  {
    name: 'Bluesky',
    url: 'https://bsky.app/profile/hlbdg.bsky.social',
    platform: 'bluesky',
    ariaLabel: 'Visit Brian H on Bluesky'
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/hlbdg/',
    platform: 'instagram',
    ariaLabel: 'Visit Brian H on Instagram'
  }
];