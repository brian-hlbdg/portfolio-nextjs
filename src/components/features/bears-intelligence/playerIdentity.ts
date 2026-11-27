import {starterProfile,starterRosterSource} from './starterProfiles';
export interface PlayerSeasonProfile {
 heightInches?:number|null;
 weightLbs?:number|null;
 birthDate?:string|null;
 college?:string|null;
 yearsExperience?:number|null;
}
const rosterSource='https://nflreadr.nflverse.com/articles/dictionary_rosters.html';
export type IdentityFact={label:string;value:string;source:string};
const ordinal=(n:number)=>n+((n%100>=11&&n%100<=13)?'th':n%10===1?'st':n%10===2?'nd':n%10===3?'rd':'th');
export function playerIdentity(id:string,season:number,profile?:PlayerSeasonProfile):IdentityFact[]{
 const facts:IdentityFact[]=[];
 const official=starterProfile(id,season);
 const height=profile?.heightInches??official?.heightInches;
 const weight=profile?.weightLbs??official?.weightLbs;
 const college=profile?.college??official?.college;
 if(height&&Number.isInteger(height)&&height>=48&&height<=96)facts.push({label:'Height',value:Math.floor(height/12)+"′ "+height%12+"″",source:profile?.heightInches?rosterSource:starterRosterSource});
 if(weight&&Number.isInteger(weight)&&weight>=100&&weight<=500)facts.push({label:'Weight',value:weight+' lbs',source:profile?.weightLbs?rosterSource:starterRosterSource});
 if(college&&college!=='NA')facts.push({label:'College',value:college,source:profile?.college?rosterSource:starterRosterSource});
 if(official){
   facts.push({label:'Experience',value:official.listedExperience===0?'Rookie':ordinal(official.listedExperience)+' season',source:starterRosterSource});
 }else if(typeof profile?.yearsExperience==='number'&&Number.isInteger(profile.yearsExperience)&&profile.yearsExperience>=0&&profile.yearsExperience<=30){
   const years=profile.yearsExperience;
   facts.push({label:'Experience',value:years===0?'Rookie':years+' '+(years===1?'yr':'yrs'),source:rosterSource});
 }
 return facts;
}
export function playerNickname(id:string):IdentityFact|undefined{
 const key=id.replace(/^gsis:/,'');
 if(['00-0039918','4431611'].includes(key))return {label:'Nickname',value:'The Iceman',source:'https://www.pro-football-reference.com/players/W/WillCa03.htm'};
 if(['00-0038111','4361093'].includes(key))return {label:'Nickname',value:'Spider-Man',source:'https://www.chicagobears.com/news/kyler-gordon-displaying-spidey-senses-in-secondary-jaylon-johnson-defense'};
 return undefined;
}
