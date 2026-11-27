export interface PlayerSeasonProfile {
 heightInches?:number|null;
 weightLbs?:number|null;
 birthDate?:string|null;
 college?:string|null;
 yearsExperience?:number|null;
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
 if(college&&college!=='NA')facts.push({label:'College',value:college,source:profile?.college?rosterSource:calebSource});
 const experience=profile?.yearsExperience;
 if(caleb&&season>=2024&&season<=2026){
   facts.push({label:'Experience',value:season===2024?'Rookie':season===2025?'2nd season':'3rd season',source:calebSource});
 }else if(typeof experience==='number'&&Number.isInteger(experience)&&experience>=0&&experience<=30){
   facts.push({label:'Experience',value:experience===0?'Rookie':experience+' '+(experience===1?'yr':'yrs'),source:rosterSource});
 }
 return facts;
}

export function playerNickname(id:string):IdentityFact|undefined{
 return ['00-0039918','4431611','gsis:00-0039918'].includes(id)?{label:'Nickname',value:'The Iceman',source:nicknameSource}:undefined;
}
