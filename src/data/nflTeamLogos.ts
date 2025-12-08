/**
 * src/data/nflTeamLogos.ts
 * ========================================================================
 * NFL Team Logos for Bears Schedule & Opponent Displays
 * 
 * ESPN CDN logo URLs are stable and don't require API calls.
 * Use these for schedule views, game predictions, opponent cards, etc.
 * 
 * Logo URL Patterns:
 * - Standard: https://a.espncdn.com/i/teamlogos/nfl/500/{abbr}.png
 * - Dark bg:  https://a.espncdn.com/i/teamlogos/nfl/500-dark/{abbr}.png
 * - Scoreboard: https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/{abbr}.png
 * 
 * @example
 * import { NFL_TEAMS, getNFLLogo } from '@/data/nflTeamLogos';
 * 
 * // Get Packers logo
 * <img src={NFL_TEAMS.GB.logo} alt={NFL_TEAMS.GB.name} />
 * 
 * // With helper function
 * <img src={getNFLLogo('GB')} alt="Green Bay Packers" />
 * ========================================================================
 */

// ========================================================================
// TYPES
// ========================================================================

export type NFLTeamAbbreviation = 
  | 'ARI' | 'ATL' | 'BAL' | 'BUF' | 'CAR' | 'CHI' | 'CIN' | 'CLE'
  | 'DAL' | 'DEN' | 'DET' | 'GB'  | 'HOU' | 'IND' | 'JAX' | 'KC'
  | 'LAC' | 'LAR' | 'LV'  | 'MIA' | 'MIN' | 'NE'  | 'NO'  | 'NYG'
  | 'NYJ' | 'PHI' | 'PIT' | 'SEA' | 'SF'  | 'TB'  | 'TEN' | 'WAS';

export type NFLConference = 'AFC' | 'NFC';
export type NFLDivision = 'North' | 'South' | 'East' | 'West';

export interface NFLTeamLogos {
  /** Standard logo (500px, transparent bg) */
  logo: string;
  /** Dark mode variant (light colors for dark backgrounds) */
  logoDark: string;
  /** Scoreboard style logo */
  scoreboard: string;
  /** Small logo (~100px) for compact displays */
  small: string;
}

export interface NFLTeam {
  /** Team abbreviation */
  abbreviation: NFLTeamAbbreviation;
  /** Full team name */
  name: string;
  /** City/Location only */
  location: string;
  /** Nickname only */
  nickname: string;
  /** ESPN team ID */
  espnId: string;
  /** Conference */
  conference: NFLConference;
  /** Division */
  division: NFLDivision;
  /** All logo variants */
  logos: NFLTeamLogos;
  /** Primary team color (hex) */
  primaryColor: string;
  /** Secondary team color (hex) */
  secondaryColor: string;
}

// ========================================================================
// ESPN CDN BASE
// ========================================================================

const ESPN_LOGO_BASE = 'https://a.espncdn.com/i/teamlogos/nfl';

/**
 * Build logo URLs for a team
 */
function buildLogos(abbr: string): NFLTeamLogos {
  const a = abbr.toLowerCase();
  return {
    logo: `${ESPN_LOGO_BASE}/500/${a}.png`,
    logoDark: `${ESPN_LOGO_BASE}/500-dark/${a}.png`,
    scoreboard: `${ESPN_LOGO_BASE}/500/scoreboard/${a}.png`,
    small: `${ESPN_LOGO_BASE}/${a}.png`,
  };
}

// ========================================================================
// NFL TEAMS DATA
// ========================================================================

