// Actual 2024 and 2025 Chicago Bears season data.
// Sources: chicagobears.com, statmuse.com, wikipedia.org

export interface SeasonHighlight {
  week: number;
  opponent: string;
  result: 'W' | 'L' | 'T';
  score: string;
  note: string;
}

export interface GreatestHit {
  label: string;
  week: number;
  opponent: string;
  score: string;
  description: string;
}

export interface BearsSeason {
  record: string;
  wins: number;
  losses: number;
  ties: number;
  divisionFinish: string;
  divisionName: string;
  pointsFor: number;
  pointsAgainst: number;
  calYear: number;
  calebWilliamsYear: number;
  highlights: SeasonHighlight[];
  greatestHits: GreatestHit[];
}

// ── 2025 NFC North Final Standings ───────────────────────────────────────────
// Source: @BradGalli / ESPN — Bears 11-6, Packers 9-7-1, Vikings 9-8, Lions 9-8

export interface DivisionTeamStanding {
  teamId: string;
  teamName: string;
  divisionRank: number;
  wins: number;
  losses: number;
  ties: number;
  winPercentage: number;
  pointDifferential: number;
}

export const NFC_NORTH_2025_STANDINGS: DivisionTeamStanding[] = [
  { teamId: '3',  teamName: 'Chicago Bears',    divisionRank: 1, wins: 11, losses: 6,  ties: 0, winPercentage: 0.647, pointDifferential: 26  },
  { teamId: '9',  teamName: 'Green Bay Packers', divisionRank: 2, wins: 9,  losses: 7,  ties: 1, winPercentage: 0.559, pointDifferential: 81  },
  { teamId: '16', teamName: 'Minnesota Vikings', divisionRank: 3, wins: 9,  losses: 8,  ties: 0, winPercentage: 0.529, pointDifferential: -12 },
  { teamId: '8',  teamName: 'Detroit Lions',     divisionRank: 4, wins: 9,  losses: 8,  ties: 0, winPercentage: 0.529, pointDifferential: -21 },
];

// ── 2025 Season ───────────────────────────────────────────────────────────────
// 11-6 | 1st NFC North | 441 PF / 415 PA (+26) | Made playoffs
// Wild Card: beat Packers 31-27 | Divisional: lost to Rams 17-20 OT

export const BEARS_2025_SEASON: BearsSeason = {
  record: '11-6',
  wins: 11,
  losses: 6,
  ties: 0,
  divisionFinish: '1st',
  divisionName: 'NFC North',
  pointsFor: 441,
  pointsAgainst: 415,
  calYear: 2025,
  calebWilliamsYear: 2,
  highlights: [
    { week: 1,  opponent: 'Carolina Panthers',   result: 'W', score: '24-17', note: 'Season opener win under new HC Ben Johnson' },
    { week: 5,  opponent: 'Los Angeles Rams',    result: 'W', score: 'W',     note: 'NFC West test' },
    { week: 13, opponent: 'Philadelphia Eagles', result: 'W', score: '24-15', note: 'Black Friday clincher — first winning season since 2018' },
    { week: 15, opponent: 'Cleveland Browns',    result: 'W', score: '31-3',  note: 'Dominant defensive performance' },
    { week: 18, opponent: 'TBD',                 result: 'W', score: 'W',     note: 'NFC North title clinched' },
    // Playoffs
    { week: 19, opponent: 'Green Bay Packers',   result: 'W', score: '31-27', note: 'Wild Card — first playoff win since 2010' },
    { week: 20, opponent: 'Los Angeles Rams',    result: 'L', score: '17-20', note: 'Divisional Round — lost in OT' },
  ],
  greatestHits: [
    {
      label: 'Wild Card Win',
      week: 19,
      opponent: 'Green Bay Packers',
      score: '31-27',
      description: 'First playoff victory since 2010 — the Bears\' largest playoff comeback since 1933, erasing a deficit to stun the Packers at Soldier Field',
    },
    {
      label: 'Black Friday Stunner',
      week: 13,
      opponent: 'Philadelphia Eagles',
      score: '24-15',
      description: 'Defeated the defending Super Bowl champion Eagles on national TV, clinching the Bears\' first winning season since 2018',
    },
    {
      label: 'Record-Breaking Season',
      week: 15,
      opponent: 'Cleveland Browns',
      score: '31-3',
      description: 'Caleb Williams set the franchise single-season passing yards record (3,942 yds). Bears led NFL in turnover differential at +22, mirroring the 1963 championship team.',
    },
  ],
};

// ── 2024 Season ───────────────────────────────────────────────────────────────
// 5-12 | 4th NFC North | 284 PF / 383 PA | Year 1 Caleb Williams
// Coach Eberflus fired mid-season after Thanksgiving loss to Lions

export const BEARS_2024_SEASON: BearsSeason = {
  record: '5-12',
  wins: 5,
  losses: 12,
  ties: 0,
  divisionFinish: '4th',
  divisionName: 'NFC North',
  pointsFor: 284,
  pointsAgainst: 383,
  calYear: 2024,
  calebWilliamsYear: 1,
  highlights: [
    { week: 1,  opponent: 'Tennessee Titans',   result: 'W', score: '24-17', note: 'Caleb debut — trailed 17-0, rallied to win' },
    { week: 5,  opponent: 'Carolina Panthers',  result: 'W', score: '36-10', note: 'Most dominant win of the season' },
    { week: 6,  opponent: 'Jacksonville Jaguars', result: 'W', score: '35-16', note: 'International Series win in London' },
    { week: 18, opponent: 'Green Bay Packers',  result: 'W', score: '24-22', note: 'Snapped 10-game losing streak; first division win since 2018' },
  ],
  greatestHits: [
    {
      label: "Caleb's Debut Win",
      week: 1,
      opponent: 'Tennessee Titans',
      score: '24-17',
      description: 'Caleb Williams trailed 17-0 and rallied to win his NFL debut — the first #1 overall pick to win his first start since 2002',
    },
    {
      label: 'London Takeover',
      week: 6,
      opponent: 'Jacksonville Jaguars',
      score: '35-16',
      description: 'Bears dominated in London\'s International Series, one of the season\'s most complete performances on both sides of the ball',
    },
    {
      label: 'Revenge on the Packers',
      week: 18,
      opponent: 'Green Bay Packers',
      score: '24-22',
      description: 'Bears ended a 10-game losing streak with a season-finale win over Green Bay — their first division victory since 2018',
    },
  ],
};
