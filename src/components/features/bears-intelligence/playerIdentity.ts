export interface PlayerSeasonProfile {
 heightInches?:number|null;
 weightLbs?:number|null;
 birthDate?:string|null;
 college?:string|null;
}
const rosterSource='https://nflreadr.nflverse.com/articles/dictionary_rosters.html';
const calebSource='https://www.chicagobears.com/team/players-roster/caleb-williams/';
const nicknameSource='https://www.pro-football-reference.com/players/W/WillCa03.htm';
export type IdentityFact={label:string;value:string;source:string};
export function playerIdentity(id:string,season:number,profile?:PlayerSeasonProfile):IdentityFact[]{
 const facts:IdentityFact[]=[];
 const caleb=id==='00-0039918'||id==='4431611'||id==='gsis:00-0039918';
 const fallback=caleb&&season===2026;
 const height=profile?.heightInches??(fallback?73:undefined);
 const weight=profile?.weightLbs??(fallback?226:undefined);
 const college=profile?.college??(fallback?'USC':undefined);
 if(height&&Number.isInteger(height)&&height>=48&&height<=96)facts.push({label:'Height',value:Math.floor(height/12)+"′ "+height%12+"″",source:profile?.heightInches?rosterSource:calebSource});
 if(weight&&Number.isInteger(weight)&&weight>=100&&weight<=500)facts.push({label:'Weight',value:weight+' lbs',source:profile?.weightLbs?rosterSource:calebSource});
 const birth=profile?.birthDate;
 if(birth&&/^\d{4}-\d{2}-\d{2}$/.test(birth)){
   const [year,month,day]=birth.split('-').map(Number);
   const age=season-year-(month>9||(month===9&&day>1)?1:0);
   if(age>=18&&age<=65)facts.push({label:'Age · Sep 1',value:String(age),source:rosterSource});
 }
 if(college&&college!=='NA')facts.push({label:'College',value:college,source:profile?.college?rosterSource:calebSource});
 if(fallback)facts.push({label:'Nickname',value:'Iceman',source:nicknameSource});
 return facts;
}
