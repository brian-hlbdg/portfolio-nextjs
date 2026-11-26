'use client';
import {useState} from 'react';
import {laneLabels,type RushingProfile,type RushLane} from './rushing';

type Metric='ypc'|'attempts'|'yards'|'epa'|'touchdowns'|'explosive10';
const metrics:Record<Metric,string>={ypc:'Yds / carry',attempts:'Attempts',yards:'Yards',epa:'EPA / carry',touchdowns:'TDs',explosive10:'10+ yd runs'};
function value(l:RushLane,m:Metric):number|null{
  if(m==='ypc')return l.attempts?l.yards/l.attempts:null;
  return l[m];
}
function format(v:number|null,m:Metric){return v===null?'—':v.toFixed(m==='epa'?2:m==='ypc'?1:0)}
export function RushingCorridors({profile}:{profile:RushingProfile}){
  const [metric,setMetric]=useState<Metric>('ypc');
  const [selected,setSelected]=useState('middle');
  const lanes=profile.lanes.filter(l=>l.id!=='unknown');
  const active=lanes.find(l=>l.id===selected)??lanes[0];
  const max=Math.max(1,...lanes.map(l=>l.attempts));
  const qualified=lanes.filter(l=>l.attempts>=10&&l.leagueYpc!==null);
  const best=qualified.sort((a,b)=>(b.yards/b.attempts-(b.leagueYpc??0))-(a.yards/a.attempts-(a.leagueYpc??0)))[0];
  const unknown=profile.lanes.find(l=>l.id==='unknown');
  return <section className="bi-panel bi-rush-panel">
    <header className="bi-heading"><div><small>03 / RUSHING INTELLIGENCE</small><h2>Finding the gaps</h2><p>Recorded run direction and gap · schematic, not tracking coordinates</p></div></header>
    <div className="bi-controls bi-rush-controls">{(Object.keys(metrics) as Metric[]).map(m=><button key={m} aria-pressed={metric===m} onClick={()=>setMetric(m)}>{metrics[m]}</button>)}</div>
    <div className="bi-rush-field">
      <div className="bi-endzone">C H I C A G O</div>
      <div className="bi-field-label">DIRECTION OF PLAY ↑</div>
      <div className="bi-rush-lanes">{lanes.map(l=>{
        const ypc=value(l,'ypc'),delta=ypc!==null&&l.leagueYpc!==null?ypc-l.leagueYpc:null;
        const color=delta===null?'#8292a3':delta>=0?'#ff9b60':'#84b6eb';
        return <button key={l.id} aria-pressed={active?.id===l.id} aria-label={laneLabels[l.id]+', '+format(value(l,metric),metric)+' '+metrics[metric]+', '+l.attempts+' attempts'} onClick={()=>setSelected(l.id)}>
          <small>{laneLabels[l.id]}</small><strong>{format(value(l,metric),metric)}</strong>
          <svg viewBox="0 0 48 100" aria-hidden="true"><path d="M24 91V17" stroke={color} strokeWidth={l.attempts?3+18*l.attempts/max:2} opacity={l.attempts?1:.25}/><path d="M12 24L24 9L36 24" stroke={color} strokeWidth="4" fill="none"/></svg>
          <span>{l.attempts} att</span>
        </button>
      })}</div>
      <div className="bi-rush-los">LINE OF SCRIMMAGE</div><div className="bi-rush-line" aria-hidden="true">{['LT','LG','C','RG','RT'].map(p=><span key={p}>{p}</span>)}</div>
      <div className="bi-rush-back" aria-hidden="true">RB</div>
    </div>
    <p className="bi-legend">Width: relative attempts · orange: above league yards/carry · blue: below · gray: unavailable.</p>
    {active&&<div className="bi-detail" aria-live="polite"><div><small>SELECTED GAP</small><h3>{laneLabels[active.id]}</h3></div><div><strong>{active.attempts}</strong><small>ATTEMPTS</small></div><div><strong>{format(value(active,'ypc'),'ypc')}</strong><small>YDS / CARRY</small></div><div><strong>{active.leagueYpc===null?'—':active.leagueYpc.toFixed(1)}</strong><small>LEAGUE YPC</small></div></div>}
    <p className="bi-insight">{best?'Largest eligible YPC difference vs league: '+laneLabels[best.id]+' ('+(best.yards/best.attempts-(best.leagueYpc??0)).toFixed(1)+' yards; '+best.attempts+' attempts).':'No gap has at least 10 attempts and a league benchmark.'} {unknown?.attempts?unknown.attempts+' unclassified carries are included in season totals but omitted from the field.':''}</p>
  </section>
}
export function RushTrend({profile}:{profile:RushingProfile}){
  const [metric,setMetric]=useState<'yards'|'ypc'>('yards');
  const [selected,setSelected]=useState<number|null>(null);
  const rows=profile.weeks;
  const vals=rows.map(w=>metric==='yards'?w.yards:w.attempts?w.yards/w.attempts:0);
  const max=Math.max(1,...vals.map(Math.abs));
  const active=rows.find(w=>w.week===selected)??rows[rows.length-1];
  return <section className="bi-panel"><header className="bi-heading"><div><small>WEEKLY PRODUCTION</small><h2>Reading the ground game</h2><p>Games with recorded rushing attempts</p></div><div className="bi-controls"><button aria-pressed={metric==='yards'} onClick={()=>setMetric('yards')}>Yards</button><button aria-pressed={metric==='ypc'} onClick={()=>setMetric('ypc')}>YPC</button></div></header>
    {active&&<div className="bi-highlight" aria-live="polite"><strong>{metric==='yards'?active.yards:(active.yards/active.attempts).toFixed(1)}</strong><span>Week {active.week} · {active.attempts} carries</span></div>}
    <div className="bi-rush-trend">{rows.map((w,i)=><button key={w.week} aria-pressed={active?.week===w.week} onClick={()=>setSelected(w.week)} aria-label={'Week '+w.week+', '+vals[i].toFixed(metric==='yards'?0:1)}><span>{vals[i].toFixed(metric==='yards'?0:1)}</span><div className="bi-rush-bar"><i style={{height:Math.abs(vals[i])/max*100+'%',background:vals[i]<0?'#84b6eb':undefined}}/></div><small>W{w.week}</small></button>)}</div>
    {!rows.length&&<p>No weekly rushing data.</p>}<p className="bi-legend">Blue bars indicate negative production; select a week for details.</p>
  </section>
}
export function ExplosiveRuns({profile:p}:{profile:RushingProfile}){
  const groups=[{label:'Under 10 yards',count:p.attempts-p.explosive10},{label:'10–19 yards',count:p.explosive10-p.explosive20},{label:'20+ yards',count:p.explosive20}];
  return <section className="bi-panel"><header className="bi-heading"><div><small>EXPLOSIVE PRODUCTION</small><h2>Breaking away</h2><p>Mutually exclusive gain categories</p></div></header>
    <div className="bi-highlight"><strong>{p.attempts?(p.explosive10/p.attempts*100).toFixed(1)+'%':'—'}</strong><span>Runs of 10+ yards</span></div>
    {groups.map(g=><div className="bi-rank" key={g.label}><div><span>{g.label}</span><strong>{g.count}</strong></div><div className="bi-track"><i style={{width:(p.attempts?g.count/p.attempts*100:0)+'%'}}/></div></div>)}
    <p className="bi-insight">Positive-EPA success rate: {p.successRate===null?'—':(p.successRate*100).toFixed(1)+'%'} · EPA / carry: {p.epa===null?'—':p.epa.toFixed(2)}. Both use carries with recorded EPA.</p>
  </section>
}
