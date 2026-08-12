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
  if (loading || games === null) return 'regular';
  if (games.length === 0) return 'regular';

  // Any active postseason game → postseason view
  const hasPostseason = games.some(
    (g) => g.gameType === 'postseason' && (g.status === 'scheduled' || g.status === 'live')
  );
  if (hasPostseason) return 'postseason';

  const allFinal = games.every((g) => g.status === 'final');
  if (allFinal && games.length >= 10) return 'offseason';

  const hasActive = games.some(
    (g) => g.status === 'scheduled' || g.status === 'live'
  );
  if (hasActive) {
    return referenceDate < REGULAR_SEASON_START_2026 ? 'preseason' : 'regular';
  }

  return 'regular';
}
