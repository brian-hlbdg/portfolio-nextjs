/**
 * src/components/features/dashboard/bears/sections/OverviewSection.tsx
 * ========================================================================
 * REDESIGNED Bears Season Overview Section
 * 
 * 4 Information-Rich Cards:
 * 1. Season Snapshot - Record, Division Rank, Win %, Home/Away, Last Game
 *    NEW: Subtext showing next opponent and games remaining
 * 2. Offense Overview - PPG, Yards/Game, Pass/Rush breakdown, 3rd Down %
 * 3. Defense & Discipline - Opp PPG, Takeaways, Giveaways, TO Diff
 * 4. Season Identity - Pass/Rush Ratio, Avg Margin, Streak OR Playoff Status
 * 
 * STRICT TYPESCRIPT - NO ANY TYPES
 * ========================================================================
 */

'use client';

import React, { useMemo } from 'react';
import OverviewStatCard, { 
  StatItem, 
  FooterItem 
} from '../cards/OverviewStatCard';
import { TeamStats } from '@/hooks/useSportsStats';
import { useDivisionStandings, TeamStanding } from '@/hooks/useDivisionStandings';
import { useGameData, GameData } from '@/hooks/useGameData';
import { useTeamStats, TeamStats as DetailedStats } from '@/hooks/useTeamStats';
import { useTeamSchedule } from '@/hooks/useTeamSchedule';

// ========================================================================
// TYPES
// ========================================================================

interface OverviewSectionProps {
  /** Basic team stats (record, wins, losses) */
  stats: TeamStats | null;
  /** Loading state from parent */
  loading?: boolean;
}

// ========================================================================
// CONSTANTS
// ========================================================================

/** Week threshold for switching from Streak to Playoff Status */
const PLAYOFF_STATUS_WEEK_THRESHOLD = 10;

// ========================================================================
// HELPER FUNCTIONS
// ========================================================================

/**
 * Check if a record string is valid (not 0-0 or empty)
 */
function isValidRecord(record: string | undefined | null): boolean {
  if (!record) return false;
  const trimmed = record.trim();
  return trimmed !== '' && trimmed !== '0-0' && trimmed !== 'N/A';
}

/**
 * Calculate win percentage display
 */
function formatWinPercentage(wins: number, losses: number, ties: number): string {
  const totalGames = wins + losses + ties;
  if (totalGames === 0) return '.000';
  const pct = wins / totalGames;
  return pct.toFixed(3).replace(/^0/, '');
}

/**
 * Calculate average margin of victory
 */
function calculateAvgMargin(pointDiff: number, gamesPlayed: number): string {
  if (gamesPlayed === 0) return '0.0';
  const avg = pointDiff / gamesPlayed;
  const sign = avg >= 0 ? '+' : '';
  return `${sign}${avg.toFixed(1)}`;
}

/**
 * Get plain-language description of margin
 */
function getMarginDescription(avgMargin: number): string {
  if (avgMargin > 10) return 'Dominant wins';
  if (avgMargin > 3) return 'Comfortable wins';
  if (avgMargin > 0) return 'Close, edging out';
  if (avgMargin > -3) return 'Close, falling short';
  if (avgMargin > -10) return 'Losing by a score';
  return 'Getting blown out';
}

/**
 * Calculate pass/rush ratio
 */
function calculatePassRushRatio(
  passYards: number, 
  rushYards: number
): { passPercent: number; rushPercent: number; display: string } {
  const total = passYards + rushYards;
  if (total === 0) return { passPercent: 50, rushPercent: 50, display: '50/50' };
  
  const passPercent = Math.round((passYards / total) * 100);
  const rushPercent = 100 - passPercent;
  
  return {
    passPercent,
    rushPercent,
    display: `${passPercent}/${rushPercent}`,
  };
}

/**
 * Calculate per-game average
 */
function perGame(total: number, games: number): string {
  if (games === 0) return '0.0';
  return (total / games).toFixed(1);
}

/**
 * Format third down percentage
 */
function formatThirdDownPct(conversions: number, attempts: number): string {
  if (attempts === 0) return '—';
  return `${Math.round((conversions / attempts) * 100)}%`;
}

/**
 * Get streak icon type
 */
function getStreakIcon(streakType: 'W' | 'L' | 'T'): FooterItem['icon'] {
  switch (streakType) {
    case 'W': return 'win';
    case 'L': return 'loss';
    case 'T': return 'tie';
    default: return 'neutral';
  }
}

/**
 * Get playoff status display and icon
 */
