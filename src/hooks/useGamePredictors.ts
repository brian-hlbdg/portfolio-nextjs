/**
 * src/hooks/useGamePredictors.ts
 * ========================================================================
 * Fetches ESPN FPI predictor data for multiple games
 * 
 * Features:
 * - Fetches win probability from ESPN's Football Power Index (FPI)
 * - Handles Bears as home or away team
 * - Parallel fetching for performance
 * - Graceful error handling per game
 * - Returns Map for O(1) lookup by gameId
 * 
 * ESPN FPI considers:
 * - Expected Points Added (EPA)
 * - Opponent strength adjustments
 * - Home field advantage
 * - Recent performance trends
 * ========================================================================
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

// ========================================================================
// TYPES
// ========================================================================

/**
 * Prediction data for a single game
 */
export interface GamePrediction {
  gameId: string;
  bearsWinProbability: number;    // 0-100 percentage
  opponentWinProbability: number; // 0-100 percentage
  predictedSpread: number;        // Positive = Bears favored, Negative = Bears underdog
  matchupQuality: number;         // 0-100 how competitive/exciting
  chanceOfTie: number;            // Usually very small
  lastUpdated: string;
}

/**
 * What the hook returns
 */
export interface UseGamePredictorsReturn {
  predictions: Map<string, GamePrediction>;
  loading: boolean;
  error: string | null;
  successCount: number;
  failedCount: number;
  refetch: () => Promise<void>;
}

/**
 * ESPN API response structure for predictor endpoint
 */
interface ESPNPredictorResponse {
  name?: string;
  shortName?: string;
  lastModified?: string;
  homeTeam?: ESPNTeamPrediction;
  awayTeam?: ESPNTeamPrediction;
}

interface ESPNTeamPrediction {
  team?: {
    $ref?: string;
  };
  statistics?: ESPNPredictorStat[];
}

interface ESPNPredictorStat {
  name: string;
  displayName?: string;
  value: number;
  displayValue?: string;
}

// ========================================================================
// CONSTANTS
// ========================================================================

const BEARS_TEAM_ID = '3';
const PREDICTOR_BASE_URL = 'https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events';

// ========================================================================
// HELPER FUNCTIONS
// ========================================================================

/**
 * Extract a specific stat from ESPN statistics array
 */
function extractStat(stats: ESPNPredictorStat[], statName: string): number {
  const stat = stats.find((s) => s.name === statName);
  return stat?.value ?? 0;
}

/**
 * Check if a team ref URL contains the Bears team ID
 */
function isBearsTeam(teamRef: string | undefined): boolean {
  if (!teamRef) return false;
  return teamRef.includes(`/teams/${BEARS_TEAM_ID}`);
}

/**
 * Fetch predictor data for a single game
 */
async function fetchSingleGamePredictor(
  gameId: string
): Promise<GamePrediction | null> {
  try {
    const url = `${PREDICTOR_BASE_URL}/${gameId}/competitions/${gameId}/predictor`;
    
    const response = await Promise.race([
      fetch(url),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 5000)
      ),
    ]);

    if (!response.ok) {
      console.warn(`Predictor API returned ${response.status} for game ${gameId}`);
      return null;
    }

    const data: ESPNPredictorResponse = await response.json();

    // Determine which team is the Bears
    const isBearsHome = isBearsTeam(data.homeTeam?.team?.$ref);
    const isBearsAway = isBearsTeam(data.awayTeam?.team?.$ref);

    if (!isBearsHome && !isBearsAway) {
      // This game doesn't involve the Bears
      console.warn(`Game ${gameId} doesn't involve Bears`);
      return null;
    }

    // Get Bears and opponent data
    const bearsData = isBearsHome ? data.homeTeam : data.awayTeam;
    const opponentData = isBearsHome ? data.awayTeam : data.homeTeam;

    const bearsStats = bearsData?.statistics || [];
    const opponentStats = opponentData?.statistics || [];

    // Extract stats
    const bearsWinProb = extractStat(bearsStats, 'gameProjection');
    const opponentWinProb = extractStat(opponentStats, 'gameProjection');
    const predictedSpread = extractStat(bearsStats, 'teamPredPtDiff');
    const matchupQuality = extractStat(bearsStats, 'matchupQuality');
    const chanceOfTie = extractStat(bearsStats, 'teamChanceTie');

    return {
      gameId,
      bearsWinProbability: Math.round(bearsWinProb),
      opponentWinProbability: Math.round(opponentWinProb),
      predictedSpread: Math.round(predictedSpread * 10) / 10, // One decimal
      matchupQuality: Math.round(matchupQuality),
      chanceOfTie: Math.round(chanceOfTie * 10) / 10,
      lastUpdated: data.lastModified || new Date().toISOString(),
    };
  } catch (error) {
    console.warn(`Failed to fetch predictor for game ${gameId}:`, error);
    return null;
  }
}

