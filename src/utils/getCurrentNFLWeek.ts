/**
 * src/utils/getCurrentNFLWeek.ts
 * ========================================================================
 * UTILITY: Calculate Current NFL Week from Schedule
 * 
 * INTERESTING CODE CONCEPT:
 * We calculate the week entirely from the schedule data - NO hardcoded 
 * season start dates! This approach:
 * 
 * 1. Counts completed games to determine games played
 * 2. Detects bye week by finding ~14 day gaps between games
 * 3. Derives current week from game index + bye week offset
 * 4. Works for ANY season without code updates
 * 
 * LOGIC:
 * - Week = (game index + 1) + (1 if past bye week)
 * - 14 games played + bye in week 7 = currently Week 16
 * - Bye detected when gap between games is 12-16 days (vs normal ~7)
 * 
 * ========================================================================
 */

// ========================================================================
// TYPES
// ========================================================================

/**
 * Minimal game info needed for week calculation
 * Works with your existing ScheduleGame type
 */
export interface GameForWeekCalc {
  id: string;
  date: string; // ISO date string
  status: 'scheduled' | 'live' | 'final';
}

export interface CurrentWeekResult {
  /** The current NFL week number (1-18 regular season) */
  week: number;
  /** Whether the team is currently in their bye week */
  isByeWeek: boolean;
  /** The week number of the bye (null if not yet determined) */
  byeWeek: number | null;
  /** Number of games completed */
  gamesPlayed: number;
  /** Total games in schedule */
  totalGames: number;
  /** Days until next game (null if season over) */
  daysUntilNextGame: number | null;
  /** Debug info for development */
  debug?: {
    lastGameDate: string | null;
    nextGameDate: string | null;
    calculationMethod: string;
  };
}

// ========================================================================
// CONSTANTS
// ========================================================================

/** Days in an NFL week */
const DAYS_PER_WEEK = 7;

/** Each team plays 17 games (one bye week) */
const GAMES_PER_SEASON = 17;

// ========================================================================
// MAIN FUNCTION
// ========================================================================

/**
 * Calculate the current NFL week from a team's schedule
 * 
 * FULLY DYNAMIC - no hardcoded dates!
 * Derives week from:
 * 1. Number of completed games
 * 2. Detecting bye week gaps in the schedule
 * 
 * @param games - Array of games from the schedule
 * @param referenceDate - Optional date to use as "now" (defaults to current date)
 * @returns CurrentWeekResult with week number and bye week info
 * 
 * @example
 * const { week, isByeWeek, gamesPlayed } = getCurrentNFLWeek(scheduleData.games);
 * // Output: { week: 16, isByeWeek: false, gamesPlayed: 14, ... }
 */
export function getCurrentNFLWeek(
  games: GameForWeekCalc[],
  referenceDate: Date = new Date()
): CurrentWeekResult {
  // Handle empty schedule
  if (!games || games.length === 0) {
    return {
      week: 1,
      isByeWeek: false,
      byeWeek: null,
      gamesPlayed: 0,
      totalGames: 0,
      daysUntilNextGame: null,
      debug: {
        lastGameDate: null,
        nextGameDate: null,
        calculationMethod: 'no-games-default-week-1',
      },
    };
  }

  // Sort games by date
  const sortedGames = [...games].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Separate completed and upcoming games
  const completedGames = sortedGames.filter(g => g.status === 'final');
  const upcomingGames = sortedGames.filter(g => g.status === 'scheduled');
  const liveGames = sortedGames.filter(g => g.status === 'live');

  const gamesPlayed = completedGames.length;
  const totalGames = sortedGames.length;

  // Get last completed and next upcoming
  const lastGame = completedGames.length > 0 
    ? completedGames[completedGames.length - 1] 
    : null;
  const nextGame = upcomingGames.length > 0 
    ? upcomingGames[0] 
    : null;

  // Detect bye week from schedule gaps
  const byeWeek = detectByeWeek(sortedGames);

  // Calculate days until next game
  let daysUntilNextGame: number | null = null;
  if (nextGame) {
    const nextGameDate = new Date(nextGame.date);
    const now = referenceDate.getTime();
    daysUntilNextGame = Math.ceil(
      (nextGameDate.getTime() - now) / (1000 * 60 * 60 * 24)
    );
  }

  // If there's a live game, we're in that game's week
  if (liveGames.length > 0) {
    const liveGameIndex = sortedGames.findIndex(g => g.id === liveGames[0].id);
    const liveWeek = calculateWeekFromGamesPlayed(liveGameIndex, byeWeek);
    
    return {
      week: liveWeek,
      isByeWeek: false,
      byeWeek,
      gamesPlayed,
      totalGames,
      daysUntilNextGame: 0,
      debug: {
        lastGameDate: lastGame?.date || null,
        nextGameDate: nextGame?.date || null,
        calculationMethod: 'live-game',
      },
    };
  }

  // Calculate current week based on games played
  let currentWeek: number;
  let isByeWeek = false;
  let calculationMethod: string;

  if (gamesPlayed === 0 && nextGame) {
    // Season hasn't started - Week 1
    currentWeek = 1;
    calculationMethod = 'pre-season';
  } else if (nextGame) {
    // Mid-season: check if we're in bye week
    const nextGameIndex = sortedGames.findIndex(g => g.id === nextGame.id);
    const expectedWeekForNextGame = calculateWeekFromGamesPlayed(nextGameIndex, byeWeek);
    const weekAfterLastGame = calculateWeekFromGamesPlayed(gamesPlayed - 1, byeWeek) + 1;
    
    // If there's a gap between last game's week+1 and next game's week, we're in bye
    if (byeWeek !== null && weekAfterLastGame === byeWeek) {
      currentWeek = byeWeek;
      isByeWeek = true;
      calculationMethod = 'bye-week';
    } else {
      // Current week = week of next game (we're heading into it)
      currentWeek = expectedWeekForNextGame;
      calculationMethod = 'next-game-week';
    }
  } else if (lastGame) {
    // Season is over - return last game's week
    currentWeek = calculateWeekFromGamesPlayed(gamesPlayed - 1, byeWeek);
    calculationMethod = 'season-complete';
  } else {
    currentWeek = 1;
    calculationMethod = 'fallback';
  }

  return {
    week: currentWeek,
    isByeWeek,
    byeWeek,
    gamesPlayed,
    totalGames,
    daysUntilNextGame,
    debug: {
      lastGameDate: lastGame?.date || null,
      nextGameDate: nextGame?.date || null,
      calculationMethod,
    },
  };
}