function getPlayoffDisplay(
  status: TeamStanding['playoffStatus'],
  conferenceRank: number
): { text: string; icon: FooterItem['icon'] } {
  switch (status) {
    case 'clinched_bye':
      return { text: 'Clinched Bye', icon: 'playoff' };
    case 'clinched_division':
      return { text: 'Clinched Division', icon: 'playoff' };
    case 'clinched_wildcard':
      return { text: 'Clinched Playoff', icon: 'playoff' };
    case 'eliminated':
      return { text: 'Eliminated', icon: 'eliminated' };
    case 'in_the_hunt':
    default:
      return { 
        text: `In the Hunt`, 
        icon: 'up' 
      };
  }
}

/**
 * Get ordinal suffix (1st, 2nd, 3rd, etc.)
 */
function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

/**
 * Format last game result from game data
 * FIXED: Now correctly extracts from useGameData
 */
function formatLastGame(gameData: GameData | null): { text: string; icon: FooterItem['icon'] } {
  if (!gameData) {
    return { text: '—', icon: 'neutral' };
  }
  
  // Check if we have final score data
  if (!gameData.finalScore || 
      (gameData.finalScore.team === 0 && gameData.finalScore.opponent === 0)) {
    return { text: '—', icon: 'neutral' };
  }
  
  const { result, finalScore } = gameData;
  const icon: FooterItem['icon'] = result === 'W' ? 'win' : result === 'L' ? 'loss' : 'tie';
  const text = `${result} ${finalScore.team}-${finalScore.opponent}`;
  
  return { text, icon };
}

/**
 * Get turnover differential description
 */
function getTurnoverDescription(diff: number): string {
  if (diff > 5) return 'Ball-hawking defense';
  if (diff > 0) return 'Winning turnover battle';
  if (diff === 0) return 'Breaking even';
  if (diff > -5) return 'Need to protect the ball';
  return 'Turnover troubles';
}

/**
 * Get next game subtext from schedule data
 * Returns something like "Next: vs Vikings (3 left)"
 */
function getNextGameSubtext(
  scheduleData: { games: Array<{ status: string; opponent: string; homeAway: string }> } | null,
  totalGamesPlayed: number
): string {
  if (!scheduleData?.games) return '';
  
  // Filter to upcoming games only
  const upcomingGames = scheduleData.games.filter(g => g.status === 'scheduled');
  
  if (upcomingGames.length === 0) {
    return 'Season complete';
  }
  
  const nextGame = upcomingGames[0];
  const gamesLeft = upcomingGames.length;
  
  // Extract short team name (e.g., "Minnesota Vikings" -> "Vikings")
  const opponentParts = nextGame.opponent.split(' ');
  const shortName = opponentParts.length > 1 
    ? opponentParts[opponentParts.length - 1] 
    : nextGame.opponent;
  
  const locationPrefix = nextGame.homeAway === 'home' ? 'vs' : '@';
  
  return `Next: ${locationPrefix} ${shortName} (${gamesLeft} games left)`;
}

// ========================================================================
// MAIN COMPONENT
// ========================================================================

/**
 * OverviewSection Component
 * 
 * Displays 4 information-rich cards showing Bears season overview:
 * - Season Snapshot (identity)
 * - Offense Overview (production)
 * - Defense & Discipline (resistance)
 * - Season Identity (style + context)
 */
