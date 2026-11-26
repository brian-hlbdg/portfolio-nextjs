export type Metric = 'completion' | 'attempts' | 'epa';
export type Zone = { id: string; direction: 'Left'|'Middle'|'Right'; depth: string; attempts: number; completions: number; epa: number|null; benchmark: number|null };
const rows = [[7,14,5,12,9,19],[15,24,25,32,17,26],[41,50,55,64,39,49],[18,20,16,18,21,23]];
export const zones: Zone[] = rows.flatMap((r,i)=> (['Left','Middle','Right'] as const).map((direction,j)=>({id: i+'-'+j,direction,depth:['20+','10–19','0–9','Behind LOS'][i],completions:r[j*2],attempts:r[j*2+1],epa:[-.12,.21,-.08,.06,.34,.12,.08,.19,.04,-.03,.02,-.09][i*3+j],benchmark:[.38,.61,.76,.89][i]})));
export const downs = [{distance:'1',made:18,total:22,league:.73},{distance:'2–3',made:25,total:38,league:.59},{distance:'4–6',made:23,total:49,league:.45},{distance:'7–10',made:14,total:42,league:.32},{distance:'11+',made:4,total:24,league:.19}];
export const weeks = [72,85,62,94,79,56,89,96,67,83,76,92];
export const players = [{name:'Caleb Williams',number:18,position:'QB',id:'4431611',stats:[['PASS YDS','2,978'],['TD / INT','20 / 6'],['COMP %','67.4%'],['RATING','98.1']]},{name:"D’Andre Swift",number:4,position:'RB',id:'4259545',stats:[['RUSH YDS','802'],['TD','6'],['YPC','4.8'],['REC YDS','312']]},{name:'Rome Odunze',number:15,position:'WR',id:'4431299',stats:[['REC YDS','661'],['REC','54'],['TD','5'],['YPR','12.2']]}];
export type Player = typeof players[number];
export const rate = (z:Zone)=> z.attempts>0?z.completions/z.attempts:null;
