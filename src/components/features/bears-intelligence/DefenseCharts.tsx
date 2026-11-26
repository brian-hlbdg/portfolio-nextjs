'use client';
import {useState} from 'react';
import {defenseLabels,defensiveMetrics,type DefenseData,type Defender,type DefenseMetric} from './defense';
import {laneLabels} from './rushing';
const fmt=(v:number|null)=>v===null?'—':v.toFixed(1);
const ratio=(n:number,d:number)=>d?n/d:null;
export function DefenderProduction({profile,position}:{profile:Defender;position:string}){
 const metrics=(Object.keys(profile.totals) as DefenseMetric[]);
 const [choice,setChoice]=useState<DefenseMetric>(defensiveMetrics(position)[0]);
 const metric=metrics.includes(choice)?choice:metrics[0];
 const [week,setWeek]=useState<number|null>(null);
 const rows=profile.weeks;
 const active=rows.find(w=>w.week===week)??rows[rows.length-1];
 const max=Math.max(1,...rows.map(w=>w.events[metric]??0));
 return <section className="bi-panel"><header className="bi-heading"><div><small>DEFENSIVE PRODUCTION</small><h2>Making the stop</h2><p>Recorded events on opponent offensive plays</p></div></header>
 <div className="bi-controls bi-rush-controls">{metrics.map(m=><button key={m} aria-pressed={metric===m} onClick={()=>setChoice(m)}>{defenseLabels[m]}</button>)}</div>
 <div className="bi-highlight" aria-live="polite"><strong>{active?.events[metric]??'—'}</strong><span>{active?'Week '+active.week+' · ':''}{defenseLabels[metric]}</span></div>
 <div className="bi-rush-trend bi-defense-trend">{rows.map(w=><button key={w.week} aria-pressed={active?.week===w.week} onClick={()=>setWeek(w.week)} aria-label={'Week '+w.week+', '+(w.events[metric]??0)+' '+defenseLabels[metric]}><span>{w.events[metric]??0}</span><div className="bi-rush-bar"><i style={{height:((w.events[metric]??0)/max*100)+'%'}}/></div><small>W{w.week}</small></button>)}</div>
 <p className="bi-insight">Weeks without recorded defensive events are omitted. Non-sack QB hits are not total pressures.</p></section>
}
export function DefenderImpact({profile}:{profile:Defender}){
 return <section className="bi-panel"><header className="bi-heading"><div><small>INDIVIDUAL IMPACT</small><h2>Disrupting the offense</h2><p>Season event totals</p></div></header><div className="bi-receiver-kpis">{(Object.keys(defenseLabels) as DefenseMetric[]).map(k=><div key={k}><small>{defenseLabels[k]}</small><strong>{profile.totals[k]??'—'}</strong></div>)}</div><p className="bi-insight">Events can overlap on a single play. These counts are not a composite defensive grade.</p></section>
}
export function CoverageTerritory({data}:{data:DefenseData}){
 const [metric,setMetric]=useState<'completion'|'yards'|'epa'>('completion');
 const [selected,setSelected]=useState('1-1');
 const active=data.passingAllowed.find(z=>z.id===selected)??data.passingAllowed[0];
 const format=(v:number|null)=>v===null?'—':metric==='completion'?(v*100).toFixed(1)+'%':v.toFixed(metric==='epa'?2:1);
 return <section className="bi-panel"><header className="bi-heading"><div><small>TEAM DEFENSIVE TERRITORY</small><h2>Closing the windows</h2><p>Opponent targets by depth and direction</p></div><div className="bi-controls">{(['completion','yards','epa'] as const).map(m=><button key={m} aria-pressed={metric===m} onClick={()=>setMetric(m)}>{m==='completion'?'Comp %':m==='yards'?'Yds / att':'EPA / att'}</button>)}</div></header>
 <div className="bi-field bi-field-v2"><div className="bi-endzone">C H I C A G O</div><div className="bi-field-label">OPPONENT ATTACK ↑</div><div className="bi-zone-labels"><span>LEFT</span><span>MIDDLE</span><span>RIGHT</span></div><div className="bi-zones">{data.passingAllowed.map(z=>{
 const v=metric==='completion'?ratio(z.completions,z.attempts):metric==='yards'?ratio(z.yards,z.attempts):z.epa;
 const delta=z.benchmark!==null&&z.attempts?z.completions/z.attempts-z.benchmark:null;
 const color=delta===null?'#34454e':delta<=0?'#305b81':'#9b4926';
 return <button key={z.id} className={z.depth==='Behind LOS'?'bi-behind':''} aria-pressed={active?.id===z.id} onClick={()=>setSelected(z.id)} style={{backgroundColor:color}} aria-label={z.depth+' '+z.direction+' '+format(v)}><span>{z.depth}</span><strong>{format(v)}</strong><small>{z.completions}/{z.attempts}</small></button>
 })}</div></div>
 <p className="bi-legend">Blue: opponent completion rate at or below league reference. Orange: above. Color stays tied to completion rate.</p>
 {active&&<div className="bi-detail" aria-live="polite"><div><small>SELECTED ZONE</small><h3>{active.depth} · {active.direction}</h3></div><div><strong>{active.attempts}</strong><small>ATTEMPTS</small></div><div><strong>{active.attempts?(100*active.completions/active.attempts).toFixed(1)+'%':'—'}</strong><small>ALLOWED</small></div><div><strong>{active.benchmark===null?'—':(100*active.benchmark).toFixed(1)+'%'}</strong><small>NFL</small></div></div>}
 <p className="bi-insight">Team-level results, not individual coverage responsibility or route tracking.</p></section>
}
export function RunDefense({data}:{data:DefenseData}){
 const max=Math.max(1,...data.rushingAllowed.map(l=>l.team.attempts));
 const [selected,setSelected]=useState('middle');
 const active=data.rushingAllowed.find(l=>l.id===selected);
 return <section className="bi-panel"><header className="bi-heading"><div><small>TEAM RUN DEFENSE</small><h2>Holding the line</h2><p>Opponent yards per carry by recorded rushing gap</p></div></header>
 <div className="bi-rush-field"><div className="bi-endzone">C H I C A G O</div><div className="bi-rush-lanes">{data.rushingAllowed.map(l=>{
 const ypc=ratio(l.team.yards,l.team.attempts),ref=ratio(l.league.yards,l.league.attempts);
 const color=ypc===null||ref===null?'#8292a3':ypc<=ref?'#84b6eb':'#ff9b60';
 return <button key={l.id} aria-pressed={selected===l.id} onClick={()=>setSelected(l.id)} aria-label={laneLabels[l.id]+', '+fmt(ypc)+' yards allowed per carry'}><small>{laneLabels[l.id]}</small><strong>{fmt(ypc)}</strong><svg viewBox="0 0 48 100" aria-hidden="true"><path d="M24 91V17" stroke={color} strokeWidth={l.team.attempts?3+18*l.team.attempts/max:2}/><path d="M12 24L24 9L36 24" stroke={color} strokeWidth="4" fill="none"/></svg><span>{l.team.attempts} att</span></button>
 })}</div><div className="bi-rush-los">LINE OF SCRIMMAGE</div></div>
 <p className="bi-legend">Width: opponent attempts · blue: at/below league YPC · orange: above.</p>
 {active&&<div className="bi-detail" aria-live="polite"><div><small>SELECTED GAP</small><h3>{laneLabels[active.id]}</h3></div><div><strong>{fmt(ratio(active.team.yards,active.team.attempts))}</strong><small>YPC ALLOWED</small></div><div><strong>{fmt(ratio(active.league.yards,active.league.attempts))}</strong><small>NFL YPC</small></div><div><strong>{active.team.attempts}</strong><small>CARRIES</small></div></div>}
 <p className="bi-insight">Unclassified gaps and kneels are omitted. Lower yards allowed is better.</p></section>
}
