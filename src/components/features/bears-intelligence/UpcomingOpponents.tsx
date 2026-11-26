'use client';
import {useTeamSchedule} from '@/hooks/useTeamSchedule';
import {normalizeTeam} from './scheduleMatch';
export default function UpcomingOpponents({season,onMatchup}:{season:number;onMatchup:(id:string)=>void}){
 const {scheduleData,loading,error,refetch}=useTeamSchedule('bears',undefined,season);
 const upcoming=(scheduleData?.games??[]).filter(g=>g.status==='scheduled').sort((a,b)=>(a.kickoff??'').localeCompare(b.kickoff??''));
 return <section className="bi-panel bi-upcoming-opponents"><header className="bi-heading"><div><small>MONSTERS OF THE MIDWAY / ESPN</small><h2>Who's next?</h2><p>Every remaining scheduled matchup in {season}</p></div></header>{loading?<p role="status">Loading opponents…</p>:error?<div><p>Upcoming games unavailable.</p><button onClick={()=>void refetch()}>Retry</button></div>:upcoming.length?<div className="bi-schedule-grid">{upcoming.map(g=>{const id=normalizeTeam(g.opponentAbbreviation);return <article className="bi-schedule-card" key={g.id}><small>{g.date} · {g.homeAway==='home'?'HOME':'AWAY'}</small><div className="bi-opponent-title"><strong>{g.opponent}</strong>{g.opponentLogo&&<img src={g.opponentLogo} alt="" width={48} height={48} onError={e=>{e.currentTarget.hidden=true}}/>}</div><p>{g.venue} · {g.broadcast??'Broadcast TBD'}</p>{id&&<button onClick={()=>onMatchup(id)}>Compare opponent</button>}</article>})}</div>:<p>No remaining scheduled games returned.</p>}</section>
}
