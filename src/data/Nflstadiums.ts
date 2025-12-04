/**
 * src/data/nflStadiums.ts
 * ========================================================================
 * Comprehensive NFL Stadium Data
 * 
 * Contains all static stadium information that can affect games:
 * - Surface type (grass/turf)
 * - Roof type (outdoor/dome/retractable)
 * - Altitude (affects kicking, stamina)
 * - Climate zone (for weather predictions)
 * - Capacity & noise levels (home field advantage)
 * - Geographic data (timezone, coordinates for weather API)
 * 
 * Future: Can be combined with game date to predict weather conditions
 * ========================================================================
 */

export interface NFLStadium {
  // Identity
  name: string;
  team: string;
  teamAbbr: string;
  city: string;
  state: string;

  // Physical Characteristics
  surface: 'Grass' | 'Turf';
  roof: 'Outdoor' | 'Dome' | 'Retractable';
  capacity: number;
  opened: number;

  // Environmental Factors
  altitude: number; // feet above sea level
  climate: 'Cold' | 'Moderate' | 'Warm' | 'Hot' | 'Dome-Controlled';
  timezone: string;

  // Geographic (for future weather integration)
  coordinates: {
    lat: number;
    lng: number;
  };

  // Home Field Advantage Metrics
  noiseLevel: {
    average: number; // decibels
    peak: number; // decibels (record)
  };
  homeFieldRating: number; // 1-10 scale based on historical data

  // Notable Factors
  notableFactors: string[];
}

/**
 * All 30 NFL Stadiums (32 teams, 2 shared stadiums)
 * Key: Stadium name as it appears in ESPN API
 */