export const NFL_TEAMS: Record<NFLTeamAbbreviation, NFLTeam> = {
  // ----------------------------------------------------------------
  // AFC NORTH
  // ----------------------------------------------------------------
  BAL: {
    abbreviation: 'BAL',
    name: 'Baltimore Ravens',
    location: 'Baltimore',
    nickname: 'Ravens',
    espnId: '33',
    conference: 'AFC',
    division: 'North',
    logos: buildLogos('bal'),
    primaryColor: '#241773',
    secondaryColor: '#000000',
  },
  CIN: {
    abbreviation: 'CIN',
    name: 'Cincinnati Bengals',
    location: 'Cincinnati',
    nickname: 'Bengals',
    espnId: '4',
    conference: 'AFC',
    division: 'North',
    logos: buildLogos('cin'),
    primaryColor: '#FB4F14',
    secondaryColor: '#000000',
  },
  CLE: {
    abbreviation: 'CLE',
    name: 'Cleveland Browns',
    location: 'Cleveland',
    nickname: 'Browns',
    espnId: '5',
    conference: 'AFC',
    division: 'North',
    logos: buildLogos('cle'),
    primaryColor: '#311D00',
    secondaryColor: '#FF3C00',
  },
  PIT: {
    abbreviation: 'PIT',
    name: 'Pittsburgh Steelers',
    location: 'Pittsburgh',
    nickname: 'Steelers',
    espnId: '23',
    conference: 'AFC',
    division: 'North',
    logos: buildLogos('pit'),
    primaryColor: '#FFB612',
    secondaryColor: '#101820',
  },

  // ----------------------------------------------------------------
  // AFC SOUTH
  // ----------------------------------------------------------------
  HOU: {
    abbreviation: 'HOU',
    name: 'Houston Texans',
    location: 'Houston',
    nickname: 'Texans',
    espnId: '34',
    conference: 'AFC',
    division: 'South',
    logos: buildLogos('hou'),
    primaryColor: '#03202F',
    secondaryColor: '#A71930',
  },
  IND: {
    abbreviation: 'IND',
    name: 'Indianapolis Colts',
    location: 'Indianapolis',
    nickname: 'Colts',
    espnId: '11',
    conference: 'AFC',
    division: 'South',
    logos: buildLogos('ind'),
    primaryColor: '#002C5F',
    secondaryColor: '#A2AAAD',
  },
  JAX: {
    abbreviation: 'JAX',
    name: 'Jacksonville Jaguars',
    location: 'Jacksonville',
    nickname: 'Jaguars',
    espnId: '30',
    conference: 'AFC',
    division: 'South',
    logos: buildLogos('jax'),
    primaryColor: '#006778',
    secondaryColor: '#D7A22A',
  },
  TEN: {
    abbreviation: 'TEN',
    name: 'Tennessee Titans',
    location: 'Tennessee',
    nickname: 'Titans',
    espnId: '10',
    conference: 'AFC',
    division: 'South',
    logos: buildLogos('ten'),
    primaryColor: '#0C2340',
    secondaryColor: '#4B92DB',
  },

  // ----------------------------------------------------------------
  // AFC EAST
  // ----------------------------------------------------------------
  BUF: {
    abbreviation: 'BUF',
    name: 'Buffalo Bills',
    location: 'Buffalo',
    nickname: 'Bills',
    espnId: '2',
    conference: 'AFC',
    division: 'East',
    logos: buildLogos('buf'),
    primaryColor: '#00338D',
    secondaryColor: '#C60C30',
  },
  MIA: {
    abbreviation: 'MIA',
    name: 'Miami Dolphins',
    location: 'Miami',
    nickname: 'Dolphins',
    espnId: '15',
    conference: 'AFC',
    division: 'East',
    logos: buildLogos('mia'),
    primaryColor: '#008E97',
    secondaryColor: '#FC4C02',
  },
  NE: {
    abbreviation: 'NE',
    name: 'New England Patriots',
    location: 'New England',
    nickname: 'Patriots',
    espnId: '17',
    conference: 'AFC',
    division: 'East',
    logos: buildLogos('ne'),
    primaryColor: '#002244',
    secondaryColor: '#C60C30',
  },
  NYJ: {
    abbreviation: 'NYJ',
    name: 'New York Jets',
    location: 'New York',
    nickname: 'Jets',
    espnId: '20',
    conference: 'AFC',
    division: 'East',
    logos: buildLogos('nyj'),
    primaryColor: '#125740',
    secondaryColor: '#000000',
  },

  // ----------------------------------------------------------------
  // AFC WEST
  // ----------------------------------------------------------------
  DEN: {
    abbreviation: 'DEN',
    name: 'Denver Broncos',
    location: 'Denver',
    nickname: 'Broncos',
    espnId: '7',
    conference: 'AFC',
    division: 'West',
    logos: buildLogos('den'),
    primaryColor: '#FB4F14',
    secondaryColor: '#002244',
  },
  KC: {
    abbreviation: 'KC',
    name: 'Kansas City Chiefs',
    location: 'Kansas City',
    nickname: 'Chiefs',
    espnId: '12',
    conference: 'AFC',
    division: 'West',
    logos: buildLogos('kc'),
    primaryColor: '#E31837',
    secondaryColor: '#FFB81C',
  },
  LAC: {
    abbreviation: 'LAC',
    name: 'Los Angeles Chargers',
    location: 'Los Angeles',
    nickname: 'Chargers',
    espnId: '24',
    conference: 'AFC',
    division: 'West',
    logos: buildLogos('lac'),
    primaryColor: '#0080C6',
    secondaryColor: '#FFC20E',
  },
  LV: {
    abbreviation: 'LV',
    name: 'Las Vegas Raiders',
    location: 'Las Vegas',
    nickname: 'Raiders',
    espnId: '13',
    conference: 'AFC',
    division: 'West',
    logos: buildLogos('lv'),
    primaryColor: '#000000',
    secondaryColor: '#A5ACAF',
  },

  // ----------------------------------------------------------------
  // NFC NORTH (Bears Division)
  // ----------------------------------------------------------------
  CHI: {
    abbreviation: 'CHI',
    name: 'Chicago Bears',
    location: 'Chicago',
    nickname: 'Bears',
    espnId: '3',
    conference: 'NFC',
    division: 'North',
    logos: buildLogos('chi'),
    primaryColor: '#0B162A',
    secondaryColor: '#C83803',
  },
  DET: {
    abbreviation: 'DET',
    name: 'Detroit Lions',
    location: 'Detroit',
    nickname: 'Lions',
    espnId: '8',
    conference: 'NFC',
    division: 'North',
    logos: buildLogos('det'),
    primaryColor: '#0076B6',
    secondaryColor: '#B0B7BC',
  },
  GB: {
    abbreviation: 'GB',
    name: 'Green Bay Packers',
    location: 'Green Bay',
    nickname: 'Packers',
    espnId: '9',
    conference: 'NFC',
    division: 'North',
    logos: buildLogos('gb'),
    primaryColor: '#203731',
    secondaryColor: '#FFB612',
  },
  MIN: {
    abbreviation: 'MIN',
    name: 'Minnesota Vikings',
    location: 'Minnesota',
    nickname: 'Vikings',
    espnId: '16',
    conference: 'NFC',
    division: 'North',
    logos: buildLogos('min'),
    primaryColor: '#4F2683',
    secondaryColor: '#FFC62F',
  },

  // ----------------------------------------------------------------
  // NFC SOUTH
  // ----------------------------------------------------------------
  ATL: {
    abbreviation: 'ATL',
    name: 'Atlanta Falcons',
    location: 'Atlanta',
    nickname: 'Falcons',
    espnId: '1',
    conference: 'NFC',
    division: 'South',
    logos: buildLogos('atl'),
    primaryColor: '#A71930',
    secondaryColor: '#000000',
  },
  CAR: {
    abbreviation: 'CAR',
    name: 'Carolina Panthers',
    location: 'Carolina',
    nickname: 'Panthers',
    espnId: '29',
    conference: 'NFC',
    division: 'South',
    logos: buildLogos('car'),
    primaryColor: '#0085CA',
    secondaryColor: '#101820',
  },
  NO: {
    abbreviation: 'NO',
    name: 'New Orleans Saints',
    location: 'New Orleans',
    nickname: 'Saints',
    espnId: '18',
    conference: 'NFC',
    division: 'South',
    logos: buildLogos('no'),
    primaryColor: '#D3BC8D',
    secondaryColor: '#101820',
  },
  TB: {
    abbreviation: 'TB',
    name: 'Tampa Bay Buccaneers',
    location: 'Tampa Bay',
    nickname: 'Buccaneers',
    espnId: '27',
    conference: 'NFC',
    division: 'South',
    logos: buildLogos('tb'),
    primaryColor: '#D50A0A',
    secondaryColor: '#FF7900',
  },

  // ----------------------------------------------------------------
  // NFC EAST
  // ----------------------------------------------------------------
  DAL: {
    abbreviation: 'DAL',
    name: 'Dallas Cowboys',
    location: 'Dallas',
    nickname: 'Cowboys',
    espnId: '6',
    conference: 'NFC',
    division: 'East',
    logos: buildLogos('dal'),
    primaryColor: '#003594',
    secondaryColor: '#869397',
  },
  NYG: {
    abbreviation: 'NYG',
    name: 'New York Giants',
    location: 'New York',
    nickname: 'Giants',
    espnId: '19',
    conference: 'NFC',
    division: 'East',
    logos: buildLogos('nyg'),
    primaryColor: '#0B2265',
    secondaryColor: '#A71930',
  },
  PHI: {
    abbreviation: 'PHI',
    name: 'Philadelphia Eagles',
    location: 'Philadelphia',
    nickname: 'Eagles',
    espnId: '21',
    conference: 'NFC',
    division: 'East',
    logos: buildLogos('phi'),
    primaryColor: '#004C54',
    secondaryColor: '#A5ACAF',
  },
  WAS: {
    abbreviation: 'WAS',
    name: 'Washington Commanders',
    location: 'Washington',
    nickname: 'Commanders',
    espnId: '28',
    conference: 'NFC',
    division: 'East',
    logos: buildLogos('wsh'), // ESPN uses 'wsh' not 'was'
    primaryColor: '#5A1414',
    secondaryColor: '#FFB612',
  },

  // ----------------------------------------------------------------
  // NFC WEST
  // ----------------------------------------------------------------
  ARI: {
    abbreviation: 'ARI',
    name: 'Arizona Cardinals',
    location: 'Arizona',
    nickname: 'Cardinals',
    espnId: '22',
    conference: 'NFC',
    division: 'West',
    logos: buildLogos('ari'),
    primaryColor: '#97233F',
    secondaryColor: '#000000',
  },
  LAR: {
    abbreviation: 'LAR',
    name: 'Los Angeles Rams',
    location: 'Los Angeles',
    nickname: 'Rams',
    espnId: '14',
    conference: 'NFC',
    division: 'West',
    logos: buildLogos('lar'),
    primaryColor: '#003594',
    secondaryColor: '#FFA300',
  },
  SF: {
    abbreviation: 'SF',
    name: 'San Francisco 49ers',
    location: 'San Francisco',
    nickname: '49ers',
    espnId: '25',
    conference: 'NFC',
    division: 'West',
    logos: buildLogos('sf'),
    primaryColor: '#AA0000',
    secondaryColor: '#B3995D',
  },
  SEA: {
    abbreviation: 'SEA',
    name: 'Seattle Seahawks',
    location: 'Seattle',
    nickname: 'Seahawks',
    espnId: '26',
    conference: 'NFC',
    division: 'West',
    logos: buildLogos('sea'),
    primaryColor: '#002244',
    secondaryColor: '#69BE28',
  },
};

