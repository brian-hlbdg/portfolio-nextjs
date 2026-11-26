export interface TeamSplit {
 plays:number;passShare:number|null;yardsPerPlay:number|null;epa:number|null;success:number|null;explosive:number|null;thirdDown:number|null;turnovers:number;sacks:number;touchdowns:number;epaCount:number;
}
export type TeamMetric='epa'|'success'|'yardsPerPlay'|'explosive'|'thirdDown';
export type TeamRanks=Record<TeamMetric,{rank:number;count:number}|null>;
export interface TeamIdentityData {
 offense:TeamSplit;defense:TeamSplit;league:TeamSplit;offenseRanks:TeamRanks;defenseRanks:TeamRanks;
 weeks:{week:number;offense:TeamSplit;defense:TeamSplit}[];
 downs:{down:number;offense:TeamSplit;defense:TeamSplit;league:TeamSplit}[];
}
export const teamMetrics:TeamMetric[]=['epa','success','yardsPerPlay','explosive','thirdDown'];
export const teamLabels:Record<TeamMetric,string>={epa:'EPA / play',success:'Success rate',yardsPerPlay:'Yards / play',explosive:'Explosive rate',thirdDown:'Third-down conversion'};
export function teamValue(v:number|null,m:TeamMetric){return v===null?'—':m==='epa'?v.toFixed(2):m==='yardsPerPlay'?v.toFixed(1):(v*100).toFixed(1)+'%'}
