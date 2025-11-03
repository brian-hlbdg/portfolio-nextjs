/**
 * src/data/bears.ts
 * 
 * Static Bears configuration
 * Bears colors: Navy Blue (#0B162A), Orange (#C83803)
 * Designed to scale to other teams later via team selector
 */

export const BEARS_TEAM = {
  id: 'bears',
  name: 'Chicago Bears',
  shortName: 'Bears',
  sport: 'NFL',
  league: 'NFL',
  
  logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/chi.png',
  
  colors: {
    primary: '#0B162A',      // Navy blue
    secondary: '#C83803',    // Orange
    accent: '#FFFFFF',       // White
  },
  
  tailwind: {
    primary: 'from-blue-950 to-blue-900',
    secondary: 'from-orange-600 to-orange-700',
    text: 'text-orange-600',
    border: 'border-blue-900',
  },
  
  espnTeamId: 16, // Chicago Bears ESPN ID for API calls
} as const;

export type BearsTeam = typeof BEARS_TEAM;