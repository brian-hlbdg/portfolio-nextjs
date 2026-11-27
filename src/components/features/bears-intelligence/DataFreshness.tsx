'use client';
import {useTeamSchedule} from '@/hooks/useTeamSchedule';
import {matchScheduleGame} from './scheduleMatch';
import type {SeasonFile} from './seasonData';

const timestamp=(value:string|null|undefined)=>{
 const date=value?new Date(value):null;
 return date&&Number.isFinite(date.getTime())?new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(date):'Unavailable';
};
export default function DataFreshness({season,file,datasetError,onRefresh}:{season:number;file:SeasonFile|null;datasetError:string|null;onRefresh:()=>void}){
 const {scheduleData,loading,error,refetch}=useTeamSchedule('bears',2,season);
 const games=file?.season===season?file.games??[]:[];
 const completed=(scheduleData?.games??[]).filter(g=>g.gameType==='regular'&&g.status==='final').sort((a,b)=>(a.kickoff??'').localeCompare(b.kickoff??''));
 const latest=completed.at(-1);
 const recorded=[...games].filter(g=>g.final&&g.drives?.length).sort((a,b)=>a.week-b.week||(a.date??'').localeCompare(b.date??'')).at(-1);
 const missing=completed.filter(g=>{const match=matchScheduleGame(g,games);return !match?.final||!match.drives.length});
 const verified=!loading&&!error&&!!latest&&!!file&&file.season===season&&!datasetError;
 const state=verified?(missing.length?'waiting':'current'):'unknown';
 return <section className="bi-freshness" aria-label="Analytics data coverage">
 <div className="bi-freshness-heading"><span className={'bi-freshness-status '+state} role="status"><span aria-hidden="true"/>{state==='current'?'Up to date':state==='waiting'?'Awaiting game data':loading?'Checking coverage…':'Unable to verify'}</span><button type="button" onClick={()=>{void refetch();onRefresh()}}>Check for updates</button></div>
 <dl><div><dt>Latest completed game · ESPN</dt><dd>{loading?'Checking…':error?'Unavailable':latest?latest.opponent+' · '+timestamp(latest.kickoff):'No completed games returned'}</dd></div><div><dt>Analytics through · nflverse</dt><dd>{recorded?'Week '+recorded.week+' · '+recorded.away+' at '+recorded.home+' · '+(recorded.date??'Date unavailable'):'No completed game data'}</dd></div><div><dt>Dataset generated</dt><dd>{timestamp(file?.retrievedAt)}</dd></div></dl>
 <p>{state==='waiting'?missing.length+' completed regular-season game'+(missing.length===1?' is':'s are')+' missing or not marked complete in the published analytics.':state==='current'?'All completed regular-season games returned by ESPN have matching completed drive records.':'Coverage cannot be confirmed until both sources are available.'} Dataset time is the last published snapshot, not the last scheduled refresh attempt.</p>
 </section>
}
