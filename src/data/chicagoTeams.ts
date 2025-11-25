// src/data/chicagoTeams.ts

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

export const chicagoTeams: ChicagoTeam[] = [
  {
    id: 'bears',
    name: 'Bears',
    fullName: 'Chicago Bears',
    sport: 'NFL',
    logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/chi.png',
    colors: {
      primary: '#0B162A',
      secondary: '#C83803',
      accent: '#FFFFFF',
    },
    tailwindColors: {
      bg: 'bg-blue-950',
      text: 'text-orange-600',
      border: 'border-blue-900',
    },
  },
  {
    id: 'cubs',
    name: 'Cubs',
    fullName: 'Chicago Cubs',
    sport: 'MLB',
    logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/chc.png',
    colors: {
      primary: '#0E3386',
      secondary: '#CC3433',
      accent: '#FFFFFF',
    },
    tailwindColors: {
      bg: 'bg-blue-900',
      text: 'text-red-600',
      border: 'border-blue-800',
    },
  },
  {
    id: 'whitesox',
    name: 'White Sox',
    fullName: 'Chicago White Sox',
    sport: 'MLB',
    logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/cws.png',
    colors: {
      primary: '#27251B',
      secondary: '#FFFFFF',
      accent: '#C41E3A',
    },
    tailwindColors: {
      bg: 'bg-gray-900',
      text: 'text-white',
      border: 'border-gray-700',
    },
  },
  {
    id: 'bulls',
    name: 'Bulls',
    fullName: 'Chicago Bulls',
    sport: 'NBA',
    logo: 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
    colors: {
      primary: '#CE1141',
      secondary: '#000000',
      accent: '#FFFFFF',
    },
    tailwindColors: {
      bg: 'bg-red-700',
      text: 'text-black',
      border: 'border-red-600',
    },
  },
  {
    id: 'blackhawks',
    name: 'Blackhawks',
    fullName: 'Chicago Blackhawks',
    sport: 'NHL',
    logo: 'https://a.espncdn.com/i/teamlogos/nhl/500/chi.png',
    colors: {
      primary: '#010101',
      secondary: '#FF6B35',
      accent: '#FFFFFF',
    },
    tailwindColors: {
      bg: 'bg-black',
      text: 'text-orange-500',
      border: 'border-gray-700',
    },
  },
  {
    id: 'sky',
    name: 'Sky',
    fullName: 'Chicago Sky',
    sport: 'WNBA',
    logo: 'https://a.espncdn.com/i/teamlogos/wnba/500/chi.png',
    colors: {
      primary: '#00285E',
      secondary: '#FF6B35',
      accent: '#FFFFFF',
    },
    tailwindColors: {
      bg: 'bg-blue-950',
      text: 'text-orange-500',
      border: 'border-blue-900',
    },
  },
  {
    id: 'fire',
    name: 'Fire',
    fullName: 'Chicago Fire FC',
    sport: 'MLS',
    logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/182.png',
    colors: {
      primary: '#ED1C24',
      secondary: '#FFFFFF',
      accent: '#000000',
    },
    tailwindColors: {
      bg: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-500',
    },
  },
];

export const getTeamById = (id: string): ChicagoTeam | undefined => {
  return chicagoTeams.find(team => team.id === id);
};

export const getTeamBySport = (sport: string): ChicagoTeam | undefined => {
  return chicagoTeams.find(team => team.sport === sport);
};