// ========================================================================
// MAIN HOOK
// ========================================================================

/**
 * Hook to fetch ESPN FPI predictor data for multiple games
 * 
 * @param gameIds - Array of ESPN game IDs to fetch predictions for
 * @returns Object with predictions Map, loading state, and error info
 * 
 * @example
 * const upcomingGameIds = games.filter(g => g.status === 'scheduled').map(g => g.id);
 * const { predictions, loading } = useGamePredictors(upcomingGameIds);
 * 
 * // Get prediction for specific game
 * const prediction = predictions.get(gameId);
 * console.log(`Bears have ${prediction?.bearsWinProbability}% chance to win`);
 */
export function useGamePredictors(gameIds: string[]): UseGamePredictorsReturn {
  const [predictions, setPredictions] = useState<Map<string, GamePrediction>>(
    new Map()
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number>(0);
  const [failedCount, setFailedCount] = useState<number>(0);

  const fetchPredictors = useCallback(async () => {
    if (gameIds.length === 0) {
      setPredictions(new Map());
      return;
    }

    setLoading(true);
    setError(null);

    console.log(`🎯 Fetching ESPN FPI predictions for ${gameIds.length} games...`);

    try {
      // Fetch all predictions in parallel
      const results = await Promise.all(
        gameIds.map((gameId) => fetchSingleGamePredictor(gameId))
      );

      // Build the predictions map
      const newPredictions = new Map<string, GamePrediction>();
      let successes = 0;
      let failures = 0;

      results.forEach((result) => {
        if (result) {
          newPredictions.set(result.gameId, result);
          successes++;
          console.log(
            `   ✅ Game ${result.gameId}: Bears ${result.bearsWinProbability}% (spread: ${result.predictedSpread > 0 ? '+' : ''}${result.predictedSpread})`
          );
        } else {
          failures++;
        }
      });

      setPredictions(newPredictions);
      setSuccessCount(successes);
      setFailedCount(failures);

      console.log(
        `🏈 Predictions loaded: ${successes} successful, ${failures} failed`
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to fetch predictions:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [gameIds.join(',')]); // Re-run when gameIds change

  // Fetch on mount and when gameIds change
  useEffect(() => {
    fetchPredictors();
  }, [fetchPredictors]);

  return {
    predictions,
    loading,
    error,
    successCount,
    failedCount,
    refetch: fetchPredictors,
  };
}

// ========================================================================
// UTILITY FUNCTIONS (Exported for use in components)
// ========================================================================

/**
 * Get display color class based on win probability
 */
export function getPredictionColorClass(probability: number): string {
  if (probability >= 60) return 'text-green-500';
  if (probability >= 45) return 'text-yellow-500';
  if (probability >= 30) return 'text-orange-500';
  return 'text-red-500';
}

/**
 * Get gradient class for probability bar
 */
export function getPredictionGradient(probability: number): string {
  if (probability >= 60) return 'from-green-500 to-green-400';
  if (probability >= 45) return 'from-yellow-500 to-yellow-400';
  if (probability >= 30) return 'from-orange-500 to-orange-400';
  return 'from-red-500 to-red-400';
}

/**
 * Get descriptive label for probability
 */
export function getPredictionLabel(probability: number): string {
  if (probability >= 70) return 'Strong Favorite';
  if (probability >= 55) return 'Slight Favorite';
  if (probability >= 45) return 'Toss-up';
  if (probability >= 30) return 'Underdog';
  return 'Heavy Underdog';
}

/**
 * Format predicted spread for display
 * Positive = Bears favored, Negative = Opponent favored
 */
export function formatSpread(spread: number): string {
  if (spread > 0) return `Bears -${spread}`;
  if (spread < 0) return `Bears +${Math.abs(spread)}`;
  return 'Pick\'em';
}