// ========================================================================
// HELPER FUNCTIONS
// ========================================================================

/**
 * Get team logo by abbreviation
 * 
 * @param abbr - Team abbreviation (e.g., 'GB', 'DET', 'MIN')
 * @param variant - 'logo' | 'logoDark' | 'scoreboard' | 'small'
 * @returns Logo URL or undefined if team not found
 * 
 * @example
 * getNFLLogo('GB')                    // Standard Packers logo
 * getNFLLogo('DET', 'logoDark')       // Lions logo for dark backgrounds
 * getNFLLogo('MIN', 'scoreboard')     // Vikings scoreboard style
 */
export function getNFLLogo(
  abbr: string,
  variant: keyof NFLTeamLogos = 'logo'
): string | undefined {
  const team = NFL_TEAMS[abbr.toUpperCase() as NFLTeamAbbreviation];
  return team?.logos[variant];
}

/**
 * Get full team data by abbreviation
 * 
 * @param abbr - Team abbreviation
 * @returns Full NFLTeam object or undefined
 */
export function getNFLTeam(abbr: string): NFLTeam | undefined {
  return NFL_TEAMS[abbr.toUpperCase() as NFLTeamAbbreviation];
}

/**
 * Get team name by abbreviation
 * 
 * @param abbr - Team abbreviation
 * @returns Full team name or the abbreviation if not found
 */
