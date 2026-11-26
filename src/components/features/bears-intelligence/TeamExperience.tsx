'use client';
import {useState} from 'react';
import {teamMetrics,teamLabels,teamValue,type TeamIdentityData,type TeamMetric,type TeamSplit} from './teamIdentity';
import type {SeasonFile} from './seasonData';
import {ThirdDown} from './Charts';
import {CoverageTerritory,RunDefense} from './DefenseCharts';
import {RedZoneField,RedZonePlayMix} from './RedZoneCharts';
const pct=(v:number|null)=>v===null?'—':(v*100).toFixed(1)+'%';
function Fingerprint({data,side}:{data:TeamIdentityData;side:'offense'|'defense'}){
 const ranks=side==='offense'?data.offenseRanks:data.defenseRanks;
 const values=data[side];
 return <section className={'bi-panel bi-team-fingerprint bi-team-'+side}><header className="bi-heading"><div><small>{side==='offense'?'OFFENSIVE':'DEFENSIVE'} FINGERPRINT</small><h2>{side==='offense'?'Creating advantages':'Taking away options'}</h2><p>{side==='offense'?'Higher production ranks better':'Lower opponent production ranks better'}</p></div></header>
 {teamMetrics.map(m=>{const r=ranks[m];return <div key={m} className="bi-team-rank"><div><span>{teamLabels[m]}</span><strong>{teamValue(values[m],m)}</strong></div><div className="bi-track"><i style={{width:(r?(r.count-r.rank+1)/r.count*100:0)+'%'}}/><em style={{left:'50%'}}/></div><div><small>NFL {teamValue(data.league[m],m)}</small><small>{r?'#'+r.rank+' / '+r.count:'Not ranked'}</small></div></div>})}
 <p className="bi-insight">Bar length represents league rank, not metric magnitude. Tied values share rank.</p></section>
}
function TeamTrend({data}:{data:TeamIdentityData}){
 const [metric,setMetric]=useState<TeamMetric>('epa');
 const [selected,setSelected]=useState<number|null>(null);
 const rows=data.weeks;
 const active=rows.find(w=>w.week===selected)??rows[rows.length-1];
 const max=Math.max(.01,...rows.flatMap(w=>[Math.abs(w.offense[metric]??0),Math.abs(w.defense[metric]??0)]));
 return <section className="bi-panel"><header className="bi-heading"><div><small>WEEKLY TEAM PERFORMANCE</small><h2>Winning the margins</h2><p>Offensive production versus opponent production</p></div></header>
 <div className="bi-controls bi-rush-controls">{teamMetrics.filter(m=>m!=='thirdDown').map(m=><button key={m} aria-pressed={metric===m} onClick={()=>setMetric(m)}>{teamLabels[m]}</button>)}</div>
 {active&&<div className="bi-highlight" aria-live="polite"><strong>{teamValue(active.offense[metric],metric)}</strong><span>Week {active.week} · opponent {teamValue(active.defense[metric],metric)}</span></div>}
 <div className="bi-team-trend">{rows.map(w=><button key={w.week} aria-pressed={active?.week===w.week} onClick={()=>setSelected(w.week)} aria-label={'Week '+w.week+' offense '+teamValue(w.offense[metric],metric)+' opponent '+teamValue(w.defense[metric],metric)}><div className="bi-team-week-bars">{(['offense','defense'] as const).map(side=>{const v=w[side][metric];return <div key={side} className={'bi-team-signed '+side}><i style={{height:(v===null?0:Math.abs(v)/max*50)+'%',bottom:v!==null&&v<0?'auto':'50%',top:v!==null&&v<0?'50%':'auto'}}/></div>})}</div><small>W{w.week}</small></button>)}</div>
 <p className="bi-legend">Orange: offense · blue: opponent offense · center line: zero. Select a week for exact values.</p></section>
}
function Balance({data}:{data:TeamIdentityData}){
 const entries:[string,TeamSplit][]=[['Chicago offense',data.offense],['Opponent offense',data.defense],['NFL aggregate',data.league]];
 return <section className="bi-panel"><header className="bi-heading"><div><small>PLAY DISTRIBUTION</small><h2>Run or pass?</h2><p>Recorded pass plays (including sacks) versus rushes</p></div></header>{entries.map(([name,s])=><div key={name} className="bi-redzone-row"><div><strong>{name}</strong><span>{pct(s.passShare)} pass</span></div><div className="bi-redzone-mix"><i style={{width:(s.passShare===null?0:s.passShare*100)+'%'}}/><b style={{width:(s.passShare===null?0:(1-s.passShare)*100)+'%'}}/></div><small>{s.plays} qualifying plays</small></div>)}<p className="bi-legend">Orange: passing · blue: rushing. Scrambles are recorded rushes, not inferred play calls.</p></section>
}
function Situations({data}:{data:TeamIdentityData}){
 const [metric,setMetric]=useState<TeamMetric>('epa');
 return <section className="bi-panel"><header className="bi-heading"><div><small>DOWN INTELLIGENCE</small><h2>Situational identity</h2><p>Efficiency on each down</p></div><div className="bi-controls">{(['epa','success','yardsPerPlay'] as const).map(m=><button key={m} aria-pressed={metric===m} onClick={()=>setMetric(m)}>{teamLabels[m]}</button>)}</div></header><div className="bi-team-downs"><div><small>DOWN</small><small>CHI OFF</small><small>OPP OFF</small><small>NFL</small></div>{data.downs.map(d=><div key={d.down}><strong>{d.down}</strong><strong>{teamValue(d.offense[metric],metric)}</strong><strong>{teamValue(d.defense[metric],metric)}</strong><span>{teamValue(d.league[metric],metric)}</span></div>)}</div><p className="bi-insight">Opponent metrics reflect Chicago defense; lower opponent production is generally better.</p></section>
}
function ChapterBanner({eyebrow,first,last,mark,description,stats,defensive=false}:{eyebrow:string;first:string;last:string;mark:string;description:string;stats:[string,string][];defensive?:boolean}){
 return <section className={'bi-team-hero bi-chapter-banner'+(defensive?' bi-defense-chapter':'')}><div><small>{eyebrow}</small>{defensive?<h2>{first} <em>{last}</em></h2>:<h1>{first} <em>{last}</em></h1>}<p>{description}</p></div><div className="bi-team-hero-mark" aria-hidden="true">{mark}</div><div className="bi-stats">{stats.map(([label,value])=><div key={label}><strong>{value}</strong><small>{label}</small></div>)}</div></section>
}
export function TeamExperience({file}:{file:SeasonFile}){
 const data=file.teamIdentity;
 if(!data)return <section className="bi-panel"><h2>Team intelligence unavailable</h2><p>Regenerate this season dataset with the latest analytics script.</p></section>;
 const finals=(file.games??[]).filter(g=>g.final&&g.homeScore!==null&&g.awayScore!==null&&(g.home==='CHI'||g.away==='CHI')).map(g=>({for:g.home==='CHI'?g.homeScore!:g.awayScore!,against:g.home==='CHI'?g.awayScore!:g.homeScore!}));
 const wins=finals.filter(g=>g.for>g.against).length,losses=finals.filter(g=>g.for<g.against).length,ties=finals.length-wins-losses;
 const points=finals.reduce((n,g)=>n+g.for,0),diff=finals.reduce((n,g)=>n+g.for-g.against,0);
 const signed=(v:number)=>v>0?'+'+v:String(v);
 return <>
 <ChapterBanner eyebrow={'TEAM INTELLIGENCE / '+file.season+' REGULAR SEASON'} first="CHICAGO" last="BEARS" mark="CHI" description="Overall team performance · recorded final games" stats={[[ 'RECORD',finals.length?wins+'-'+losses+(ties?'-'+ties:''):'—'],['WIN %',finals.length?((wins+ties*.5)/finals.length*100).toFixed(1)+'%':'—'],['POINTS SCORED',finals.length?String(points):'—'],['POINT DIFFERENTIAL',finals.length?signed(diff):'—']]}/>
 <p className="bi-chapter-note">{finals.length} games marked final in the selected nflverse snapshot. Totals may be incomplete if final-game markers are missing.</p>
 <section className="bi-section-title"><div><small>01 / TEAM PROFILE</small><h2>The identity of a team</h2></div><p>League ranks and situational performance from {file.season} play-by-play.</p></section>
 <div className="bi-grid"><Fingerprint data={data} side="offense"/><Balance data={data}/><TeamTrend data={data}/><Situations data={data}/><ThirdDown downs={file.thirdDown} sample={false}/></div>
 {file.redzone&&<><section className="bi-section-title"><div><small>02 / SCORING</small><h2>The scoring zone</h2></div></section><div className="bi-grid"><RedZoneField data={file.redzone}/><RedZonePlayMix data={file.redzone}/></div></>}
 <ChapterBanner defensive eyebrow={'DEFENSIVE INTELLIGENCE / '+file.season+' REGULAR SEASON'} first="MONSTERS OF" last="THE MIDWAY" mark="D" description="Defensive identity · limiting opponent production" stats={[[ 'OPP EPA / PLAY',teamValue(data.defense.epa,'epa')],['OPP YARDS / PLAY',teamValue(data.defense.yardsPerPlay,'yardsPerPlay')],['SCRIMMAGE TAKEAWAYS',data.defense.plays?String(data.defense.turnovers):'—'],['SACKS',data.defense.plays?String(data.defense.sacks):'—']]}/>
 <section className="bi-section-title"><div><small>03 / DEFENSIVE PROFILE</small><h2>Protecting Chicago</h2></div><p>Opponent efficiency, league rankings and field territory.</p></section>
 <div className="bi-grid"><Fingerprint data={data} side="defense"/>{file.defense&&<><CoverageTerritory data={file.defense}/><RunDefense data={file.defense}/></>}</div>
 <p className="bi-insight">Scope: recorded regular-season pass plays and rushes, excluding kneels, spikes, no-plays and two-point attempts. Success is positive EPA on measured plays. Explosive: 20+ pass yards or 10+ rush yards. Scrimmage takeaways count opponent interceptions and lost fumbles on qualifying plays.</p>
 </>;
}
