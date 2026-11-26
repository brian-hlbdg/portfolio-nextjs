import type {Zone} from './data';
export type DefenseMetric='solo'|'assists'|'tfl'|'hits'|'passesDefended'|'interceptions'|'forcedFumbles'|'recoveries'|'sacks';
export type DefenseEvents=Partial<Record<DefenseMetric,number>>;
export interface Defender {gsisId:string;espnId:string|null;totals:DefenseEvents;weeks:{week:number;events:DefenseEvents}[]}
export interface Allowed {attempts:number;completions:number;yards:number;epa:number|null}
export interface DefenseData {available:DefenseMetric[];players:Defender[];passingAllowed:(Zone&{yards:number})[];rushingAllowed:{id:string;team:Allowed;league:Allowed}[]}
export const defenseLabels:Record<DefenseMetric,string>={solo:'Solo tackles',assists:'Assisted tackles',tfl:'Tackles for loss',hits:'Non-sack QB hits',passesDefended:'Passes defended',interceptions:'Interceptions',forcedFumbles:'Forced fumbles',recoveries:'Fumble recoveries',sacks:'Sacks'};
export function defensePosition(position:string){return ['DE','DT','DL','NT','EDGE','LB','ILB','OLB','MLB','CB','DB','S','FS','SS','SAF'].includes(position.toUpperCase())}
export function defensiveMetrics(position:string):DefenseMetric[]{
 const p=position.toUpperCase();
 if(['CB','DB','S','FS','SS','SAF'].includes(p))return ['interceptions','passesDefended','solo','forcedFumbles'];
 if(['LB','ILB','OLB','MLB'].includes(p))return ['solo','assists','tfl','sacks'];
 return ['sacks','hits','tfl','solo'];
}
export function defenseStats(d:Defender|undefined,position:string):string[][]{return defensiveMetrics(position).map(k=>[defenseLabels[k].toUpperCase(),d?.totals[k]===undefined?'—':String(d.totals[k])])}
