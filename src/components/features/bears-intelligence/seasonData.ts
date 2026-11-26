import type { Player, Zone } from './data';
import type { AnalyticsSnapshot, ConversionBucket, WeeklyRating } from './analytics';

export interface SeasonFile {
  season: number; source: 'nflverse'; retrievedAt: string; sourceModified: string|null;
  leagueRating: number|null; thirdDown: ConversionBucket[];
  players: {gsisId:string; espnId:string|null; name:string; stats:string[][]; weeklyRatings:WeeklyRating[]; passing: (Omit<Zone,'epa'|'benchmark'> & {epa:number|null;benchmark:number|null})[]}[];
}
export async function loadSeason(season:number, signal:AbortSignal):Promise<SeasonFile>{
  const response=await fetch('/data/bears-intelligence/'+season+'.json',{signal,cache:'no-cache'});
  if(!response.ok) throw new Error('Season dataset is not available. Generate it using the documented script.');
  const data=await response.json() as SeasonFile;
  if(data.source!=='nflverse'||data.season!==season||!Array.isArray(data.players)||!Array.isArray(data.thirdDown))throw new Error('Invalid season dataset');
  return data;
}
export function liveSnapshot(file:SeasonFile,player:Player):{snapshot:AnalyticsSnapshot;player:Player}{
  const match=file.players.find(p=>p.espnId===player.id);
  // Existing chart contract requires finite benchmark and EPA. Leave unsupported zones unavailable rather than invent values.
  const passing=match?.passing;
  const complete=passing?.length===12&&passing.every(z=>z.attempts>0&&z.epa!==null&&z.benchmark!==null);
  return {player:{...player,stats:match?.stats??[]},snapshot:{
    source:'nflverse',season:file.season,updatedAt:file.sourceModified,playerId:player.id,
    passing:complete?passing as Zone[]:null,weeklyRatings:match?.weeklyRatings??null,
    leagueRating:file.leagueRating,thirdDown:file.thirdDown
  }};
}
