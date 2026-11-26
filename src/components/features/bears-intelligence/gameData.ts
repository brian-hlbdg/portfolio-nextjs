export interface GamePlay {
 id:number;quarter:number|null;clock:string|null;down:number|null;distance:number|null;
 start:number|null;end:number|null;yards:number|null;kind:string;epa:number|null;description:string;td:boolean;turnover:boolean;
}
export interface GameDrive {
 id:string;team:string;result:string|null;plays:GamePlay[];start:number|null;snapCount:number;netYards:number;epa:number|null;epaCount:number;
}
export interface BearsGame {
 id:string;week:number;home:string;away:string;date:string|null;homeScore:number|null;awayScore:number|null;final:boolean;drives:GameDrive[];
}
export function fieldPosition(y:number|null){
 if(y===null)return '—';
 if(y===0)return 'Goal line';
 if(y===50)return '50';
 if(y===100)return 'Own goal line';
 return y>50?'Own '+(100-y):'Opp '+y;
}
export function driveOutcome(d:GameDrive){
 if(d.result)return d.result;
 if(d.plays.some(p=>p.td))return 'Touchdown';
 if(d.plays.some(p=>p.turnover))return 'Turnover';
 return d.plays[d.plays.length-1]?.kind.replaceAll('_',' ')??'Unknown';
}
