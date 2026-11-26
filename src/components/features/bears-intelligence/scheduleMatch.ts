import type {ScheduleGame} from '@/hooks/useTeamSchedule';
import type {BearsGame} from './gameData';
export function normalizeTeam(id:string|undefined){const key=id?.trim().toUpperCase();return key==='LAR'?'LA':key==='WSH'?'WAS':key==='JAC'?'JAX':key;}
export function matchScheduleGame(game:ScheduleGame, recorded:readonly BearsGame[]):BearsGame|undefined{
 if(game.gameType!=='regular'||!game.kickoff||!game.opponentAbbreviation)return undefined;
 const kickoff=new Date(game.kickoff);
 if(!Number.isFinite(kickoff.getTime()))return undefined;
 const date=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(kickoff);
 const part=(type:string)=>date.find(p=>p.type===type)?.value;
 const key=part('year')+'-'+part('month')+'-'+part('day');
 const opponent=normalizeTeam(game.opponentAbbreviation);
 const matches=recorded.filter(g=>g.date===key&&(game.homeAway==='home'?g.home==='CHI'&&normalizeTeam(g.away)===opponent:g.away==='CHI'&&normalizeTeam(g.home)===opponent));
 return matches.length===1?matches[0]:undefined;
}
