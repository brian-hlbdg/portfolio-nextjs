'use client';
import { useId,useState } from 'react';
import { zones,downs,weeks,rate,type Metric } from './data';

type ViewMetric = Metric|'relative';
export function Field(){
  const [metric,setMetric]=useState<ViewMetric>('completion');
  const [selected,setSelected]=useState('1-1');
  const z=zones.find(v=>v.id===selected)!;
  return <section className="bi-panel bi-field-panel">
    <header className="bi-heading"><div><small>03 / PASSING INTELLIGENCE</small><h2>Where the ball goes</h2><p>Depth and direction relative to the line of scrimmage</p></div>
    <div className="bi-controls">{(['completion','relative','attempts','epa'] as const).map(m=><button key={m} aria-pressed={metric===m} onClick={()=>setMetric(m)}>{({completion:'Comp %',relative:'Vs league',attempts:'Attempts',epa:'EPA'})[m]}</button>)}</div></header>
    <div className="bi-field">
      <div className="bi-field-label">ATTACK DIRECTION ↑</div>
      <div className="bi-zone-labels"><span>LEFT</span><span>MIDDLE</span><span>RIGHT</span></div>
      <div className="bi-zones">{zones.map(v=>{
        const delta=(rate(v)-v.benchmark)*100;
        const score=metric==='relative'?delta/25:metric==='epa'?v.epa/.4:metric==='completion'?rate(v):v.attempts/64;
        const signed=metric==='relative'||metric==='epa';
        const color=signed&&score<0?'120,150,195':'255,100,30';
        const label=metric==='completion'?Math.round(rate(v)*100)+'%':metric==='attempts'?String(v.attempts):metric==='relative'?(delta>=0?'+':'')+delta.toFixed(1)+' pp':v.epa.toFixed(2);
        return <button key={v.id} aria-pressed={v.id===selected} aria-label={v.depth+' '+v.direction+' '+label} onClick={()=>setSelected(v.id)} style={{backgroundColor:'rgba('+color+','+(.12+Math.min(1,Math.abs(score))*.65)+')'}}>
          <span>{v.depth} {v.depth==='Behind LOS'?'':'yd'}</span><strong>{label}</strong><small>{v.completions}/{v.attempts}</small>
        </button>;
      })}</div>
      <div className="bi-field-label">LINE OF SCRIMMAGE IS ABOVE THE BEHIND-LOS ROW</div>
    </div>
    <div className="bi-detail" aria-live="polite"><div><small>SELECTED ZONE</small><h3>{z.depth} · {z.direction}</h3></div><div><strong>{(rate(z)*100).toFixed(1)}%</strong><small>COMPLETION</small></div><div><strong>{((rate(z)-z.benchmark)*100).toFixed(1)} pp</strong><small>VS SAMPLE LEAGUE</small></div><div><strong>{z.epa.toFixed(2)}</strong><small>EPA / ATT</small></div></div>
  </section>;
}
export function ThirdDown(){
  const total=downs.reduce((s,d)=>s+d.total,0), made=downs.reduce((s,d)=>s+d.made,0);
  return <section className="bi-panel bi-down-panel">
    <header className="bi-heading"><div><small>04 / TEAM SITUATIONS</small><h2>Moving the chains</h2><p>Team third-down conversion by distance</p></div></header>
    <div className="bi-highlight"><strong>{(100*made/total).toFixed(1)}%</strong><span>{made} of {total} converted</span></div>
    <div className="bi-legend">Orange: Chicago · White marker: sample NFL average</div>
    {downs.map(d=>{const r=d.made/d.total,delta=(r-d.league)*100;return <div className="bi-down" key={d.distance}><b>{d.distance} yd</b><div className="bi-track" aria-label={Math.round(r*100)+' percent; league '+Math.round(d.league*100)+' percent'}><i style={{width:r*100+'%'}}/><em style={{left:d.league*100+'%'}}/></div><strong>{(r*100).toFixed(1)}%</strong><small>{d.made}/{d.total}</small><span className={delta>=0?'bi-pos':'bi-neg'}>{delta>=0?'+':''}{delta.toFixed(1)} pp</span></div>})}
  </section>;
}
export function Trend(){
  const [active,setActive]=useState(11);
  const [window,setWindow]=useState('Season');
  const id=useId();
  const start=window==='Last 5'?7:0;
  const visible=weeks.slice(start);
  const x=(i:number)=>38+i*320/(visible.length-1);
  const y=(v:number)=>168-v*1.25;
  const points=visible.map((v,i)=>x(i)+','+y(v)).join(' ');
  return <section className="bi-panel bi-trend-panel">
    <header className="bi-heading"><div><small>WEEKLY PERFORMANCE</small><h2>Passer rating by week</h2><p>Sample season · NFL reference 88.0</p></div><div className="bi-controls">{['Season','Last 5'].map(w=><button key={w} aria-pressed={window===w} onClick={()=>{setWindow(w);setActive(11)}}>{w}</button>)}</div></header>
    <div className="bi-highlight"><strong>{weeks[active].toFixed(1)}</strong><span>Week {active+1} · {(weeks[active]-88)>=0?'+':''}{(weeks[active]-88).toFixed(1)} vs reference</span></div>
    <div className="bi-trend"><svg viewBox="0 0 380 190" role="img" aria-label="Weekly passer rating with sample league benchmark 88">
      <defs><linearGradient id={id} x1="0" x2="0" y1="0" y2="1"><stop stopColor="#ff702d" stopOpacity=".4"/><stop offset="1" stopColor="#ff702d" stopOpacity="0"/></linearGradient></defs>
      {[40,60,80,100,120].map(v=><g key={v}><line x1="38" x2="358" y1={y(v)} y2={y(v)} stroke="currentColor" opacity=".17"/><text x="4" y={y(v)+4} fill="currentColor" fontSize="10">{v}</text></g>)}
      <line x1="38" x2="358" y1={y(88)} y2={y(88)} stroke="currentColor" strokeDasharray="4 4"/>
      <polygon points={x(0)+',118 '+points+' '+x(visible.length-1)+',118'} fill={'url(#'+id+')'}/>
      <polyline points={points} fill="none" stroke="#ff702d" strokeWidth="2.5"/>
      {visible.map((v,i)=><g key={i}><circle cx={x(i)} cy={y(v)} r={i+start===active?5:3} fill="#ff702d" stroke="#fff" strokeWidth="1"/><text x={x(i)} y="136" textAnchor="middle" fill="currentColor" fontSize="9">W{i+start+1}</text></g>)}
    </svg></div>
    <div className="bi-weeks" style={{gridTemplateColumns:'repeat('+visible.length+',minmax(0,1fr))'}}>{visible.map((v,i)=><button key={i} aria-label={'Week '+(i+start+1)+': '+v} aria-pressed={active===i+start} onClick={()=>setActive(i+start)}>{i+start+1}</button>)}</div>
  </section>;
}
export function League(){
  const ranks=[['Passer rating','98.1',9],['Completion','67.4%',13],['Yards / attempt','7.8',5],['TD rate','5.9%',6],['INT rate','1.5%',8]] as const;
  return <section className="bi-panel bi-league"><header className="bi-heading"><div><small>LEAGUE COMPARISON</small><h2>Rank of 32 starters</h2><p>Illustrative rankings · lower rank is better</p></div></header>
    {ranks.map(([label,val,rank])=><div key={label} className="bi-rank"><div><span>{label} <b>{val}</b></span><strong>#{rank}</strong></div><div className="bi-track"><i style={{width:((33-rank)/32*100)+'%'}}/><em style={{left:'50%'}}/></div></div>)}
    <p className="bi-rank-note">Bars show relative rank, not the raw metric. Marker represents midpoint.</p>
  </section>;
}