export const NFL_STADIUMS: Record<string, NFLStadium> = {
  // ========================================================================
  // AFC EAST
  // ========================================================================
  'Gillette Stadium': {
    name: 'Gillette Stadium',
    team: 'New England Patriots',
    teamAbbr: 'NE',
    city: 'Foxborough',
    state: 'MA',
    surface: 'Turf',
    roof: 'Outdoor',
    capacity: 65878,
    opened: 2002,
    altitude: 207,
    climate: 'Cold',
    timezone: 'America/New_York',
    coordinates: { lat: 42.0909, lng: -71.2643 },
    noiseLevel: { average: 95, peak: 106 },
    homeFieldRating: 7,
    notableFactors: ['Cold weather in winter', 'Snow games common', 'Historically dominant home record'],
  },

  'Hard Rock Stadium': {
    name: 'Hard Rock Stadium',
    team: 'Miami Dolphins',
    teamAbbr: 'MIA',
    city: 'Miami Gardens',
    state: 'FL',
    surface: 'Grass',
    roof: 'Outdoor',
    capacity: 65326,
    opened: 1987,
    altitude: 7,
    climate: 'Hot',
    timezone: 'America/New_York',
    coordinates: { lat: 25.958, lng: -80.2389 },
    noiseLevel: { average: 85, peak: 95 },
    homeFieldRating: 6,
    notableFactors: ['Extreme heat & humidity', 'Sun exposure affects visitors', 'Canopy provides partial shade'],
  },

  'Highmark Stadium': {
    name: 'Highmark Stadium',
    team: 'Buffalo Bills',
    teamAbbr: 'BUF',
    city: 'Orchard Park',
    state: 'NY',
    surface: 'Turf',
    roof: 'Outdoor',
    capacity: 71608,
    opened: 1973,
    altitude: 866,
    climate: 'Cold',
    timezone: 'America/New_York',
    coordinates: { lat: 42.7738, lng: -78.787 },
    noiseLevel: { average: 95, peak: 110 },
    homeFieldRating: 8,
    notableFactors: ['Lake effect snow', 'Field 50ft below ground to reduce wind', 'Bills Mafia atmosphere', 'Extreme cold'],
  },

  'MetLife Stadium': {
    name: 'MetLife Stadium',
    team: 'New York Giants / New York Jets',
    teamAbbr: 'NYG/NYJ',
    city: 'East Rutherford',
    state: 'NJ',
    surface: 'Turf',
    roof: 'Outdoor',
    capacity: 82500,
    opened: 2010,
    altitude: 52,
    climate: 'Cold',
    timezone: 'America/New_York',
    coordinates: { lat: 40.8135, lng: -74.0745 },
    noiseLevel: { average: 85, peak: 100 },
    homeFieldRating: 5,
    notableFactors: ['Shared by two teams', 'Cold & windy in late season', 'Largest stadium by capacity'],
  },

  // ========================================================================
  // AFC NORTH
  // ========================================================================
  'Acrisure Stadium': {
    name: 'Acrisure Stadium',
    team: 'Pittsburgh Steelers',
    teamAbbr: 'PIT',
    city: 'Pittsburgh',
    state: 'PA',
    surface: 'Grass',
    roof: 'Outdoor',
    capacity: 68400,
    opened: 2001,
    altitude: 712,
    climate: 'Cold',
    timezone: 'America/New_York',
    coordinates: { lat: 40.4468, lng: -80.0158 },
    noiseLevel: { average: 90, peak: 102 },
    homeFieldRating: 8,
    notableFactors: ['Terrible Towel tradition', 'Rowdy fanbase', 'River location creates wind'],
  },

  'Cleveland Browns Stadium': {
    name: 'Cleveland Browns Stadium',
    team: 'Cleveland Browns',
    teamAbbr: 'CLE',
    city: 'Cleveland',
    state: 'OH',
    surface: 'Grass',
    roof: 'Outdoor',
    capacity: 67895,
    opened: 1999,
    altitude: 580,
    climate: 'Cold',
    timezone: 'America/New_York',
    coordinates: { lat: 41.506, lng: -81.6996 },
    noiseLevel: { average: 85, peak: 95 },
    homeFieldRating: 6,
    notableFactors: ['Lake Erie wind', 'Dawg Pound section', 'Cold & wet conditions'],
  },

  'Huntington Bank Field': {
    name: 'Huntington Bank Field',
    team: 'Cincinnati Bengals',
    teamAbbr: 'CIN',
    city: 'Cincinnati',
    state: 'OH',
    surface: 'Turf',
    roof: 'Outdoor',
    capacity: 65515,
    opened: 2000,
    altitude: 482,
    climate: 'Moderate',
    timezone: 'America/New_York',
    coordinates: { lat: 39.0954, lng: -84.516 },
    noiseLevel: { average: 88, peak: 98 },
    homeFieldRating: 6,
    notableFactors: ['Riverfront location', 'Recently upgraded turf', 'Growing fanbase enthusiasm'],
  },

  'M&T Bank Stadium': {
    name: 'M&T Bank Stadium',
    team: 'Baltimore Ravens',
    teamAbbr: 'BAL',
    city: 'Baltimore',
    state: 'MD',
    surface: 'Grass',
    roof: 'Outdoor',
    capacity: 71008,
    opened: 1998,
    altitude: 52,
    climate: 'Moderate',
    timezone: 'America/New_York',
    coordinates: { lat: 39.278, lng: -76.6227 },
    noiseLevel: { average: 95, peak: 105 },
    homeFieldRating: 7,
    notableFactors: ['Seven Nation Army chant', 'Passionate fanbase', 'Strong defensive tradition'],
  },

  // ========================================================================
  // AFC SOUTH
  // ========================================================================
  'EverBank Stadium': {
    name: 'EverBank Stadium',
    team: 'Jacksonville Jaguars',
    teamAbbr: 'JAX',
    city: 'Jacksonville',
    state: 'FL',
    surface: 'Grass',
    roof: 'Outdoor',
    capacity: 69132,
    opened: 1995,
    altitude: 15,
    climate: 'Hot',
    timezone: 'America/New_York',
    coordinates: { lat: 30.324, lng: -81.6373 },
    noiseLevel: { average: 80, peak: 90 },
    homeFieldRating: 5,
    notableFactors: ['Extreme heat', 'Pool deck seating', 'Humidity affects visitors'],
  },

  'Lucas Oil Stadium': {
    name: 'Lucas Oil Stadium',
    team: 'Indianapolis Colts',
    teamAbbr: 'IND',
    city: 'Indianapolis',
    state: 'IN',
    surface: 'Turf',
    roof: 'Retractable',
    capacity: 70000,
    opened: 2008,
    altitude: 715,
    climate: 'Dome-Controlled',
    timezone: 'America/Indiana/Indianapolis',
    coordinates: { lat: 39.7601, lng: -86.1639 },
    noiseLevel: { average: 86, peak: 100 },
    homeFieldRating: 6,
    notableFactors: ['Retractable roof usually closed', 'Climate controlled', 'Hosts NFL Combine'],
  },

  'Nissan Stadium': {
    name: 'Nissan Stadium',
    team: 'Tennessee Titans',
    teamAbbr: 'TEN',
    city: 'Nashville',
    state: 'TN',
    surface: 'Turf',
    roof: 'Outdoor',
    capacity: 69143,
    opened: 1999,
    altitude: 597,
    climate: 'Moderate',
    timezone: 'America/Chicago',
    coordinates: { lat: 36.1665, lng: -86.7713 },
    noiseLevel: { average: 85, peak: 95 },
    homeFieldRating: 5,
    notableFactors: ['New stadium coming 2027', 'Riverfront location', 'Variable weather'],
  },

  'NRG Stadium': {
    name: 'NRG Stadium',
    team: 'Houston Texans',
    teamAbbr: 'HOU',
    city: 'Houston',
    state: 'TX',
    surface: 'Turf',
    roof: 'Retractable',
    capacity: 72220,
    opened: 2002,
    altitude: 43,
    climate: 'Dome-Controlled',
    timezone: 'America/Chicago',
    coordinates: { lat: 29.6847, lng: -95.4107 },
    noiseLevel: { average: 88, peak: 100 },
    homeFieldRating: 5,
    notableFactors: ['Retractable roof', 'Climate controlled for Houston heat', 'Hosts rodeo events'],
  },

  // ========================================================================
  // AFC WEST
  // ========================================================================
  'Allegiant Stadium': {
    name: 'Allegiant Stadium',
    team: 'Las Vegas Raiders',
    teamAbbr: 'LV',
    city: 'Las Vegas',
    state: 'NV',
    surface: 'Turf',
    roof: 'Dome',
    capacity: 65000,
    opened: 2020,
    altitude: 2030,
    climate: 'Dome-Controlled',
    timezone: 'America/Los_Angeles',
    coordinates: { lat: 36.0909, lng: -115.1833 },
    noiseLevel: { average: 90, peak: 105 },
    homeFieldRating: 5,
    notableFactors: ['Newest NFL stadium', 'Desert dome', 'Tourism destination', 'Moderate altitude'],
  },

  'Arrowhead Stadium': {
    name: 'Arrowhead Stadium',
    team: 'Kansas City Chiefs',
    teamAbbr: 'KC',
    city: 'Kansas City',
    state: 'MO',
    surface: 'Grass',
    roof: 'Outdoor',
    capacity: 76416,
    opened: 1972,
    altitude: 889,
    climate: 'Moderate',
    timezone: 'America/Chicago',
    coordinates: { lat: 39.0489, lng: -94.4839 },
    noiseLevel: { average: 140, peak: 142 },
    homeFieldRating: 10,
    notableFactors: ['LOUDEST STADIUM IN NFL', 'Guinness World Record 142.2 dB', 'Passionate fanbase', 'Tailgate culture'],
  },

  'Empower Field at Mile High': {
    name: 'Empower Field at Mile High',
    team: 'Denver Broncos',
    teamAbbr: 'DEN',
    city: 'Denver',
    state: 'CO',
    surface: 'Grass',
    roof: 'Outdoor',
    capacity: 76125,
    opened: 2001,
    altitude: 5280,
    climate: 'Cold',
    timezone: 'America/Denver',
    coordinates: { lat: 39.7439, lng: -105.02 },
    noiseLevel: { average: 95, peak: 110 },
    homeFieldRating: 9,
    notableFactors: ['HIGHEST ALTITUDE - 5,280 ft', '17% less oxygen than sea level', 'Kicks travel 5% farther', 'Visitor fatigue', 'Sold out since 1970'],
  },

  'SoFi Stadium': {
    name: 'SoFi Stadium',
    team: 'Los Angeles Rams / Los Angeles Chargers',
    teamAbbr: 'LAR/LAC',
    city: 'Inglewood',
    state: 'CA',
    surface: 'Turf',
    roof: 'Dome',
    capacity: 70240,
    opened: 2020,
    altitude: 118,
    climate: 'Dome-Controlled',
    timezone: 'America/Los_Angeles',
    coordinates: { lat: 33.9535, lng: -118.3392 },
    noiseLevel: { average: 90, peak: 105 },
    homeFieldRating: 5,
    notableFactors: ['Shared by two teams', 'State-of-the-art facility', 'Open-air dome design', 'Hosted Super Bowl LVI'],
  },

  // ========================================================================
  // NFC EAST
  // ========================================================================
  'AT&T Stadium': {
    name: 'AT&T Stadium',
    team: 'Dallas Cowboys',
    teamAbbr: 'DAL',
    city: 'Arlington',
    state: 'TX',
    surface: 'Turf',
    roof: 'Retractable',
    capacity: 80000,
    opened: 2009,
    altitude: 604,
    climate: 'Dome-Controlled',
    timezone: 'America/Chicago',
    coordinates: { lat: 32.7473, lng: -97.0945 },
    noiseLevel: { average: 87, peak: 100 },
    homeFieldRating: 6,
    notableFactors: ['Largest video screen', 'Can expand to 100,000', '"Jerry World"', 'Retractable roof & walls'],
  },

  'Lincoln Financial Field': {
    name: 'Lincoln Financial Field',
    team: 'Philadelphia Eagles',
    teamAbbr: 'PHI',
    city: 'Philadelphia',
    state: 'PA',
    surface: 'Grass',
    roof: 'Outdoor',
    capacity: 69796,
    opened: 2003,
    altitude: 42,
    climate: 'Cold',
    timezone: 'America/New_York',
    coordinates: { lat: 39.9008, lng: -75.1675 },
    noiseLevel: { average: 95, peak: 108 },
    homeFieldRating: 8,
    notableFactors: ['Notoriously hostile fans', 'Cold & windy in late season', 'Record attendance 70,622'],
  },

  'Northwest Stadium': {
    name: 'Northwest Stadium',
    team: 'Washington Commanders',
    teamAbbr: 'WAS',
    city: 'Landover',
    state: 'MD',
    surface: 'Turf',
    roof: 'Outdoor',
    capacity: 67617,
    opened: 1997,
    altitude: 52,
    climate: 'Moderate',
    timezone: 'America/New_York',
    coordinates: { lat: 38.9076, lng: -76.8645 },
    noiseLevel: { average: 82, peak: 92 },
    homeFieldRating: 4,
    notableFactors: ['Formerly FedExField', 'New stadium planned', 'Variable crowd energy'],
  },

  // ========================================================================
  // NFC NORTH
  // ========================================================================
  'Ford Field': {
    name: 'Ford Field',
    team: 'Detroit Lions',
    teamAbbr: 'DET',
    city: 'Detroit',
    state: 'MI',
    surface: 'Turf',
    roof: 'Dome',
    capacity: 65000,
    opened: 2002,
    altitude: 600,
    climate: 'Dome-Controlled',
    timezone: 'America/Detroit',
    coordinates: { lat: 42.34, lng: -83.0456 },
    noiseLevel: { average: 95, peak: 110 },
    homeFieldRating: 7,
    notableFactors: ['Hosts annual Thanksgiving game', 'Downtown location', 'Growing fanbase energy'],
  },

  'Lambeau Field': {
    name: 'Lambeau Field',
    team: 'Green Bay Packers',
    teamAbbr: 'GB',
    city: 'Green Bay',
    state: 'WI',
    surface: 'Grass',
    roof: 'Outdoor',
    capacity: 81441,
    opened: 1957,
    altitude: 640,
    climate: 'Cold',
    timezone: 'America/Chicago',
    coordinates: { lat: 44.5013, lng: -88.0622 },
    noiseLevel: { average: 105, peak: 123 },
    homeFieldRating: 9,
    notableFactors: ['"Frozen Tundra"', 'Oldest NFL stadium in use', '-13°F in 1967 Ice Bowl', 'Fan-owned team', 'Legendary atmosphere'],
  },

  'Soldier Field': {
    name: 'Soldier Field',
    team: 'Chicago Bears',
    teamAbbr: 'CHI',
    city: 'Chicago',
    state: 'IL',
    surface: 'Grass',
    roof: 'Outdoor',
    capacity: 61500,
    opened: 1924,
    altitude: 590,
    climate: 'Cold',
    timezone: 'America/Chicago',
    coordinates: { lat: 41.8623, lng: -87.6167 },
    noiseLevel: { average: 90, peak: 105 },
    homeFieldRating: 7,
    notableFactors: ['Oldest NFL stadium (1924)', 'Lake Michigan wind', 'Smallest capacity', 'Historic landmark', 'New dome stadium planned'],
  },

  'U.S. Bank Stadium': {
    name: 'U.S. Bank Stadium',
    team: 'Minnesota Vikings',
    teamAbbr: 'MIN',
    city: 'Minneapolis',
    state: 'MN',
    surface: 'Turf',
    roof: 'Dome',
    capacity: 73000,
    opened: 2016,
    altitude: 849,
    climate: 'Dome-Controlled',
    timezone: 'America/Chicago',
    coordinates: { lat: 44.9737, lng: -93.2577 },
    noiseLevel: { average: 105, peak: 120 },
    homeFieldRating: 8,
    notableFactors: ['Acoustically designed to amplify noise', 'ETFE roof reflects sound', 'Skol chant tradition', 'Replaced Metrodome'],
  },

  // ========================================================================
  // NFC SOUTH
  // ========================================================================
  'Bank of America Stadium': {
    name: 'Bank of America Stadium',
    team: 'Carolina Panthers',
    teamAbbr: 'CAR',
    city: 'Charlotte',
    state: 'NC',
    surface: 'Turf',
    roof: 'Outdoor',
    capacity: 74867,
    opened: 1996,
    altitude: 751,
    climate: 'Moderate',
    timezone: 'America/New_York',
    coordinates: { lat: 35.2258, lng: -80.8528 },
    noiseLevel: { average: 85, peak: 100 },
    homeFieldRating: 5,
    notableFactors: ['Downtown location', 'Keep Pounding drums', 'Moderate climate'],
  },

  'Caesars Superdome': {
    name: 'Caesars Superdome',
    team: 'New Orleans Saints',
    teamAbbr: 'NO',
    city: 'New Orleans',
    state: 'LA',
    surface: 'Turf',
    roof: 'Dome',
    capacity: 73208,
    opened: 1975,
    altitude: 3,
    climate: 'Dome-Controlled',
    timezone: 'America/Chicago',
    coordinates: { lat: 29.951, lng: -90.0811 },
    noiseLevel: { average: 105, peak: 137 },
    homeFieldRating: 9,
    notableFactors: ['LOWEST ALTITUDE - 3 ft', 'One of loudest domes', 'Who Dat chant', 'Iconic venue', 'Hurricane Katrina history'],
  },

  'Mercedes-Benz Stadium': {
    name: 'Mercedes-Benz Stadium',
    team: 'Atlanta Falcons',
    teamAbbr: 'ATL',
    city: 'Atlanta',
    state: 'GA',
    surface: 'Turf',
    roof: 'Retractable',
    capacity: 75000,
    opened: 2017,
    altitude: 997,
    climate: 'Dome-Controlled',
    timezone: 'America/New_York',
    coordinates: { lat: 33.7554, lng: -84.401 },
    noiseLevel: { average: 90, peak: 105 },
    homeFieldRating: 6,
    notableFactors: ['Unique oculus roof', 'Affordable concessions', 'Hosts CFP Championship', 'State-of-the-art'],
  },

  'Raymond James Stadium': {
    name: 'Raymond James Stadium',
    team: 'Tampa Bay Buccaneers',
    teamAbbr: 'TB',
    city: 'Tampa',
    state: 'FL',
    surface: 'Grass',
    roof: 'Outdoor',
    capacity: 69218,
    opened: 1998,
    altitude: 49,
    climate: 'Hot',
    timezone: 'America/New_York',
    coordinates: { lat: 27.9759, lng: -82.5033 },
    noiseLevel: { average: 85, peak: 95 },
    homeFieldRating: 6,
    notableFactors: ['Pirate ship in stadium', 'Extreme heat', 'Hosted Super Bowl LV', 'Cannon fired after scores'],
  },

  // ========================================================================
  // NFC WEST
  // ========================================================================
  "Levi's Stadium": {
    name: "Levi's Stadium",
    team: 'San Francisco 49ers',
    teamAbbr: 'SF',
    city: 'Santa Clara',
    state: 'CA',
    surface: 'Grass',
    roof: 'Outdoor',
    capacity: 68500,
    opened: 2014,
    altitude: 59,
    climate: 'Moderate',
    timezone: 'America/Los_Angeles',
    coordinates: { lat: 37.4033, lng: -121.97 },
    noiseLevel: { average: 85, peak: 95 },
    homeFieldRating: 5,
    notableFactors: ['Silicon Valley location', 'Sun exposure issues', 'Tech-forward amenities'],
  },

  'State Farm Stadium': {
    name: 'State Farm Stadium',
    team: 'Arizona Cardinals',
    teamAbbr: 'ARI',
    city: 'Glendale',
    state: 'AZ',
    surface: 'Grass',
    roof: 'Retractable',
    capacity: 63400,
    opened: 2006,
    altitude: 1070,
    climate: 'Dome-Controlled',
    timezone: 'America/Phoenix',
    coordinates: { lat: 33.5276, lng: -112.2626 },
    noiseLevel: { average: 100, peak: 130 },
    homeFieldRating: 6,
    notableFactors: ['Retractable field', 'Grass grown outside, rolled in', 'Desert heat avoided', 'Higher altitude than most'],
  },

  'Lumen Field': {
    name: 'Lumen Field',
    team: 'Seattle Seahawks',
    teamAbbr: 'SEA',
    city: 'Seattle',
    state: 'WA',
    surface: 'Turf',
    roof: 'Outdoor',
    capacity: 69000,
    opened: 2002,
    altitude: 20,
    climate: 'Moderate',
    timezone: 'America/Los_Angeles',
    coordinates: { lat: 47.5952, lng: -122.3316 },
    noiseLevel: { average: 115, peak: 138 },
    homeFieldRating: 9,
    notableFactors: ['"12th Man" tradition', 'Designed to amplify noise', '137.6 dB Guinness Record', 'Caused seismic activity', 'Rain common'],
  },
};

