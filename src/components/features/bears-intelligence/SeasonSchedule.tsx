'use client';
import {useState} from 'react';
import {useTeamSchedule,type ScheduleGame} from '@/hooks/useTeamSchedule';
import {matchScheduleGame,normalizeTeam} from './scheduleMatch';
import type {BearsGame} from './gameData';
type Props={season:number;recorded:readonly BearsGame[];selectedId?:string|null;onGame:(id:string)=>void;onMatchup:(id:string)=>void};
export default function SeasonSchedule({season,recorded,selectedId,onGame,onMatchup}:Props){
 const {scheduleData,loading,error,refetch}=useTeamSchedule('bears',undefined,season);
 const [filter,setFilter]=useState<'all'|'regular'|'preseason'|'postseason'>('regular');
 const [status,setStatus]=useState<'all'|'final'|'scheduled'|'live'>('all');
 const games=(scheduleData?.games??[]).filter(g=>(filter==='all'||g.gameType===filter)&&(status==='all'||g.status===status)).sort((a,b)=>(a.kickoff??'').localeCompare(b.kickoff??''));
 const results=(scheduleData?.games??[]).filter(g=>g.gameType==='regular'&&g.status==='final'&&g.score);
 const wins=results.filter(g=>g.score!.team>g.score!.opponent).length;
 const losses=results.filter(g=>g.score!.team<g.score!.opponent).length;
 const ties=results.length-wins-losses;
 function card(g:ScheduleGame){
   const match=matchScheduleGame(g,recorded), opp=normalizeTeam(g.opponentAbbreviation);
   const outcome=g.status==='final'&&g.score?g.score.team>g.score.opponent?'W':g.score.team<g.score.opponent?'L':'T':null;
   return <article key={g.id} className={'bi-schedule-card'+(match&&selectedId===match.id?' selected':'')}>
    <div className="bi-schedule-meta"><small>{g.gameType??'Game'} · {g.homeAway==='home'?'Home':'Away'}</small><span className={outcome==='W'?'bi-pos':outcome==='L'?'bi-neg':''}>{outcome??(g.status==='final'?'Final':g.status==='live'?'In progress':'Upcoming')}</span></div>
    <div className="bi-schedule-opponent"><strong>{g.opponentAbbreviation??g.opponent}</strong><span>{g.opponent}</span></div>
    <div className="bi-schedule-score"><strong>{g.status==='final'&&g.score?g.score.team+' – '+g.score.opponent:g.date}</strong><small>{g.status==='final'?g.date:g.time}{g.broadcast?' · '+g.broadcast:''}</small></div>
    <p>{g.venue}</p>
    {match?<button type="button" aria-pressed={selectedId===match.id} onClick={()=>onGame(match.id)}>Explore drives</button>:g.status==='final'?<small>Drive data unavailable</small>:opp?<button type="button" onClick={()=>onMatchup(opp)}>Compare opponent</button>:<small>Opponent comparison unavailable</small>}
   </article>
 }
 return <section className="bi-panel bi-season-schedule"><header className="bi-heading"><div><small>SEASON SCHEDULE / ESPN · {season}</small><h2>The road ahead</h2><p>Schedule, results and available game analysis</p></div></header>
 {!loading&&!error&&results.length>0&&<div className="bi-highlight"><strong>{wins}-{losses}{ties?'-'+ties:''}</strong><span>Record from completed regular-season games · {results.length} played</span></div>}
 <div className="bi-schedule-filters"><div className="bi-controls" role="group" aria-label="Season phase">{(['all','regular','preseason','postseason'] as const).map(v=><button type="button" key={v} aria-pressed={filter===v} onClick={()=>setFilter(v)}>{v==='all'?'All phases':v==='regular'?'Regular season':v==='preseason'?'Preseason':'Postseason'}</button>)}</div><label>Game status <select value={status} onChange={e=>setStatus(e.target.value as typeof status)}><option value="all">All games</option><option value="final">Completed</option><option value="scheduled">Upcoming</option><option value="live">In progress</option></select></label></div>
 {loading?<p role="status">Loading schedule…</p>:error?<div role="alert"><p>ESPN schedule unavailable. Recorded game analysis remains accessible above.</p><button type="button" onClick={()=>void refetch()}>Retry schedule</button></div>:games.length?<div className="bi-schedule-grid">{games.map(card)}</div>:<p role="status">No games returned for these filters.</p>}
 <p className="bi-insight">Scores and fixtures are from ESPN; drive analysis uses the selected season's nflverse snapshot. Preseason and postseason drive analysis is not currently included.</p>
 </section>
}
