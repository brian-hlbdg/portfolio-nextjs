/**
 * src/data/bears-roster.ts
 * ========================================================================
 * Sample Bears Roster Data
 * 
 * This is sample/mock data for development and demonstration.
 * In production, this would come from:
 * - ESPN API
 * - NFL API
 * - A backend database
 * 
 * The structure matches BearsPlayer interface for consistency.
 * ========================================================================
 */

import { BearsPlayer } from '@/components/features/types/bears.types';

/**
 * Active Roster - Starting Lineup & Key Backups
 * Organized by position (though not required - RosterSection handles grouping)
 */
export const BEARS_ACTIVE_ROSTER: BearsPlayer[] = [
  // QUARTERBACKS
  {
    id: 'bears_caleb_williams',
    name: 'Caleb Williams',
    number: 1,
    position: 'QB',
    height: '6\'2"',
    weight: 212,
    college: 'USC',
    nflId: 'CAL713454',
  },
  {
    id: 'bears_backup_qb',
    name: 'Tyson Bagent',
    number: 3,
    position: 'QB',
    height: '6\'1"',
    weight: 208,
    college: 'Shepherd',
  },

  // RUNNING BACKS
  {
    id: 'bears_roschon_johnson',
    name: 'Roschon Johnson',
    number: 25,
    position: 'RB',
    height: '5\'10"',
    weight: 213,
    college: 'Texas',
  },
  {
    id: 'bears_d_henderson',
    name: 'D\'Andre Swift',
    number: 4,
    position: 'RB',
    height: '5\'8"',
    weight: 201,
    college: 'Georgia',
  },

  // WIDE RECEIVERS
  {
    id: 'bears_rome_odunze',
    name: 'Rome Odunze',
    number: 1,
    position: 'WR',
    height: '6\'3"',
    weight: 210,
    college: 'Washington',
  },
  {
    id: 'bears_dj_moore',
    name: 'DJ Moore',
    number: 2,
    position: 'WR',
    height: '6\'0"',
    weight: 195,
    college: 'Maryland',
  },
  {
    id: 'bears_keenan_allen',
    name: 'Keenan Allen',
    number: 13,
    position: 'WR',
    height: '6\'1"',
    weight: 198,
    college: 'California',
  },

  // TIGHT ENDS
  {
    id: 'bears_cole_kmet',
    name: 'Cole Kmet',
    number: 84,
    position: 'TE',
    height: '6\'4"',
    weight: 258,
    college: 'Notre Dame',
  },

  // OFFENSIVE LINE - TACKLES
  {
    id: 'bears_braxton_miller',
    name: 'Braxton Miller',
    number: 70,
    position: 'OT',
    height: '6\'4"',
    weight: 315,
    college: 'Ohio State',
  },
  {
    id: 'bears_tevin_jenkins',
    name: 'Tevin Jenkins',
    number: 73,
    position: 'OT',
    height: '6\'4"',
    weight: 314,
    college: 'Oklahoma State',
  },

  // OFFENSIVE LINE - GUARDS & CENTER
  {
    id: 'bears_aaron_stinnie',
    name: 'Aaron Stinnie',
    number: 67,
    position: 'OG',
    height: '6\'3"',
    weight: 315,
    college: 'Kentucky',
  },
  {
    id: 'bears_ryan_bates',
    name: 'Ryan Bates',
    number: 64,
    position: 'OG',
    height: '6\'3"',
    weight: 308,
    college: 'Penn State',
  },
  {
    id: 'bears_lucas_patrick',
    name: 'Lucas Patrick',
    number: 62,
    position: 'C',
    height: '6\'3"',
    weight: 295,
    college: 'Iowa',
  },

  // DEFENSIVE LINE - DEFENSIVE ENDS
  {
    id: 'bears_jermaine_eluemunor',
    name: 'Montez Sweat',
    number: 94,
    position: 'DE',
    height: '6\'6"',
    weight: 260,
    college: 'Michigan State',
  },
  {
    id: 'bears_andrew_wylie',
    name: 'Yannick Ngakoue',
    number: 91,
    position: 'DE',
    height: '6\'2"',
    weight: 242,
    college: 'Maryland',
  },

  // DEFENSIVE LINE - DEFENSIVE TACKLES
  {
    id: 'bears_azeez_ojulari',
    name: 'Gervon Dexter Sr.',
    number: 97,
    position: 'DT',
    height: '6\'4"',
    weight: 303,
    college: 'Florida',
  },
  {
    id: 'bears_dex_lawrence',
    name: 'Jalen Carter',
    number: 92,
    position: 'DT',
    height: '6\'3"',
    weight: 314,
    college: 'Georgia',
  },

  // LINEBACKERS
  {
    id: 'bears_jack_sanborn',
    name: 'Jack Sanborn',
    number: 57,
    position: 'LB',
    height: '6\'3"',
    weight: 235,
    college: 'North Carolina',
  },
  {
    id: 'bears_matt_adams',
    name: 'Matt Adams',
    number: 55,
    position: 'LB',
    height: '6\'0"',
    weight: 230,
    college: 'Abilene Christian',
  },
  {
    id: 'bears_tatum_bethune',
    name: 'Tatum Bethune',
    number: 50,
    position: 'LB',
    height: '6\'1"',
    weight: 234,
    college: 'Florida',
  },

  // CORNERBACKS
  {
    id: 'bears_jaylon_johnson',
    name: 'Jaylon Johnson',
    number: 33,
    position: 'CB',
    height: '6\'2"',
    weight: 200,
    college: 'Oklahoma',
  },
  {
    id: 'bears_kyler_gordon',
    name: 'Kyler Gordon',
    number: 20,
    position: 'CB',
    height: '6\'0"',
    weight: 190,
    college: 'Washington',
  },

  // SAFETIES
  {
    id: 'bears_jaquan_brisker',
    name: 'Jaquan Brisker',
    number: 9,
    position: 'S',
    height: '6\'1"',
    weight: 199,
    college: 'Penn State',
  },
  {
    id: 'bears_tashaun_gipson',
    name: 'Tashaun Gipson Sr.',
    number: 21,
    position: 'S',
    height: '6\'0"',
    weight: 196,
    college: 'Wyoming',
  },

  // KICKER & PUNTER
  {
    id: 'bears_cairo_santos',
    name: 'Cairo Santos',
    number: 2,
    position: 'K',
    height: '5\'10"',
    weight: 182,
    college: 'Tulane',
  },
  {
    id: 'bears_trent_sieg',
    name: 'Trent Sieg',
    number: 16,
    position: 'P',
    height: '6\'4"',
    weight: 206,
    college: 'Oklahoma',
  },
];

