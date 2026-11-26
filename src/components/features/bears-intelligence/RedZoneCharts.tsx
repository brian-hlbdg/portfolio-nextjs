'use client';
import {useState} from 'react';
import type {RedZoneData,RedZoneSplit} from './redzone';
import type {Player} from './data';

const pct=(v:number|null)=>v===null?'—':(v*100).toFixed(1)+'%';
const ratio=(n:number,d:number)=>d?n/d:null;
const fmt=(v:number|null)=>v===null?'—':v.toFixed(2);
type Metric='tdRate'|'epa'|'passShare';
const labels:Record<Metric,string>={tdRate:'TD / play',epa:'EPA / play',passShare:'Pass share'};
function measure(s:RedZoneSplit,m:Metric){return m==='passShare'?ratio(s.pass,s.pass+s.rush):s[m]}
export function RedZoneField({data}:{data:RedZoneData}){
 const [metric,setMetric]=useState<Metric>('tdRate');
 const [selected,setSelected]=useState('1-5');
 const active=data.bands.find(b=>b.id===selected)??data.bands[0];
 const d=data.drives, teamRate=ratio(d.teamTd,d.team), leagueRate=ratio(d.leagueTd,d.league);
 const format=(v:number|null)=>metric==='epa'?fmt(v):pct(v);
 return <section className="bi-panel bi-redzone-panel">
 <header className="bi-heading"><div><small>05 / TEAM SCORING INTELLIGENCE</small><h2>Finishing the drive</h2><p>Offensive snaps within the opponent's 20-yard line</p></div></header>
 <div className="bi-redzone-top"><div className="bi-highlight"><strong>{pct(teamRate)}</strong><span>Red-zone drive TD rate<br/>{d.teamTd}/{d.team} observed drives</span></div><div><small>NFL DRIVE TD RATE</small><strong>{pct(leagueRate)}</strong></div></div>
 <div className="bi-controls bi-rush-controls">{(Object.keys(labels) as Metric[]).map(m=><button key={m} aria-pressed={metric===m} onClick={()=>setMetric(m)}>{labels[m]}</button>)}</div>
 <div className="bi-redzone-field"><div className="bi-endzone">C H I C A G O</div>
 {[...data.bands].reverse().map(b=>{
 const value=measure(b.team,metric),ref=measure(b.league,metric),delta=value!==null&&ref!==null?value-ref:null;
 const fill=delta===null?'#25392e':delta>=0?'#a54b22':'#304c70';
 return <button className="bi-redzone-band" key={b.id} aria-pressed={active?.id===b.id} onClick={()=>setSelected(b.id)} aria-label={b.id+' yards to goal, '+labels[metric]+' '+format(value)} style={{backgroundColor:fill}}>
 <span>{b.id} YD</span><strong>{format(value)}</strong><small>NFL {format(ref)}</small></button>
 })}<div className="bi-field-label">20 YARD LINE · ATTACK ↑</div></div>
 <p className="bi-legend">Orange: above NFL reference · blue: below · gray: unavailable. For pass share, color indicates tendency, not quality.</p>
 {active&&<div className="bi-detail" aria-live="polite"><div><small>SELECTED BAND</small><h3>{active.id} yards</h3></div><div><strong>{active.team.pass+active.team.rush}</strong><small>ATTEMPTS</small></div><div><strong>{active.team.passTd+active.team.rushTd}</strong><small>TOUCHDOWNS</small></div><div><strong>{fmt(active.team.epa)}</strong><small>EPA / PLAY</small></div></div>}
 <p className="bi-insight">Drive rate counts drives with an observed red-zone snap that eventually score an offensive passing or rushing touchdown on that drive. Play rates use pass attempts and carries; sacks and kneels are excluded.</p>
 </section>
}
export function RedZoneOpportunities({data,player}:{data:RedZoneData;player:Player}){
 const entry=data.players.find(p=>p.espnId===player.id||'gsis:'+p.gsisId===player.id);
 const rows=entry?.bands??[];
 const qb=player.position==='QB';
 const sums=rows.reduce((s,r)=>({pass:s.pass+r.passAttempts,carries:s.carries+r.carries,targets:s.targets+r.targets,td:s.td+r.passTd+r.rushTd+r.recTd}),{pass:0,carries:0,targets:0,td:0});
 const total=qb?sums.pass+sums.carries:sums.carries+sums.targets;
 return <section className="bi-panel"><header className="bi-heading"><div><small>PLAYER SCORING INTELLIGENCE</small><h2>Inside the twenty</h2><p>{player.name} · red-zone opportunities</p></div></header>
 {!entry?<p>No recorded red-zone passing, rushing or receiving opportunities for this player.</p>:<>
 <div className="bi-highlight"><strong>{total}</strong><span>Recorded opportunities · {sums.td} attributed TDs</span></div>
 <div className="bi-redzone-player-legend"><span>Orange: {qb?'pass attempts':'targets'}</span><span>Blue: carries</span></div>
 {rows.map(r=>{const first=qb?r.passAttempts:r.targets;const n=first+r.carries;return <div className="bi-redzone-row" key={r.id}><div><strong>{r.id} yd</strong><span>{first} {qb?'pass':'targets'} · {r.carries} carries</span></div><div className="bi-redzone-mix"><i style={{width:(total?100*first/total:0)+'%'}}/><b style={{width:(total?100*r.carries/total:0)+'%'}}/></div><small>{n} opportunities · {r.passTd+r.rushTd+r.recTd} TD</small></div>})}
 <p className="bi-insight">Opportunities are attempts or targets originating inside the red zone, not catches or touchdowns on plays starting outside it.</p></>}
 </section>
}
export function RedZonePlayMix({data}:{data:RedZoneData}){
 return <section className="bi-panel"><header className="bi-heading"><div><small>TEAM TENDENCIES</small><h2>Run or throw?</h2><p>Pass and rush attempt distribution by distance to goal</p></div></header>
 {data.bands.map(b=>{const t=b.team, n=t.pass+t.rush;return <div className="bi-redzone-row" key={b.id}><div><strong>{b.id} yd</strong><span>{pct(ratio(t.pass,n))} pass · NFL {pct(ratio(b.league.pass,b.league.pass+b.league.rush))}</span></div><div className="bi-redzone-mix"><i style={{width:(n?100*t.pass/n:0)+'%'}}/><b style={{width:(n?100*t.rush/n:0)+'%'}}/></div><small>{t.pass} passes / {t.rush} carries · {t.passTd} pass TD / {t.rushTd} rush TD</small></div>})}
 <p className="bi-legend">Orange: pass attempts · blue: rush attempts. Each row uses its own attempt total.</p></section>
}
