export type IntelligenceView='Team'|'Player'|'Game'|'Matchup';
export type NavigationState={view:IntelligenceView;season:number;player?:string;game?:string;opponent?:string};
const views:Record<string,IntelligenceView>={team:'Team',player:'Player',game:'Game',matchup:'Matchup'};
const identifier=(value:string|null)=>value&&/^[A-Za-z0-9:_-]{1,100}$/.test(value)?value:undefined;
export function readNavigation(search:string,defaultSeason:number):NavigationState{
 const p=new URLSearchParams(search);
 const key=(p.get('view')??'').toLowerCase();
 const view=Object.prototype.hasOwnProperty.call(views,key)?views[key]:undefined;
 const season=Number(p.get('season'));
 return {view:view??'Team',season:[2024,2025,2026].includes(season)?season:defaultSeason,player:identifier(p.get('player')),game:identifier(p.get('game')),opponent:identifier(p.get('opponent'))};
}
export function navigationUrl(href:string,state:NavigationState):URL{
 const url=new URL(href);
 url.searchParams.set('view',state.view.toLowerCase());
 url.searchParams.set('season',String(state.season));
 for(const key of ['player','game','opponent'] as const){const value=state[key];if(value)url.searchParams.set(key,value);else url.searchParams.delete(key);}
 return url;
}
