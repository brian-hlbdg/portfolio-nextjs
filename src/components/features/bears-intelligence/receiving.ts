import type { Zone } from './data';
export interface ReceivingProfile {
  gsisId:string;espnId:string|null;name:string;targets:number;receptions:number;yards:number;touchdowns:number;firstDowns:number;
  yac:number|null;yacReceptions:number;adot:number|null;explosive20:number;
  weeks:{week:number;targets:number;receptions:number;yards:number}[];
  zones:(Zone & {yards:number})[];
  connections:{id:string;name:string;targets:number;receptions:number;yards:number;touchdowns:number}[];
}
export function receivingStats(p:ReceivingProfile):string[][]{
  return [['REC YDS',p.yards.toLocaleString()],['REC TD',String(p.touchdowns)],['CATCH %',p.targets?(100*p.receptions/p.targets).toFixed(1)+'%':'—'],['YDS / REC',p.receptions?(p.yards/p.receptions).toFixed(1):'—']];
}
const sampleRows=[[3,1,24],[4,2,48],[5,2,55],[7,4,56],[12,8,105],[10,6,82],[9,7,67],[13,10,95],[8,6,58],[3,2,12],[4,3,17],[2,1,4]];
const sampleZones=sampleRows.map(([attempts,completions,yards],i)=>({id:Math.floor(i/3)+'-'+i%3,depth:['20+','10–19','0–9','Behind LOS'][Math.floor(i/3)],direction:(['Left','Middle','Right'] as const)[i%3],attempts,completions,yards,epa:null,benchmark:null}));
export const sampleReceiving:ReceivingProfile={
  gsisId:'sample-receiver',espnId:null,name:'Sample receiver',targets:sampleRows.reduce((a,v)=>a+v[0],0),receptions:sampleRows.reduce((a,v)=>a+v[1],0),yards:sampleRows.reduce((a,v)=>a+v[2],0),touchdowns:5,firstDowns:34,yac:230,yacReceptions:52,adot:11.3,explosive20:9,
  zones:sampleZones,
  weeks:[{week:1,targets:9,receptions:6,yards:80},{week:2,targets:12,receptions:8,yards:94},{week:3,targets:10,receptions:7,yards:83},{week:4,targets:14,receptions:9,yards:117},{week:5,targets:11,receptions:7,yards:89},{week:6,targets:14,receptions:9,yards:106},{week:7,targets:10,receptions:6,yards:54}],
  connections:[{id:'sample-qb',name:'Caleb Williams (sample)',targets:80,receptions:52,yards:623,touchdowns:5}]
};