// ========================================================================
// HELPER FUNCTIONS
// ========================================================================

/**
 * Get stadium info by venue name
 * Handles variations in naming (e.g., with/without "Stadium")
 */
export function getStadiumByName(venueName: string): NFLStadium | null {
  // Direct match
  if (NFL_STADIUMS[venueName]) {
    return NFL_STADIUMS[venueName];
  }

  // Try to find partial match
  const normalizedName = venueName.toLowerCase();
  for (const [key, stadium] of Object.entries(NFL_STADIUMS)) {
    if (
      key.toLowerCase().includes(normalizedName) ||
      normalizedName.includes(key.toLowerCase()) ||
      stadium.team.toLowerCase().includes(normalizedName)
    ) {
      return stadium;
    }
  }

  return null;
}

/**
 * Get stadium info by team name
 */
export function getStadiumByTeam(teamName: string): NFLStadium | null {
  const normalizedTeam = teamName.toLowerCase();
  
  for (const stadium of Object.values(NFL_STADIUMS)) {
    if (
      stadium.team.toLowerCase().includes(normalizedTeam) ||
      normalizedTeam.includes(stadium.team.toLowerCase())
    ) {
      return stadium;
    }
  }

  return null;
}

/**
 * Get display string for surface and roof
 * Example: "Outdoor • Grass" or "Dome • Turf"
 */
export function getVenueConditions(stadium: NFLStadium): string {
  return `${stadium.roof} • ${stadium.surface}`;
}

/**
 * Get altitude impact description
 */
export function getAltitudeImpact(altitude: number): string | null {
  if (altitude >= 5000) {
    return 'High altitude - affects stamina & kicks';
  }
  if (altitude >= 2000) {
    return 'Moderate altitude';
  }
  return null;
}

/**
 * Get home field advantage rating description
 */
export function getHomeFieldDescription(rating: number): string {
  if (rating >= 9) return 'Elite';
  if (rating >= 7) return 'Strong';
  if (rating >= 5) return 'Average';
  return 'Below Average';
}

/**
 * Format noise level for display
 */
export function formatNoiseLevel(noiseLevel: { average: number; peak: number }): string {
  return `${noiseLevel.average} dB avg (${noiseLevel.peak} dB peak)`;
}