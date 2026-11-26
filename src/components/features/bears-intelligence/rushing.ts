export interface RushLane {
  id:string; attempts:number; yards:number; touchdowns:number; explosive10:number;
  epa:number|null; leagueYpc:number|null;
}
export interface RushingProfile {
  gsisId:string; espnId:string|null; name:string;
  attempts:number; yards:number; touchdowns:number; explosive10:number; explosive20:number;
  successRate:number|null; epa:number|null;
  weeks:{week:number;attempts:number;yards:number}[];
  lanes:RushLane[];
}
export const laneLabels:Record<string,string>={
  left_end:'Left edge',left_tackle:'Left tackle',left_guard:'Left guard',middle:'Middle',
  right_guard:'Right guard',right_tackle:'Right tackle',right_end:'Right edge',unknown:'Unclassified'
};
export const sampleRushing:RushingProfile={
  gsisId:'sample',espnId:null,name:'Sample running back',attempts:167,yards:802,touchdowns:6,
  explosive10:23,explosive20:5,successRate:.48,epa:.04,
  weeks:[42,68,83,31,94,76,49,105,62,48,79,65].map((yards,i)=>({week:i+1,yards,attempts:[10,14,17,9,18,15,12,19,13,11,16,13][i]})),
  lanes:[
    ['left_end',22,128,1,4,.15,4.8],['left_tackle',25,105,0,3,-.05,4.2],
    ['left_guard',24,94,1,2,-.08,4.3],['middle',25,70,1,1,-.18,3.8],
    ['right_guard',24,110,1,3,.07,4.4],['right_tackle',22,123,1,5,.16,4.5],
    ['right_end',25,172,1,5,.25,5.1],['unknown',0,0,0,0,null,null]
  ].map(([id,attempts,yards,touchdowns,explosive10,epa,leagueYpc])=>({id,attempts,yards,touchdowns,explosive10,epa,leagueYpc} as RushLane))
};
export function rushStats(p:RushingProfile):string[][]{
  return [['RUSH YDS',p.yards.toLocaleString()],['RUSH TD',String(p.touchdowns)],
    ['YDS / CARRY',p.attempts?(p.yards/p.attempts).toFixed(1):'—'],
    ['SUCCESS %',p.successRate===null?'—':(p.successRate*100).toFixed(1)+'%']];
}