export function getNFLTeamName(abbr: string): string {
  return NFL_TEAMS[abbr.toUpperCase() as NFLTeamAbbreviation]?.name ?? abbr;
}

/**
 * Get teams by division
 * 
 * @param conference - 'AFC' | 'NFC'
 * @param division - 'North' | 'South' | 'East' | 'West'
 * @returns Array of teams in that division
 */
export function getTeamsByDivision(
  conference: NFLConference,
  division: NFLDivision
): NFLTeam[] {
  return Object.values(NFL_TEAMS).filter(
    team => team.conference === conference && team.division === division
  );
}

/**
 * Get all teams in a conference
 * 
 * @param conference - 'AFC' | 'NFC'
 * @returns Array of teams in that conference
 */
export function getTeamsByConference(conference: NFLConference): NFLTeam[] {
  return Object.values(NFL_TEAMS).filter(team => team.conference === conference);
}

/**
 * Get Bears division rivals
 * 
 * @param includeBears - Whether to include the Bears (default: false)
 * @returns Array of NFC North teams
 */
export function getNFCNorth(includeBears = false): NFLTeam[] {
  const nfcNorth = getTeamsByDivision('NFC', 'North');
  return includeBears ? nfcNorth : nfcNorth.filter(t => t.abbreviation !== 'CHI');
}

// ========================================================================
// CONVENIENCE ARRAYS
// ========================================================================

/** All NFL team abbreviations */
export const NFL_TEAM_ABBREVIATIONS: NFLTeamAbbreviation[] = Object.keys(NFL_TEAMS) as NFLTeamAbbreviation[];

/** All NFL teams as array */
export const ALL_NFL_TEAMS: NFLTeam[] = Object.values(NFL_TEAMS);

/** NFC North abbreviations (Bears division) */
export const NFC_NORTH_ABBRS: NFLTeamAbbreviation[] = ['CHI', 'DET', 'GB', 'MIN'];

/** Bears division rivals (excludes Bears) */
export const BEARS_RIVALS: NFLTeamAbbreviation[] = ['DET', 'GB', 'MIN'];

// ========================================================================
// DEFAULT EXPORT
// ========================================================================

export default NFL_TEAMS;