export default function OverviewSection({
  stats,
  loading = false,
}: OverviewSectionProps): React.ReactElement {
  // ====== ADDITIONAL HOOKS ======
  const { 
    bearsStanding, 
    currentWeek, 
    loading: standingsLoading 
  } = useDivisionStandings();
  
  // FIXED: useGameData expects team name, not ID
  const { 
    gameData, 
    loading: gameLoading 
  } = useGameData('bears');
  
  const { 
    stats: teamStats, 
    loading: teamStatsLoading 
  } = useTeamStats();

  // Fetch schedule for next game info
  const {
    scheduleData,
    loading: scheduleLoading
  } = useTeamSchedule('bears');

  // ====== COMPUTED VALUES ======
  const calculations = useMemo(() => {
    const wins = stats?.wins ?? bearsStanding?.wins ?? 0;
    const losses = stats?.losses ?? bearsStanding?.losses ?? 0;
    const ties = stats?.ties ?? bearsStanding?.ties ?? 0;
    const totalGames = wins + losses + ties;
    
    // From detailed team stats
    const passYards = teamStats?.passingYards ?? 0;
    const rushYards = teamStats?.rushingYards ?? 0;
    
    // Use standings data for points (more reliable)
    const pointsFor = bearsStanding?.pointsFor ?? teamStats?.pointsFor ?? 0;
    const pointsAgainst = bearsStanding?.pointsAgainst ?? teamStats?.pointsAgainst ?? 0;
    const pointDiff = pointsFor - pointsAgainst;
    
    const passRushRatio = calculatePassRushRatio(passYards, rushYards);
    const avgMarginValue = totalGames > 0 ? pointDiff / totalGames : 0;
    
    // Takeaways = opponent turnovers we forced (INTs + fumbles recovered)
    const takeaways = teamStats?.interceptions ?? 0;
    // Giveaways = our turnovers
    const giveaways = teamStats?.turnovers ?? 0;
    const turnoverDiff = takeaways - giveaways;
    
    return {
      totalGames,
      winPct: formatWinPercentage(wins, losses, ties),
      avgMargin: calculateAvgMargin(pointDiff, totalGames),
      avgMarginValue,
      ppg: perGame(pointsFor, totalGames),
      oppPpg: perGame(pointsAgainst, totalGames),
      yardsPerGame: perGame(passYards + rushYards, totalGames),
      passYardsPerGame: perGame(passYards, totalGames),
      rushYardsPerGame: perGame(rushYards, totalGames),
      passRushRatio,
      thirdDownPct: formatThirdDownPct(
        teamStats?.thirdDownConversions ?? 0,
        teamStats?.thirdDownAttempts ?? 0
      ),
      takeaways,
      giveaways,
      turnoverDiff,
      pointsFor,
      pointsAgainst,
    };
  }, [stats, teamStats, bearsStanding]);

  // Determine if we show streak or playoff status (only on Card 4)
  const showPlayoffStatus = currentWeek >= PLAYOFF_STATUS_WEEK_THRESHOLD;

  // Combined loading state
  const isLoading = loading || standingsLoading || gameLoading || teamStatsLoading || scheduleLoading;

  // Get next game subtext for Card 1
  const nextGameSubtext = getNextGameSubtext(scheduleData, calculations.totalGames);

  // ====== LOADING STATE ======
  if (isLoading && !stats && !bearsStanding) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          2025 Season Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <OverviewStatCard
              key={i}
              title=""
              primaryStats={[]}
              loading={true}
            />
          ))}
        </div>
      </div>
    );
  }

  // ====== NO DATA STATE ======
  if (!stats && !bearsStanding) {
    return (
      <div className="bg-white dark:bg-slate-800/40 border border-gray-200 dark:border-slate-700/50 rounded-lg p-6 text-center">
        <p className="text-gray-600 dark:text-slate-300">
          Season stats currently unavailable
        </p>
      </div>
    );
  }

  // ====== PREPARE CARD DATA ======
  
  // Get record from best available source
  const record = stats?.record ?? 
    `${bearsStanding?.wins ?? 0}-${bearsStanding?.losses ?? 0}${bearsStanding?.ties ? `-${bearsStanding.ties}` : ''}`;
  
  // Last game info
  const lastGameInfo = formatLastGame(gameData);
  
  // FIXED: Use Home/Away if Div/Conf are unavailable (showing 0-0)
  const divisionRecord = bearsStanding?.divisionRecord;
  const conferenceRecord = bearsStanding?.conferenceRecord;
  const homeRecord = bearsStanding?.homeRecord;
  const awayRecord = bearsStanding?.awayRecord;
  
  // Determine which secondary stats to show on Card 1
  // Prefer Div/Conf if valid, otherwise show Home/Away
  const useHomAwaySplit = !isValidRecord(divisionRecord) || !isValidRecord(conferenceRecord);

  // ====== RENDER ======
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        2025 Overview
      </h2>

      {/* Main Stats Grid - 4 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* ====== CARD 1: Season Snapshot ====== */}
        <OverviewStatCard
          title="Season Snapshot"
          badge={bearsStanding ? {
            text: `${bearsStanding.divisionRank}${getOrdinalSuffix(bearsStanding.divisionRank)} NFC North`,
            color: bearsStanding.divisionRank === 1 ? 'orange' : 'gray',
          } : undefined}
          variant="highlight"
          primaryStats={[
            {
              label: 'Record',
              value: record,
              highlight: 'orange',
              subtext: nextGameSubtext || undefined,
            },
          ]}
          secondaryStats={
            useHomAwaySplit
              ? [
                  { label: 'Home', value: isValidRecord(homeRecord) ? homeRecord! : '—' },
                  { label: 'Away', value: isValidRecord(awayRecord) ? awayRecord! : '—' },
                ]
              : [
                  { label: 'Win %', value: calculations.winPct },
                  { label: 'Div', value: divisionRecord! },
                ]
          }
          footerItems={[
            { 
              label: 'Last', 
              value: lastGameInfo.text, 
              icon: lastGameInfo.icon 
            },
            useHomAwaySplit
              ? { label: 'Win %', value: calculations.winPct }
              : { label: 'Conf', value: conferenceRecord! },
          ]}
        />

        {/* ====== CARD 2: Offense Overview ====== */}
        <OverviewStatCard
          title="Offense"
          badge={{ text: 'Production', color: 'blue' }}
          primaryStats={[
            {
              label: 'Points per game',
              value: calculations.ppg,
              subtext: `${calculations.yardsPerGame} yards/game`,
            },
          ]}
          secondaryStats={[
            { label: 'Pass', value: `${calculations.passYardsPerGame}` },
            { label: 'Rush', value: `${calculations.rushYardsPerGame}` },
          ]}
          footerItems={[
            { label: '3rd Down', value: calculations.thirdDownPct },
            { label: 'Scored', value: `${calculations.pointsFor} pts` },
          ]}
        />

        {/* ====== CARD 3: Defense & Discipline ====== */}
        <OverviewStatCard
          title="Defense"
          badge={{ text: 'Resistance', color: 'orange' }}
          primaryStats={[
            {
              label: 'Opp PPG',
              value: calculations.oppPpg,
              highlight: parseFloat(calculations.oppPpg) < 21 ? 'green' : 
                        parseFloat(calculations.oppPpg) > 27 ? 'red' : undefined,
              subtext: `${calculations.pointsAgainst} total allowed`,
            },
          ]}
          secondaryStats={[
            { label: 'Takeaways', value: calculations.takeaways.toString() },
            { 
              label: 'TO Diff', 
              value: calculations.turnoverDiff >= 0 
                ? `+${calculations.turnoverDiff}` 
                : `${calculations.turnoverDiff}`,
              highlight: calculations.turnoverDiff > 0 ? 'green' : 
                        calculations.turnoverDiff < 0 ? 'red' : undefined,
            },
          ]}
          footerItems={[
            { label: 'Giveaways', value: calculations.giveaways.toString() },
            { 
              label: 'Turn over Battle', 
              value: calculations.turnoverDiff >= 0 ? 'Winning' : 'Losing'
            },
          ]}
        />

        {/* ====== CARD 4: Season Identity ====== */}
        <OverviewStatCard
          title="Identity"
          badge={{ text: 'Style', color: 'gray' }}
          primaryStats={[
            {
              label: 'Pass/Rush',
              value: calculations.passRushRatio.display,
              subtext: calculations.passRushRatio.passPercent > 55 
                ? 'Pass-heavy offense' 
                : calculations.passRushRatio.rushPercent > 55 
                  ? 'Run-heavy offense'
                  : 'Balanced attack',
            },
          ]}
          secondaryStats={[
            { 
              label: 'Avg Margin', 
              value: calculations.avgMargin,
              highlight: calculations.avgMarginValue > 0 ? 'green' : 
                        calculations.avgMarginValue < 0 ? 'red' : undefined,
            },
            { label: 'Games', value: calculations.totalGames.toString() },
          ]}
          footerItems={
            showPlayoffStatus && bearsStanding
              ? [
                  {
                    label: 'Status',
                    value: getPlayoffDisplay(bearsStanding.playoffStatus, bearsStanding.conferenceRank).text,
                    icon: getPlayoffDisplay(bearsStanding.playoffStatus, bearsStanding.conferenceRank).icon,
                  },
                  {
                    label: 'NFC Rank',
                    value: `${bearsStanding.conferenceRank}${getOrdinalSuffix(bearsStanding.conferenceRank)}`,
                  },
                ]
              : bearsStanding
                ? [
                    {
                      label: 'Streak',
                      value: bearsStanding.streak,
                      icon: getStreakIcon(bearsStanding.streakType),
                    },
                    {
                      label: 'Trend',
                      value: getMarginDescription(calculations.avgMarginValue),
                    },
                  ]
                : [
                    { label: 'Streak', value: '—' },
                    { label: 'Trend', value: '—' },
                  ]
          }
        />
      </div>

      {/* Data Source Info */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-500 px-1">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{
              backgroundColor:
                (stats?.source ?? 'fallback') === 'live'
                  ? '#10b981'
                  : (stats?.source ?? 'fallback') === 'cache'
                    ? '#eab308'
                    : '#ef4444',
            }}
          />
          <span>
            Data: <strong>{stats?.source ?? 'standings'}</strong>
          </span>
        </div>
        <span>Week {currentWeek} • Updated: {stats?.lastUpdated ?? 'Now'}</span>
      </div>
    </div>
  );
}