/**
 * Calculate week number from game index (0-based)
 * Accounts for bye week if known
 */
function calculateWeekFromGamesPlayed(gameIndex: number, byeWeek: number | null): number {
  // Week = gameIndex + 1 (convert 0-based to 1-based)
  // But if bye week is before or at this point, add 1 more
  const baseWeek = gameIndex + 1;
  
  if (byeWeek !== null && baseWeek >= byeWeek) {
    return baseWeek + 1; // Skip over the bye week
  }
  
  return baseWeek;
}

// ========================================================================
// HELPER FUNCTIONS
// ========================================================================

/**
 * Detect the bye week by finding a gap in the schedule
 * 
 * Analyzes game dates to find where there's a ~14 day gap
 * (normal gap is ~7 days between games)
 * 
 * @param games - Sorted array of games by date
 * @returns The bye week number, or null if not detectable
 */
function detectByeWeek(games: GameForWeekCalc[]): number | null {
  if (games.length < 2) return null;

  // Look for a gap of ~14 days between consecutive games
  for (let i = 1; i < games.length; i++) {
    const prevDate = new Date(games[i - 1].date);
    const currDate = new Date(games[i].date);
    const daysBetween = Math.floor(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // If there's a gap of 12-16 days (roughly 2 weeks), that's the bye
    if (daysBetween >= 12 && daysBetween <= 16) {
      // Bye week = game index + 1 (the week after the previous game)
      return i + 1;
    }
  }

  return null;
}

// ========================================================================
// CONVENIENCE FUNCTIONS
// ========================================================================

/**
 * Simple wrapper that just returns the week number
 */
export function getSimpleCurrentWeek(games: GameForWeekCalc[]): number {
  return getCurrentNFLWeek(games).week;
}

/**
 * Get formatted week display string
 * Examples: "Week 16", "Week 8 (BYE)", "Week 18 (Final)"
 */
export function getWeekDisplayString(games: GameForWeekCalc[]): string {
  const result = getCurrentNFLWeek(games);
  
  if (result.isByeWeek) {
    return `Week ${result.week} (BYE)`;
  }
  
  if (result.gamesPlayed >= GAMES_PER_SEASON) {
    return `Week ${result.week} (Season Complete)`;
  }
  
  return `Week ${result.week}`;
}

/**
 * Check if the team is currently in their bye week
 */
export function isInByeWeek(games: GameForWeekCalc[]): boolean {
  return getCurrentNFLWeek(games).isByeWeek;
}

/**
 * Get the bye week number for a team's schedule
 */
export function getByeWeek(games: GameForWeekCalc[]): number | null {
  return getCurrentNFLWeek(games).byeWeek;
}

// ========================================================================
// TYPE EXPORT FOR INTEGRATION
// ========================================================================

export type { GameForWeekCalc as ScheduleGameForWeek };