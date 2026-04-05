/**
 * src/utils/getNFLSeasonState.ts
 * ========================================================================
 * Pure utility — no React, no API calls.
 * Determines the current NFL season phase from already-fetched schedule data.
 * ========================================================================
 */

export type SeasonState = 'regular' | 'offseason';

/**
 * Derive season state from the Bears schedule games array.
 *
 * Logic:
 * - If loading or games is null → default to 'regular' (safe)
 * - If any game is 'scheduled' or 'live'  → 'regular'
 * - If all games are 'final' AND ≥10 played → 'offseason'
 * - Otherwise → 'regular'
 */
export function getNFLSeasonState(
  games: Array<{ status: 'scheduled' | 'live' | 'final' }> | null,
  loading: boolean
): SeasonState {
  if (loading || games === null) return 'regular';
  if (games.length === 0) return 'regular'; // No data yet — don't assume offseason

  const hasActive = games.some(
    (g) => g.status === 'scheduled' || g.status === 'live'
  );
  if (hasActive) return 'regular';

  const allFinal = games.every((g) => g.status === 'final');
  if (allFinal && games.length >= 10) return 'offseason';

  return 'regular';
}
