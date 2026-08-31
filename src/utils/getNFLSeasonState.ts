/**
 * src/utils/getNFLSeasonState.ts
 * ========================================================================
 * Pure utility — no React, no API calls.
 * Determines the current NFL season phase from already-fetched schedule data.
 * ========================================================================
 */

export type SeasonState = 'regular' | 'preseason' | 'postseason' | 'offseason';

// Update this each year when the NFL regular season kicks off
const REGULAR_SEASON_START_2026 = new Date('2026-09-05T00:00:00');

/**
 * Derive season state from the Bears schedule games array.
 *
 * Logic:
 * - If loading or games is null → default to 'regular' (safe)
 * - If all games are 'final' AND ≥10 played → 'offseason'
 * - If any game is 'scheduled' or 'live' before regular season start → 'preseason'
 * - If any game is 'scheduled' or 'live' after regular season start → 'regular'
 * - Otherwise → 'regular'
 */
export function getNFLSeasonState(
  games: Array<{ status: 'scheduled' | 'live' | 'final'; gameType?: string }> | null,
  loading: boolean,
  referenceDate: Date = new Date()
): SeasonState {
  // Before the regular season opens, always show preseason — even while loading
  // and even after all preseason games have been played.
  if (referenceDate < REGULAR_SEASON_START_2026) {
    // Still check for active postseason games just in case
    if (games) {
      const hasPostseason = games.some(
        (g) => g.gameType === 'postseason' && (g.status === 'scheduled' || g.status === 'live')
      );
      if (hasPostseason) return 'postseason';
    }
    return 'preseason';
  }

  // Past regular season start — derive state from game data
  if (loading || games === null || games.length === 0) return 'regular';

  const hasPostseason = games.some(
    (g) => g.gameType === 'postseason' && (g.status === 'scheduled' || g.status === 'live')
  );
  if (hasPostseason) return 'postseason';

  // Only count regular season games for offseason detection
  const regularGames = games.filter((g) => !g.gameType || g.gameType === 'regular');
  const allRegularFinal = regularGames.length >= 10 && regularGames.every((g) => g.status === 'final');
  if (allRegularFinal) return 'offseason';

  return 'regular';
}
