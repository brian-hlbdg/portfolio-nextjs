'use client';
import {useState} from 'react';
import {useTeamSchedule} from '@/hooks/useTeamSchedule';
import {normalizeTeam} from './scheduleMatch';
import type {SeasonFile} from './seasonData';
import {teamMetrics,teamLabels,teamValue,type TeamMetric} from './teamIdentity';
import {teamName,type MatchupTeam} from './matchupData';
const pct=(v:number|null)=>v===null?'—':(v*100).toFixed(1)+'%';
const ratio=(a:number,b:number)=>b?a/b:null;
const rankText=(r:{rank:number;count:number}|null)=>r?'#'+r.rank+' / '+r.count:'—';
const percentile=(r:{rank:number;count:number}|null)=>r?(r.count-r.rank+1)/r.count*100:0;
function Alignment({attack,stop}:{attack:MatchupTeam;stop:MatchupTeam}){
 return <section className="bi-panel"><header className="bi-heading"><div><small>OFFENSE VS DEFENSE</small><h2>{attack.id} attacks {stop.id}</h2><p>Compare ranks against the same league population.</p></div></header>
 <div className="bi-match-legend"><span>{attack.id} offense</span><span>{stop.id} defense</span></div>
 {teamMetrics.map(m=>{const a=attack.offenseRanks[m],b=stop.defenseRanks[m];return <div key={m} className="bi-match-row"><div><strong>{teamLabels[m]}</strong></div><div className="bi-match-values"><span>{teamValue(attack.offense[m],m)} · {rankText(a)}</span><span>{teamValue(stop.defense[m],m)} · {rankText(b)}</span></div><div className="bi-match-rank-bars"><div><i style={{width:percentile(a)+'%'}}/></div><div><i style={{width:percentile(b)+'%'}}/></div></div><small>{a&&b&&a.count===b.count?(a.rank<b.rank?'Offense ranks higher':a.rank>b.rank?'Defense ranks higher':'Equal rank'):'Rank comparison unavailable'}</small></div>})}
 <p className="bi-insight">Defensive values are opponent production; lower is better. Rank gaps compare relative standing, not expected outcomes.</p></section>
}
function StyleMatch({chi,opp}:{chi:MatchupTeam;opp:MatchupTeam}){
 const [metric,setMetric]=useState<'epa'|'success'|'yardsPerPlay'>('epa');
 return <section className="bi-panel"><header className="bi-heading"><div><small>PLAY TYPE MATCHUP</small><h2>Attack and counterattack</h2><p>Recorded pass plays and rushes</p></div><div className="bi-controls">{(['epa','success','yardsPerPlay'] as const).map(m=><button key={m} aria-pressed={metric===m} onClick={()=>setMetric(m)}>{teamLabels[m]}</button>)}</div></header>
 {(['pass','rush'] as const).map(style=><div key={style} className="bi-match-row"><strong>{style==='pass'?'Passing game':'Ground game'}</strong><div className="bi-match-table"><span>CHI offense</span><strong>{teamValue(chi.styles[style].offense[metric],metric)}</strong><span>{opp.id} defense allows</span><strong>{teamValue(opp.styles[style].defense[metric],metric)}</strong><span>{opp.id} offense</span><strong>{teamValue(opp.styles[style].offense[metric],metric)}</strong><span>CHI defense allows</span><strong>{teamValue(chi.styles[style].defense[metric],metric)}</strong></div></div>)}
 <p className="bi-insight">Sacks count as pass plays. Scrambles use the recorded rushing classification.</p></section>
}
function RedZoneMatch({chi,opp}:{chi:MatchupTeam;opp:MatchupTeam}){
 return <section className="bi-panel"><header className="bi-heading"><div><small>SCORING MATCHUP</small><h2>Inside the twenty</h2><p>Observed red-zone drives ending in offensive touchdowns</p></div></header>
 {[[chi,opp],[opp,chi]].map(([a,b])=><div key={a.id} className="bi-match-row"><strong>{a.id} offense vs {b.id} defense</strong>{([[a.id+' scores',a.redzone.offense],[b.id+' allows',b.redzone.defense]] as const).map(([label,r])=><div key={label} className="bi-match-rz"><div><span>{label}</span><strong>{pct(ratio(r.td,r.trips))}</strong></div><div className="bi-track"><i style={{width:(ratio(r.td,r.trips)??0)*100+'%'}}/></div><small>{r.td}/{r.trips} drives</small></div>)}</div>)}
 <p className="bi-insight">A trip requires a qualifying scrimmage play inside the opponent 20. These are season aggregates, not matchup predictions.</p></section>
}
function RecentForm({chi,opp}:{chi:MatchupTeam;opp:MatchupTeam}){
 const [metric,setMetric]=useState<TeamMetric>('epa');
 const [side,setSide]=useState<'offense'|'defense'>('offense');
 const a=chi.weeks.slice(-5),b=opp.weeks.slice(-5);
 const max=Math.max(.01,...[...a,...b].map(w=>Math.abs(w[side][metric]??0)));
 return <section className="bi-panel"><header className="bi-heading"><div><small>RECENT FORM</small><h2>Last five observed games</h2><p>Each team's own most recent recorded weeks</p></div></header><div className="bi-controls bi-rush-controls">{(['offense','defense'] as const).map(s=><button key={s} aria-pressed={side===s} onClick={()=>setSide(s)}>{s==='offense'?'Offense':'Opponent offense'}</button>)}{(['epa','success','yardsPerPlay'] as const).map(m=><button key={m} aria-pressed={metric===m} onClick={()=>setMetric(m)}>{teamLabels[m]}</button>)}</div>
 {([[chi.id,a],[opp.id,b]] as const).map(([id,weeks])=>{return <div key={String(id)} className="bi-match-form"><strong>{String(id)}</strong><div className="bi-match-form-grid">{weeks.map(w=>{const v=w[side][metric];return <div key={w.week}><strong>{teamValue(v,metric)}</strong><div className="bi-team-week-bars"><div className={'bi-team-signed '+(id==='CHI'?'offense':'defense')}><i style={{height:(v===null?0:Math.abs(v)/max*50)+'%',bottom:v!==null&&v<0?'auto':'50%',top:v!==null&&v<0?'50%':'auto'}}/></div></div><small>W{w.week}</small></div>})}</div></div>})}
 <p className="bi-legend">Shared scale and zero baseline. Weeks may differ because of bye weeks or data coverage.</p></section>
}
export function MatchupExperience({file,initialOpponent}:{file:SeasonFile;initialOpponent?:string}){
 const teams=file.matchupTeams??[];
 const chicago=teams.find(t=>t.id==='CHI');
 const opponents=teams.filter(t=>t.id!=='CHI');
 const {scheduleData,loading:scheduleLoading}=useTeamSchedule('bears',undefined,file.season);
 const [choice,setChoice]=useState<string|undefined>(normalizeTeam(initialOpponent));
 const fixtures=(scheduleData?.games??[]).filter(g=>g.gameType==='regular'||g.gameType==='postseason').sort((a,b)=>(a.kickoff??'').localeCompare(b.kickoff??''));
 const next=fixtures.find(g=>g.status==='live')??fixtures.find(g=>g.status==='scheduled');
 const latest=(file.games??[]).filter(g=>g.final).at(-1);
 const defaultId=normalizeTeam(next?.opponentAbbreviation)??(latest?normalizeTeam(latest.home==='CHI'?latest.away:latest.home):undefined);
 const target=choice??defaultId;
 const opp=opponents.find(t=>normalizeTeam(t.id)===target);
 const options=[...opponents].sort((a,b)=>teamName(a.id).localeCompare(teamName(b.id)));
 const picker=<div className="bi-game-select"><label htmlFor="bi-match-opponent">Select opponent</label><select id="bi-match-opponent" value={opp?.id??''} onChange={e=>setChoice(normalizeTeam(e.target.value))}><option value="" disabled>{scheduleLoading&&!choice?'Finding next opponent…':'Choose an opponent'}</option>{options.map(t=><option key={t.id} value={t.id}>{teamName(t.id)}{normalizeTeam(t.id)===normalizeTeam(next?.opponentAbbreviation)?' · Next opponent':''}</option>)}</select>{next&&normalizeTeam(next.opponentAbbreviation)&&<button type="button" onClick={()=>setChoice(undefined)}>Next opponent</button>}</div>;
 if(!choice&&scheduleLoading)return <>{picker}<section className="bi-panel" role="status"><h2>Finding the next matchup</h2><p>Retrieving the selected season schedule…</p></section></>;
 if(chicago&&!opp)return <>{picker}<section className="bi-panel"><h2>Choose an opponent</h2><p>{target?'The scheduled or selected opponent has no matching season analytics. Choose another team.':'No upcoming or completed opponent could be identified.'}</p></section></>;
 if(!chicago||!opp)return <section className="bi-panel"><h2>Matchup intelligence unavailable</h2><p>Regenerate the season dataset to include league-wide team profiles.</p></section>;
 const meetings=(file.games??[]).filter(g=>g.home===opp.id||g.away===opp.id);
 return <>
 {picker}
 <section className="bi-team-hero bi-match-hero"><div><small>MATCHUP INTELLIGENCE / {file.season} REGULAR SEASON</small><h1>CHI <span>VS</span> <em>{opp.id}</em></h1><p>Chicago Bears vs {teamName(opp.id)} · descriptive season comparison</p></div><div className="bi-stats">{[['CHI OFF EPA',teamValue(chicago.offense.epa,'epa')],[opp.id+' DEF EPA',teamValue(opp.defense.epa,'epa')],[opp.id+' OFF EPA',teamValue(opp.offense.epa,'epa')],['CHI DEF EPA',teamValue(chicago.defense.epa,'epa')]].map(([label,value])=><div key={label}><strong>{value}</strong><small>{label}</small></div>)}</div></section>
 <section className="bi-section-title"><div><small>01 / HEAD TO HEAD</small><h2>Know your opponent</h2></div><p>Season-to-date profiles, not pregame snapshots or forecasts.</p></section>
 <div className="bi-grid"><Alignment attack={chicago} stop={opp}/><Alignment attack={opp} stop={chicago}/><StyleMatch chi={chicago} opp={opp}/><RedZoneMatch chi={chicago} opp={opp}/><RecentForm key={opp.id} chi={chicago} opp={opp}/>
 <section className="bi-panel"><header className="bi-heading"><div><small>HEAD-TO-HEAD HISTORY</small><h2>Recorded meetings</h2><p>Selected season only</p></div></header>{meetings.length?meetings.map(g=><div key={g.id} className="bi-match-row"><small>WEEK {g.week} · {g.date??''}</small><h3>{g.away} {g.awayScore??'—'} at {g.home} {g.homeScore??'—'}</h3><p>{g.final?'Final':'Last recorded score'}</p></div>):<p>No recorded meetings in this season dataset.</p>}</section></div>
 <p className="bi-insight">All profiles use the selected season's observed plays, including any meetings already played. Rankings are not opponent-adjusted, injury-adjusted or predictive. No win probabilities are inferred.</p></>
}
