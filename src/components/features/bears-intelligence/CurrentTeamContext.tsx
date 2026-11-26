'use client';
import {useTeamSchedule} from '@/hooks/useTeamSchedule';
import {useBearsNews} from '@/hooks/useBearsNews';
import {useDivisionStandings} from '@/hooks/useDivisionStandings';

export default function CurrentTeamContext({onGames,onMatchup}:{onGames:()=>void;onMatchup:(opponent?:string)=>void}){
 const {scheduleData,loading:scheduleLoading,error:scheduleError}=useTeamSchedule('bears');
 const {divisionStandings,loading:standingsLoading,source:standingsSource}=useDivisionStandings();
 const {articles,loading:newsLoading,source:newsSource}=useBearsNews();
 const games=scheduleData?.games??[];
 const regular=games.filter(g=>g.gameType==='regular');
 const next=regular.find(g=>g.status==='scheduled'||g.status==='live');
 const last=regular.filter(g=>g.status==='final'&&g.score).at(-1);
 const own=divisionStandings.find(t=>t.teamName.toLowerCase().includes('bears'));
 return <>
 <section className="bi-section-title"><div><small>LIVE CONTEXT / ESPN</small><h2>Chicago right now</h2></div><p>Current season information, separate from the historical analytics snapshot.</p></section>
 <div className="bi-grid bi-live-grid">
 <section className="bi-panel"><header className="bi-heading"><div><small>TEAM RECORD / NFC NORTH</small><h2>Division race</h2></div></header>
 {standingsLoading?<p role="status">Loading standings…</p>:standingsSource==='live'&&own?<><div className="bi-highlight"><strong>{own.wins}-{own.losses}{own.ties?'-'+own.ties:''}</strong><span>Chicago · Division position {own.divisionRank}</span></div><div className="bi-live-standings">{divisionStandings.map(t=><div key={t.teamName} className={t===own?'current':''}><span>{t.divisionRank}</span><strong>{t.teamName}</strong><span>{t.wins}-{t.losses}{t.ties?'-'+t.ties:''}</span></div>)}</div></>:<p>Current standings unavailable.</p>}
 </section>
 <section className="bi-panel"><header className="bi-heading"><div><small>GAME DAY / ESPN</small><h2>{next?'Next opponent':'Latest result'}</h2></div></header>
 {scheduleLoading?<p role="status">Loading schedule…</p>:scheduleError?<p>Schedule unavailable.</p>:next?<><div className="bi-live-opponent"><small>{next.homeAway==='home'?'HOME':'AWAY'} · {next.status==='live'?'IN PROGRESS':next.date}</small><h3>{next.opponent}</h3><p>{next.time} · {next.venue}</p></div><div className="bi-controls"><button onClick={()=>onMatchup(next.opponentAbbreviation)}>Compare opponent</button><button onClick={onGames}>Explore games</button></div></>:last?<><div className="bi-highlight"><strong>{last.score?.team}–{last.score?.opponent}</strong><span>{last.opponent} · {last.date}</span></div><button onClick={onGames}>Explore games</button></>:<p>No regular-season games available.</p>}
 </section>
 </div>
 <section className="bi-panel bi-live-news"><header className="bi-heading"><div><small>NEWSROOM / ESPN</small><h2>From around the team</h2></div><a href="https://www.espn.com/nfl/team/_/name/chi/chicago-bears" target="_blank" rel="noreferrer">More news ↗</a></header>
 {newsLoading?<p role="status">Loading headlines…</p>:newsSource!=='live'||!articles.length?<p>Current headlines unavailable.</p>:<div className="bi-news-grid">{articles.slice(0,4).map(a=><a key={a.id} href={a.articleUrl} target="_blank" rel="noreferrer" className="bi-news-item"><small>{a.published.slice(0,10)}{a.isPremium?' · ESPN+':''}</small><strong>{a.headline}</strong><p>{a.description}</p></a>)}</div>}
 </section>
 </>
}
