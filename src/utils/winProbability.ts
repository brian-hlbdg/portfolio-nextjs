/**
 * src/utils/winProbability.ts
 * ========================================================================
 * Calculate win probability based on team records
 * Uses Bill James' Log5 formula + home field advantage
 * 
 * Log5 is a method for predicting the probability of one team beating
 * another based on their respective win percentages.
 * ========================================================================
 */

interface TeamRecord {
  wins: number;
  losses: number;
  ties?: number;
}

/**
 * Calculate win probability for a team against an opponent
 * 
 * @param teamRecord - The team's current W-L record
 * @param opponentRecord - The opponent's current W-L record
 * @param isHome - Whether the team is playing at home
 * @returns Win probability as a percentage (0-100)
 * 
 * @example
 * // Bears (4-8) vs Packers (9-3) at home
 * const probability = calculateWinProbability(
 *   { wins: 4, losses: 8 },
 *   { wins: 9, losses: 3 },
 *   true
 * );
 * // Returns ~28%
 */
export function calculateWinProbability(
  teamRecord: TeamRecord,
  opponentRecord: TeamRecord,
  isHome: boolean
): number {
  const teamGames = teamRecord.wins + teamRecord.losses;
  const oppGames = opponentRecord.wins + opponentRecord.losses;

  // Default to 50% if either team has no games played
  if (teamGames === 0 || oppGames === 0) {
    return 50;
  }

  // Calculate win percentages
  const teamWinPct = teamRecord.wins / teamGames;
  const oppWinPct = opponentRecord.wins / oppGames;

  // Handle edge cases where both teams are undefeated or winless
  if (teamWinPct === 1 && oppWinPct === 1) return isHome ? 53 : 47;
  if (teamWinPct === 0 && oppWinPct === 0) return isHome ? 53 : 47;

  // Calculate base probability using Log5 formula
  let probability: number;

  if (teamWinPct === 1) {
    // Undefeated team vs any opponent
    probability = 0.90;
  } else if (oppWinPct === 1) {
    // Any team vs undefeated opponent
    probability = 0.10;
  } else if (teamWinPct === 0) {
    // Winless team vs any opponent
    probability = 0.10;
  } else if (oppWinPct === 0) {
    // Any team vs winless opponent
    probability = 0.90;
  } else {
    // Standard Log5 formula
    // P(A beats B) = (WinPct_A * (1 - WinPct_B)) / 
    //                (WinPct_A * (1 - WinPct_B) + WinPct_B * (1 - WinPct_A))
    probability =
      (teamWinPct * (1 - oppWinPct)) /
      (teamWinPct * (1 - oppWinPct) + oppWinPct * (1 - teamWinPct));
  }

  // Apply home field advantage
  // NFL home teams win approximately 53% of games historically
  // This translates to roughly a 3% advantage
  const homeFieldAdvantage = 0.03;
  probability += isHome ? homeFieldAdvantage : -homeFieldAdvantage;

  // Clamp between 5% and 95% (no game is ever a certainty)
  probability = Math.min(0.95, Math.max(0.05, probability));

  // Return as whole percentage
  return Math.round(probability * 100);
}

/**
 * Get a descriptive label for the win probability
 * 
 * @param probability - Win probability percentage (0-100)
 * @returns Descriptive label
 */
export function getProbabilityLabel(probability: number): string {
  if (probability >= 75) return 'Strong Favorite';
  if (probability >= 60) return 'Favored';
  if (probability >= 45) return 'Toss-up';
  if (probability >= 30) return 'Underdog';
  return 'Heavy Underdog';
}

/**
 * Get color class based on probability
 * For use with Tailwind CSS
 * 
 * @param probability - Win probability percentage (0-100)
 * @returns Tailwind color class
 */
export function getProbabilityColor(probability: number): string {
  if (probability >= 65) return 'text-green-500';
  if (probability >= 50) return 'text-green-400';
  if (probability >= 40) return 'text-yellow-500';
  if (probability >= 25) return 'text-orange-500';
  return 'text-red-500';
}

/**
 * Get gradient color for probability bar
 * 
 * @param probability - Win probability percentage (0-100)
 * @returns Tailwind gradient classes
 */
export function getProbabilityGradient(probability: number): string {
  if (probability >= 65) return 'from-green-500 to-green-400';
  if (probability >= 50) return 'from-green-400 to-yellow-400';
  if (probability >= 40) return 'from-yellow-500 to-yellow-400';
  if (probability >= 25) return 'from-orange-500 to-orange-400';
  return 'from-red-500 to-red-400';
}