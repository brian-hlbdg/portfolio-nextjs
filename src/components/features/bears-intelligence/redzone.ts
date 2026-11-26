export interface RedZoneSplit {
  pass:number; rush:number; passTd:number; rushTd:number; epa:number|null; tdRate:number|null;
}
export interface RedZonePlayerBand {
  id:string; passAttempts:number;passTd:number;carries:number;rushTd:number;targets:number;receptions:number;recTd:number;
}
export interface RedZoneData {
  bands:{id:string;team:RedZoneSplit;league:RedZoneSplit}[];
  drives:{team:number;teamTd:number;league:number;leagueTd:number};
  players:{gsisId:string;espnId:string|null;bands:RedZonePlayerBand[]}[];
}
const split=(pass:number,rush:number,passTd:number,rushTd:number,epa:number):RedZoneSplit=>({pass,rush,passTd,rushTd,epa,tdRate:(passTd+rushTd)/(pass+rush)});
export const sampleRedZone:RedZoneData={
 bands:[
 {id:'16-20',team:split(25,14,3,1,.12),league:split(250,190,24,10,.04)},
 {id:'11-15',team:split(22,16,4,2,.15),league:split(230,195,32,18,.08)},
 {id:'6-10',team:split(19,21,5,5,.22),league:split(200,240,44,43,.14)},
 {id:'1-5',team:split(14,28,6,14,.31),league:split(160,310,65,132,.25)}
 ],
 drives:{team:48,teamTd:40,league:590,leagueTd:368},
 players:[
 {gsisId:'sample-qb',espnId:'4431611',bands:[25,22,19,14].map((passAttempts,i)=>({id:['16-20','11-15','6-10','1-5'][i],passAttempts,passTd:[3,4,5,6][i],carries:[1,2,2,4][i],rushTd:[0,0,1,2][i],targets:0,receptions:0,recTd:0}))},
 {gsisId:'sample-rb',espnId:'4259545',bands:[10,12,15,19].map((carries,i)=>({id:['16-20','11-15','6-10','1-5'][i],passAttempts:0,passTd:0,carries,rushTd:[1,2,3,8][i],targets:[3,3,2,2][i],receptions:[2,2,1,1][i],recTd:[0,1,0,1][i]}))},
 {gsisId:'sample-wr',espnId:'4431299',bands:[7,6,5,4].map((targets,i)=>({id:['16-20','11-15','6-10','1-5'][i],passAttempts:0,passTd:0,carries:0,rushTd:0,targets,receptions:[4,4,3,3][i],recTd:[1,1,2,2][i]}))}
 ]
};
