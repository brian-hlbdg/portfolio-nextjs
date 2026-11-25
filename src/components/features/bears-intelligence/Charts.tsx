'use client';
import { useEffect,useId,useState } from 'react';
import { rate,type Metric,type Zone } from './data';
import { passingInsight,conversionInsight,signed,type ConversionBucket,type WeeklyRating } from './analytics';

type ViewMetric = Metric|'relative';
export function Field({zones}:{zones:readonly Zone[]}){
  const [metric,setMetric]=useState<ViewMetric>('relative');
  const [selected,setSelected]=useState('1-1');
  const z=zones.find(v=>v.id===selected) ?? zones[0];
  if(!z) return <section className="bi-panel">No passing territory data available.</section>;
  return <section className="bi-panel bi-field-panel">
    <header className="bi-heading"><div><small>03 / PASSING INTELLIGENCE</small><h2>Where the ball goes</h2><p>Depth and direction relative to the line of scrimmage</p></div>
    <div className="bi-controls">{(['completion','relative','attempts','epa'] as const).map(m=><button key={m} aria-pressed={metric===m} onClick={()=>setMetric(m)}>{({completion:'Comp %',relative:'Vs league',attempts:'Attempts',epa:'EPA'})[m]}</button>)}</div></header>
    <div className="bi-field bi-field-v2"><div className="bi-endzone" aria-hidden="true">C H I C A G O</div>
      <div className="bi-field-label">ATTACK DIRECTION ↑</div>
      <div className="bi-zone-labels"><span>LEFT</span><span>MIDDLE</span><span>RIGHT</span></div>
      <div className="bi-zones">{zones.map((v,index)=>{
        const delta=(rate(v)-v.benchmark)*100;
        const score=metric==='relative'?delta/25:metric==='epa'?v.epa/.4:metric==='completion'?rate(v):v.attempts/64;
        const signed=metric==='relative'||metric==='epa';
        const color=signed&&score<0?'120,150,195':'255,100,30';
        const label=metric==='completion'?Math.round(rate(v)*100)+'%':metric==='attempts'?String(v.attempts):metric==='relative'?(delta>=0?'+':'')+delta.toFixed(1)+' pp':v.epa.toFixed(2);
        return <button key={v.id} className={index>=9?"bi-behind":""} aria-pressed={v.id===selected} aria-label={v.depth+' '+v.direction+' '+label} onClick={()=>setSelected(v.id)} style={{backgroundColor:'rgba('+color+','+(.12+Math.min(1,Math.abs(score))*.65)+')'}}>
          <span>{v.depth} {v.depth==='Behind LOS'?'':'yd'}</span><strong>{label}</strong><small>{v.completions}/{v.attempts}</small>
        </button>;
      })}</div>
      <div className="bi-field-label">DEPTH BINS · NOT EXACT FIELD COORDINATES</div>
    </div>
    <div className="bi-detail" aria-live="polite"><div><small>SELECTED ZONE</small><h3>{z.depth} · {z.direction}</h3></div><div><strong>{(rate(z)*100).toFixed(1)}%</strong><small>COMPLETION</small></div><div><strong>{((rate(z)-z.benchmark)*100).toFixed(1)} pp</strong><small>VS SAMPLE LEAGUE</small></div><div><strong>{z.epa.toFixed(2)}</strong><small>EPA / ATT</small></div></div>
    <p className="bi-insight">{passingInsight(zones)}</p>
  </section>;
}
export function ThirdDown({downs}:{downs:readonly ConversionBucket[]}){
  const total=downs.reduce((s,d)=>s+d.total,0), made=downs.reduce((s,d)=>s+d.made,0);
  return <section className="bi-panel bi-down-panel">
    <header className="bi-heading"><div><small>04 / TEAM SITUATIONS</small><h2>Moving the chains</h2><p>Team third-down conversion by distance</p></div></header>
    <div className="bi-highlight"><strong>{total?(100*made/total).toFixed(1)+"%":"—"}</strong><span>{made} of {total} converted</span></div>
    <div className="bi-legend">Orange: Chicago · White marker: sample NFL average</div>
    {downs.map(d=>{const r=d.total?d.made/d.total:0,delta=(r-d.league)*100;return <div className="bi-down" key={d.distance}><b>{d.distance} yd</b><div className="bi-track" aria-label={Math.round(r*100)+' percent; league '+Math.round(d.league*100)+' percent'}><i style={{width:r*100+'%'}}/><em style={{left:d.league*100+'%'}}/></div><strong>{(r*100).toFixed(1)}%</strong><small>{d.made}/{d.total}</small><span className={delta>=0?'bi-pos':'bi-neg'}>{delta>=0?'+':''}{delta.toFixed(1)} pp</span></div>})}
    <p className="bi-insight">{conversionInsight(downs)}</p>
  </section>;
}
export function Trend({ratings,benchmark}:{ratings:readonly WeeklyRating[];benchmark:number}){
  const [active,setActive]=useState(ratings.length-1);
  const [range,setRange]=useState<'Auto'|'Season'|'Last 5'>('Auto');
  const id=useId();
  const [compact,setCompact]=useState(false);
  const [chartNode,setChartNode]=useState<HTMLDivElement|null>(null);
  useEffect(()=>{
    if(!chartNode) return;
    const observer=new ResizeObserver(([entry])=>setCompact(entry.contentRect.width<480));
    observer.observe(chartNode);return ()=>observer.disconnect();
  },[chartNode]);
  if(!ratings.length) return <section className="bi-panel">No weekly ratings available.</section>;
  const start=range==='Last 5'||(range==='Auto'&&compact)?Math.max(0,ratings.length-5):0;
  const visible=ratings.slice(start);
  const index=Math.max(start,Math.min(active,ratings.length-1));
  const current=ratings[index];
  const best=visible.reduce((a,b)=>a.rating>=b.rating?a:b);
  const W=compact?340:680,H=compact?210:260,L=36,R=18,T=18,B=34;
  const x=(i:number)=>L+(visible.length===1?(W-L-R)/2:i*(W-L-R)/(visible.length-1));
  const max=Math.max(120,Math.ceil(Math.max(benchmark,...visible.map(v=>v.rating))/20)*20);
  const y=(v:number)=>T+(max-v)*(H-T-B)/max;
  const points=visible.map((v,i)=>x(i)+','+y(v.rating)).join(' ');
  return <section className="bi-panel bi-trend-panel">
    <header className="bi-heading"><div><small>WEEKLY PERFORMANCE</small><h2>Passer rating by week</h2><p>Sample NFL reference {benchmark.toFixed(1)}</p></div><div className="bi-controls">{(['Season','Last 5'] as const).map(w=><button key={w} aria-pressed={range===w||(range==='Auto'&&w===(compact?'Last 5':'Season'))} onClick={()=>{setRange(w);setActive(ratings.length-1)}}>{w}</button>)}</div></header>
    <div className="bi-highlight" aria-live="polite"><strong>{current.rating.toFixed(1)}</strong><span>Week {current.week} · {signed(current.rating-benchmark)} vs reference</span></div>
    <div className="bi-trend bi-trend-v2" ref={setChartNode}>
      <svg viewBox={'0 0 '+W+' '+H} role="group" aria-label="Select weekly passer ratings">
        <defs><linearGradient id={id} x1="0" x2="0" y1="0" y2="1"><stop stopColor="#ff702d" stopOpacity=".4"/><stop offset="1" stopColor="#ff702d" stopOpacity="0"/></linearGradient></defs>
        {Array.from({length:5},(_,i)=>max*i/4).map(v=><g key={v}><line x1={L} x2={W-R} y1={y(v)} y2={y(v)} stroke="currentColor" opacity=".2"/><text x="2" y={y(v)+4} fill="currentColor" fontSize="11">{Math.round(v)}</text></g>)}
        <line x1={L} x2={W-R} y1={y(benchmark)} y2={y(benchmark)} stroke="currentColor" strokeDasharray="5 4"/>
        <polygon points={x(0)+','+y(0)+' '+points+' '+x(visible.length-1)+','+y(0)} fill={'url(#'+id+')'}/>
        <polyline points={points} fill="none" stroke="#ff702d" strokeWidth="2.5"/>
        {visible.map((v,i)=><g key={v.week}><circle cx={x(i)} cy={y(v.rating)} r={i+start===index?6:4} fill="#ff702d" stroke="#fff" strokeWidth="1.5"/><text x={x(i)} y={H-10} textAnchor="middle" fill="currentColor" fontSize="10">W{v.week}</text></g>)}
      </svg>
      <div className="bi-chart-hit" style={{left:L/W*100+'%',right:R/W*100+'%',top:T/H*100+'%',bottom:B/H*100+'%',gridTemplateColumns:'repeat('+visible.length+',1fr)'}}>
        {visible.map((v,i)=><button key={v.week} aria-label={'Week '+v.week+', rating '+v.rating} aria-pressed={i+start===index} onClick={()=>setActive(i+start)}><span className="bi-sr-only">Week {v.week}</span></button>)}
      </div>
    </div>
    <p className="bi-insight">Best displayed game: Week {best.week}, {best.rating.toFixed(1)} passer rating.</p>
  </section>;
}
export function League(){
  const ranks=[['Passer rating','98.1',9],['Completion','67.4%',13],['Yards / attempt','7.8',5],['TD rate','5.9%',6],['INT rate','1.5%',8]] as const;
  return <section className="bi-panel bi-league"><header className="bi-heading"><div><small>LEAGUE COMPARISON</small><h2>Rank of 32 starters</h2><p>Illustrative rankings · lower rank is better</p></div></header>
    {ranks.map(([label,val,rank])=><div key={label} className="bi-rank"><div><span>{label} <b>{val}</b></span><strong>#{rank}</strong></div><div className="bi-track"><i style={{width:((33-rank)/32*100)+'%'}}/><em style={{left:'50%'}}/></div></div>)}
    <p className="bi-rank-note">Bars show relative rank, not the raw metric. Marker represents midpoint.</p>
  </section>;
}
