import { zones, downs, weeks, type Zone, type Player } from './data';
export interface WeeklyRating { week: number; rating: number }
export interface ConversionBucket { distance: string; made: number; total: number; league: number }
export interface AnalyticsSnapshot {
  source: 'fixture' | 'espn' | 'nflverse';
  season: number | null;
  updatedAt: string | null;
  playerId: string;
  passing: readonly Zone[] | null;
  weeklyRatings: readonly WeeklyRating[] | null;
  leagueRating: number | null;
  thirdDown: readonly ConversionBucket[] | null;
}
export interface AnalyticsProvider {
  getSnapshot(player: Player, season?: number): Promise<AnalyticsSnapshot>;
}
export function fixtureSnapshot(player: Player): AnalyticsSnapshot {
  return {
    source: 'fixture', season: null, updatedAt: null, playerId: player.id,
    passing: player.position === 'QB' ? zones : null,
    weeklyRatings: player.position === 'QB' ? weeks.map((rating,i)=>({week:i+1,rating})) : null,
    leagueRating: player.position === 'QB' ? 88 : null,
    thirdDown: downs,
  };
}
export const fixtureProvider: AnalyticsProvider = {
  async getSnapshot(player) { return fixtureSnapshot(player); },
};
export function percentage(numerator:number, denominator:number):number|null {
  return denominator > 0 ? numerator / denominator * 100 : null;
}
export function signed(value:number, digits=1):string {
  return (value > 0 ? '+' : '') + value.toFixed(digits);
}
export function passingInsight(rows: readonly Zone[]): string {
  const eligible=rows.filter(r=>r.attempts>=10);
  if (!eligible.length) return 'Not enough attempts for a territory comparison.';
  const best=eligible.reduce((a,b)=>b.completions/b.attempts-b.benchmark>a.completions/a.attempts-a.benchmark?b:a);
  const delta=(best.completions/best.attempts-best.benchmark)*100;
  return delta>0 ? 'Largest completion-rate advantage: '+best.depth+' · '+best.direction+' ('+signed(delta)+' pp vs reference; '+best.attempts+' attempts).' : 'No eligible territory exceeds its completion-rate benchmark.';
}
export function conversionInsight(rows: readonly ConversionBucket[]):string {
  const eligible=rows.filter(r=>r.total>0);
  const above=eligible.filter(r=>r.made/r.total>r.league).length;
  return eligible.length ? 'Chicago exceeds its distance-specific reference in '+above+' of '+eligible.length+' categories.' : 'No qualifying third-down attempts.';
}