/**
 * Injured List - Sample of players on IR/Out
 * In production, this would come from live injury data
 */
export const BEARS_INJURED_ROSTER: BearsPlayer[] = [
  {
    id: 'bears_herbert_injured',
    name: 'Justin Herbert',
    number: 10,
    position: 'QB',
    height: '6\'6"',
    weight: 236,
    college: 'Oregon',
  },
  {
    id: 'bears_allen_robinson_injured',
    name: 'Allen Robinson II',
    number: 12,
    position: 'WR',
    height: '6\'2"',
    weight: 210,
    college: 'Penn State',
  },
  {
    id: 'bears_henderson_injured',
    name: 'Tyrique Henderson',
    number: 35,
    position: 'RB',
    height: '5\'9"',
    weight: 201,
    college: 'Florida State',
  },
  {
    id: 'bears_trevis_whitley_injured',
    name: 'Braxton Smith',
    number: 68,
    position: 'OG',
    height: '6\'4"',
    weight: 318,
    college: 'Wake Forest',
  },
  {
    id: 'bears_dante_fowler_injured',
    name: 'Dante Fowler Jr.',
    number: 99,
    position: 'DE',
    height: '6\'2"',
    weight: 254,
    college: 'Florida',
  },
];

/**
 * Utility: Combine active and injured for full roster view
 */
export function getFullBearsRoster(): BearsPlayer[] {
  return [...BEARS_ACTIVE_ROSTER, ...BEARS_INJURED_ROSTER];
}

/**
 * Utility: Get players by position
 */
export function getBearsByPosition(position: string): BearsPlayer[] {
  return BEARS_ACTIVE_ROSTER.filter((player) => player.position === position);
}