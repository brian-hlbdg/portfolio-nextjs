export interface TeamStats {
  name: string;
  sport: string;
  logo?: string;
  wins: number;
  losses: number;
  ties?: number;
  record: string;
  lastUpdated: string;
  source: 'live' | 'cache' | 'fallback';
  cachedAt?: number;
}

export interface CachedTeamStats extends TeamStats {
  cachedAt: number;
}

export interface UseSportsStatsReturn {
  teams: TeamStats[];
  loading: boolean;
  error: string | null;
  lastFetch: number;
  refetch: () => Promise<void>;
}

export interface ChicagoTeam {
  id: string;
  name: string;
  fullName: string;
  sport: string;
  logo: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  tailwindColors: {
    bg: string;
    text: string;
    border: string;
  };
}

export interface DashboardMetric {
  label: string;
  value: string;
  icon?: React.ReactNode;
}