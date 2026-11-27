import type { PlayerSeasonProfile } from './playerIdentity';
import type { MatchupTeam } from './matchupData';
import type { BearsGame } from './gameData';
import type { TeamIdentityData } from './teamIdentity';
import type { DefenseData } from './defense';
import type { RedZoneData } from './redzone';
import type { ReceivingProfile } from './receiving';
import type { RushingProfile } from './rushing';
import type { Player, Zone } from './data';
import type { AnalyticsSnapshot, ConversionBucket, WeeklyRating } from './analytics';

export interface SeasonFile {
  season: number; source: 'nflverse'; retrievedAt: string; sourceModified: string|null;
  leagueRating: number|null; thirdDown: ConversionBucket[];
  roster?: {gsisId:string;espnId:string|null;name:string;number:number|null;position:string;profile?:PlayerSeasonProfile;depth?:{rank:number;position:string|null;group:string|null}|null}[];
  depthChart?:{source:string;asOf:string}|null;
  qualifiedPassers?:number;
  rushing?:RushingProfile[];
  receiving?:ReceivingProfile[];
  redzone?:RedZoneData;
  defense?:DefenseData;
  teamIdentity?:TeamIdentityData;
  games?:BearsGame[];
  matchupTeams?:MatchupTeam[];
  players: {gsisId:string; espnId:string|null; name:string; stats:string[][]; ranks?:{label:string;value:string;rank:number}[]; weeklyRatings:WeeklyRating[]; passing: (Omit<Zone,'epa'|'benchmark'> & {epa:number|null;benchmark:number|null})[]}[];
}
export async function loadSeason(season:number, signal:AbortSignal):Promise<SeasonFile>{
  const response=await fetch('/data/bears-intelligence/'+season+'.json',{signal,cache:'no-cache'});
  if(!response.ok) throw new Error('Season dataset is not available. Generate it using the documented script.');
  const data=await response.json() as SeasonFile;
  if(data.source!=='nflverse'||data.season!==season||!Array.isArray(data.players)||!Array.isArray(data.thirdDown))throw new Error('Invalid season dataset');
  return data;
}
export function liveSnapshot(file:SeasonFile,player:Player):{snapshot:AnalyticsSnapshot;player:Player}{
  const match=file.players.find(p=>p.espnId===player.id||'gsis:'+p.gsisId===player.id);
  const passing=match?.passing;
  return {player:{...player,stats:match?.stats??[]},snapshot:{
    source:'nflverse',season:file.season,updatedAt:file.sourceModified,playerId:player.id,
    passing:passing?.length?passing:null,weeklyRatings:match?.weeklyRatings??null,
    leagueRating:file.leagueRating,thirdDown:file.thirdDown
  }};
}
