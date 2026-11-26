'use client';
import {useState} from 'react';
import type {ReceivingProfile} from './receiving';
type Metric='targets'|'receptions'|'yards'|'catch';
const labels:Record<Metric,string>={targets:'Targets',receptions:'Receptions',yards:'Yards',catch:'Catch %'};
const pct=(n:number,d:number)=>d?(100*n/d).toFixed(1)+'%':'—';
export function ReceiverField({profile:p}:{profile:ReceivingProfile}){
  const [metric,setMetric]=useState<Metric>('targets');
  const [selected,setSelected]=useState('1-1');
  const active=p.zones.find(z=>z.id===selected)??p.zones[0];
  const max=Math.max(1,...p.zones.map(z=>metric==='yards'?Math.abs(z.yards):metric==='receptions'?z.completions:z.attempts));
  return <section className="bi-panel"><header className="bi-heading"><div><small>03 / RECEIVING TERRITORY</small><h2>Finding space</h2><p>Target depth and direction, not observed routes</p></div><div className="bi-controls">{(Object.keys(labels) as Metric[]).map(m=><button key={m} aria-pressed={metric===m} onClick={()=>setMetric(m)}>{labels[m]}</button>)}</div></header>
    <div className="bi-field bi-field-v2"><div className="bi-endzone">C H I C A G O</div><div className="bi-field-label">ATTACK DIRECTION ↑</div><div className="bi-zone-labels"><span>LEFT</span><span>MIDDLE</span><span>RIGHT</span></div>
    <div className="bi-zones">{p.zones.map(z=>{
      const v=metric==='targets'?z.attempts:metric==='receptions'?z.completions:metric==='yards'?z.yards:z.attempts?z.completions/z.attempts:null;
      const strength=v===null?0:metric==='catch'?v:Math.abs(v)/max;
      const label=metric==='catch'?pct(z.completions,z.attempts):String(v??'—');
      return <button key={z.id} className={z.depth==='Behind LOS'?'bi-behind':''} aria-pressed={active?.id===z.id} aria-label={z.depth+' '+z.direction+' '+label+' '+labels[metric]} onClick={()=>setSelected(z.id)} style={{backgroundColor:v===null?'#26382f':'rgba('+(v<0?'120,150,195':'255,100,30')+','+(.08+.7*Math.min(1,strength))+')'}}><span>{z.depth}</span><strong>{label}</strong><small>{z.completions}/{z.attempts} caught</small></button>
    })}</div><div className="bi-field-label">RECORDED TARGET LOCATIONS ONLY</div></div>
    {active&&<div className="bi-detail" aria-live="polite"><div><small>SELECTED ZONE</small><h3>{active.depth} · {active.direction}</h3></div><div><strong>{active.attempts}</strong><small>TARGETS</small></div><div><strong>{pct(active.completions,active.attempts)}</strong><small>CATCH RATE</small></div><div><strong>{active.yards}</strong><small>YARDS</small></div></div>}
    <p className="bi-insight">{p.zones.reduce((n,z)=>n+z.attempts,0)} of {p.targets} targets have recorded depth and direction. Unclassified targets remain in season totals.</p>
  </section>
}
export function ReceiverTrend({profile:p}:{profile:ReceivingProfile}){
  const [metric,setMetric]=useState<'yards'|'targets'|'receptions'>('yards');
  const [selected,setSelected]=useState<number|null>(null);
  const active=p.weeks.find(w=>w.week===selected)??p.weeks[p.weeks.length-1];
  const max=Math.max(1,...p.weeks.map(w=>Math.abs(w[metric])));
  return <section className="bi-panel"><header className="bi-heading"><div><small>WEEKLY PRODUCTION</small><h2>Reading the receiving game</h2><p>Games with recorded targets</p></div><div className="bi-controls">{(['yards','targets','receptions'] as const).map(m=><button key={m} aria-pressed={metric===m} onClick={()=>setMetric(m)}>{labels[m]}</button>)}</div></header>
    {active&&<div className="bi-highlight" aria-live="polite"><strong>{active[metric]}</strong><span>Week {active.week} · {active.receptions}/{active.targets} caught</span></div>}
    <div className="bi-rush-trend">{p.weeks.map(w=><button key={w.week} aria-pressed={active?.week===w.week} aria-label={'Week '+w.week+', '+w[metric]+' '+labels[metric]} onClick={()=>setSelected(w.week)}><span>{w[metric]}</span><div className="bi-rush-bar"><i style={{height:Math.abs(w[metric])/max*100+'%',background:w[metric]<0?'#84b6eb':undefined}}/></div><small>W{w.week}</small></button>)}</div>
    <p className="bi-legend">Bars show magnitude; blue indicates negative yards. Select a game for details.</p></section>
}
export function AfterCatch({profile:p}:{profile:ReceivingProfile}){
  const yacPer=p.yac!==null&&p.yacReceptions?p.yac/p.yacReceptions:null;
  return <section className="bi-panel"><header className="bi-heading"><div><small>RECEIVING EFFICIENCY</small><h2>After the catch</h2><p>Production beyond the point of reception</p></div></header>
    <div className="bi-highlight"><strong>{p.yac??'—'}</strong><span>Recorded yards after catch</span></div>
    <div className="bi-receiver-kpis">{[['Receiving yards',p.yards],['YAC / measured catch',yacPer===null?'—':yacPer.toFixed(1)],['Avg. target depth',p.adot===null?'—':p.adot.toFixed(1)+' yd'],['First downs',p.firstDowns],['20+ yd catches',p.explosive20],['Catch rate',pct(p.receptions,p.targets)]].map(([label,v])=><div key={label}><small>{label}</small><strong>{v}</strong></div>)}</div>
    <p className="bi-insight">YAC coverage: {p.yacReceptions} of {p.receptions} receptions. Average target depth uses targets with recorded air yards.</p>
  </section>
}
export function Connections({profile:p}:{profile:ReceivingProfile}){
  return <section className="bi-panel"><header className="bi-heading"><div><small>PASSER / RECEIVER</small><h2>Making connections</h2><p>Target distribution and production by passer</p></div></header>
    {p.connections.map(c=><div className="bi-receiver-pair" key={c.id}><div><strong>{c.name}</strong><span>{c.receptions}/{c.targets} caught · {pct(c.receptions,c.targets)}</span></div><div className="bi-track"><i style={{width:(p.targets?100*c.targets/p.targets:0)+'%'}}/></div><div><small>{c.yards} YDS · {c.touchdowns} TD</small><small>{pct(c.targets,p.targets)} OF PLAYER TARGETS</small></div></div>)}
    {!p.connections.length&&<p>No recorded passer connections.</p>}
    <p className="bi-insight">Target share is relative to this receiver's targets, not all Chicago pass attempts.</p>
  </section>
}
