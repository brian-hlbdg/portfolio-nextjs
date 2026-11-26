'use client';
import {useTeamSchedule} from '@/hooks/useTeamSchedule';
import {useBearsNews} from '@/hooks/useBearsNews';
import {useGamePredictors} from '@/hooks/useGamePredictors';
import {useDivisionStandings} from '@/hooks/useDivisionStandings';

export default function CurrentTeamContext({onGames,onMatchup}:{onGames:()=>void;onMatchup:(opponent?:string)=>void}){
 const {scheduleData,loading:scheduleLoading,error:scheduleError}=useTeamSchedule('bears');
 const {divisionStandings,bearsStanding,loading:standingsLoading,source:standingsSource,lastUpdated,refetch:refetchStandings}=useDivisionStandings();
 const {articles,loading:newsLoading,source:newsSource}=useBearsNews();
 const games=scheduleData?.games??[];
 const regular=games.filter(g=>g.gameType==='regular');
 const next=regular.find(g=>g.status==='scheduled'||g.status==='live');
 const {predictions,loading:predictionLoading}=useGamePredictors(next?.status==='scheduled'?[next.id]:[]);
 const prediction=next?.status==='scheduled'?predictions.get(next.id):undefined;
 const last=regular.filter(g=>g.status==='final'&&g.score).at(-1);
 const teams=Array.isArray(divisionStandings?.teams)?divisionStandings.teams:[];
 const own=teams.find(t=>t.teamAbbreviation==='CHI'||t.teamId==='3')??bearsStanding;
 return <>
 <section className="bi-section-title"><div><small>LIVE CONTEXT / ESPN</small><h2>Chicago right now</h2></div><p>Current season information, separate from the historical analytics snapshot.</p></section>
 <div className="bi-grid bi-live-grid">
 <section className="bi-panel"><header className="bi-heading"><div><small>TEAM RECORD / NFC NORTH</small><h2>Division race</h2></div></header>
 {standingsLoading?<p role="status">Loading standings…</p>:own&&teams.length>0?<><div className="bi-highlight"><strong>{own.wins}-{own.losses}{own.ties?'-'+own.ties:''}</strong><span>Chicago · Division position {own.divisionRank} · {standingsSource==='live'?'Live feed':standingsSource==='cache'?'Cached':'Previously retrieved'}</span></div><div className="bi-live-standings">{teams.map(t=><div key={t.teamId} className={t.teamId===own.teamId?'current':''}><span>{t.divisionRank}</span><strong>{t.teamName}</strong><span>{t.wins}-{t.losses}{t.ties?'-'+t.ties:''}</span></div>)}</div><p>{standingsSource==='fallback'?'Current feed unavailable; showing previously retrieved standings.':'Retrieved '+lastUpdated}</p></>:<div><p>Current standings unavailable.</p><button type="button" onClick={()=>void refetchStandings()}>Retry standings</button></div>}
 </section>
 <section className="bi-panel"><header className="bi-heading"><div><small>GAME DAY / ESPN</small><h2>{next?'Next opponent':'Latest result'}</h2></div></header>
 {scheduleLoading?<p role="status">Loading schedule…</p>:scheduleError?<p>Schedule unavailable.</p>:next?<><div className="bi-live-opponent"><small>{next.homeAway==='home'?'HOME':'AWAY'} · {next.status==='live'?'IN PROGRESS':next.date}</small><h3>{next.opponent}</h3><div className="bi-gameday-details"><div><small>KICKOFF</small><strong>{next.kickoff?new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(new Date(next.kickoff)):next.time}</strong></div><div><small>LOCATION</small><strong>{next.venue}</strong><span>{next.location}</span></div><div><small>WATCH</small><strong>{next.broadcast??'Not announced'}</strong></div></div></div>{next.status==='scheduled'&&<section className="bi-game-forecast" aria-label="ESPN pregame prediction"><small>ESPN FPI / WIN PROBABILITY</small>{prediction?<><div className="bi-forecast-values"><div><strong>{prediction.bearsWinProbability}%</strong><span>CHICAGO</span></div><div><strong>{prediction.opponentWinProbability}%</strong><span>{next.opponentAbbreviation??next.opponent}</span></div></div><div className="bi-forecast-bar" aria-hidden="true"><i style={{flex:prediction.bearsWinProbability}}/><b style={{flex:prediction.opponentWinProbability}}/></div><p>Projected margin: {prediction.predictedSpread>0?'Chicago +'+prediction.predictedSpread:prediction.predictedSpread<0?(next.opponentAbbreviation??next.opponent)+' +'+Math.abs(prediction.predictedSpread):'Even'} · Tie chance {prediction.chanceOfTie}%</p></>:<p role="status">{predictionLoading?'Loading forecast…':'Pregame forecast unavailable.'}</p>}</section>}<div className="bi-controls"><button onClick={()=>onMatchup(next.opponentAbbreviation)}>Compare opponent</button><button onClick={onGames}>Explore games</button></div></>:last?<><div className="bi-highlight"><strong>{last.score?.team}–{last.score?.opponent}</strong><span>{last.opponent} · {last.date}</span></div><button onClick={onGames}>Explore games</button></>:<p>No regular-season games available.</p>}
 </section>
 </div>
 <section className="bi-panel bi-live-news"><header className="bi-heading"><div><small>NEWSROOM / ESPN</small><h2>From around the team</h2></div><a href="https://www.espn.com/nfl/team/_/name/chi/chicago-bears" target="_blank" rel="noreferrer">More news ↗</a></header>
 {newsLoading?<p role="status">Loading headlines…</p>:newsSource!=='live'||!articles.length?<p>Current headlines unavailable.</p>:<div className="bi-news-grid">{articles.slice(0,4).map(a=><a key={a.id} href={a.articleUrl} target="_blank" rel="noreferrer" className="bi-news-item"><small>{a.published.slice(0,10)}{a.isPremium?' · ESPN+':''}</small><strong>{a.headline}</strong><p>{a.description}</p></a>)}</div>}
 </section>
 </>
}
