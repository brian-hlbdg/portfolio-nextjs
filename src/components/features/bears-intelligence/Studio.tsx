'use client';
import { useEffect,useState } from 'react';
import Link from 'next/link';
import { players } from './data';
import { fixtureSnapshot } from './analytics';
import { loadSeason,liveSnapshot,type SeasonFile } from './seasonData';
import { PlayerPicker } from './PlayerPicker';
import { Field,ThirdDown,Trend,League } from './Charts';
import { PlayerHero } from './PlayerHero';
import { sampleRushing,rushStats } from './rushing';
import { RushingCorridors,RushTrend,ExplosiveRuns } from './RushingCharts';
import { sampleReceiving,receivingStats } from './receiving';
import { ReceiverField,ReceiverTrend,AfterCatch,Connections } from './ReceivingCharts';
import { sampleRedZone } from './redzone';
import { RedZoneField,RedZoneOpportunities,RedZonePlayMix } from './RedZoneCharts';
import './studio.css';

export default function Studio(){
  const [device,setDevice]=useState('Desktop');
  const [player,setPlayer]=useState(0);
  const [mode,setMode]=useState('Experience');
  const [state,setState]=useState('Ready');
  const [source,setSource]=useState('nflverse');
  const [season,setSeason]=useState(2025);
  const [file,setFile]=useState<SeasonFile|null>(null);
  const [error,setError]=useState<string|null>(null);
  useEffect(()=>{
    if(source!=='nflverse') return;
    const controller=new AbortController();
    loadSeason(season,controller.signal).then(d=>{if(!controller.signal.aborted)setFile(d)}).catch(e=>{if(!controller.signal.aborted)setError(e instanceof Error?e.message:'Unable to load dataset')});
    return ()=>controller.abort();
  },[source,season]);
  const roster=source==='Sample'?players:file?.season===season?(file.roster??[]).map(p=>({id:p.espnId??'gsis:'+p.gsisId,name:p.name,number:p.number??-1,position:p.position,stats:[]})):[];
  const selected=Math.max(0,Math.min(player,roster.length-1));
  const current=roster[selected];
  const loaded=source==='nflverse'&&file?.season===season&&current?liveSnapshot(file,current):null;
  const ranks=current?file?.players.find(p=>p.espnId===current.id||'gsis:'+p.gsisId===current.id)?.ranks:undefined;
  const snapshot=source==='Sample'&&current?fixtureSnapshot(current):loaded?.snapshot;
  const rushing=current&&(current.position==='RB'||current.position==='FB')?(source==='Sample'?sampleRushing:file?.rushing?.find(p=>p.espnId===current.id||'gsis:'+p.gsisId===current.id)):undefined;
  const receiving=current&&['WR','TE','RB','FB'].includes(current.position)?(source==='Sample'?(current.position==='WR'?sampleReceiving:undefined):file?.receiving?.find(p=>p.espnId===current.id||'gsis:'+p.gsisId===current.id)):undefined;
  const redzone=source==='Sample'?sampleRedZone:file?.season===season?file.redzone:undefined;
  const basePlayer=current?(source==='Sample'?current:loaded?.player??{...current,stats:[]}):undefined;
  const shownPlayer=basePlayer?(rushing?{...basePlayer,stats:rushStats(rushing)}:receiving?{...basePlayer,stats:receivingStats(receiving)}:basePlayer):undefined;
  return <main className="bi-root">
    <nav className="bi-nav">
      <div className="bi-brand"><span>BIL</span><div><b>BEARS <em>INTELLIGENCE</em></b><small>CHICAGO / FOOTBALL ANALYTICS</small></div></div>
      <div className="bi-controls" aria-label="Studio mode">{['Experience','Components'].map(m=><button key={m} aria-pressed={mode===m} onClick={()=>setMode(m)}>{m}</button>)}</div>
      <Link href="/chicago-sports/bears/">Back to dashboard ↗</Link>
    </nav>
    <div className="bi-toolbar">
      {roster.length?<PlayerPicker players={roster} selected={selected} onSelect={setPlayer} sample={source==='Sample'}/>:<span role="status" className="bi-sample">{error||file?'ROSTER UNAVAILABLE':'LOADING ROSTER…'}</span>}
      <div className="bi-controls" aria-label="Preview width">{['Desktop','Tablet','Mobile'].map(d=><button key={d} aria-pressed={device===d} onClick={()=>setDevice(d)}>{d}</button>)}</div>
      <label>Data <select value={source} onChange={e=>{setSource(e.target.value);setPlayer(0);setError(null);setFile(null)}}><option value="nflverse">nflverse</option><option value="Sample">Sample (3 players)</option></select></label>
      {source==='nflverse'&&<label>Season <select value={season} onChange={e=>{setSeason(Number(e.target.value));setPlayer(0);setError(null);setFile(null)}}>{[2026,2025,2024].map(y=><option key={y}>{y}</option>)}</select></label>}
      <span className="bi-sample">{source==='Sample'?'SAMPLE DATA':'NFLVERSE / '+season}</span>
      {mode==='Components'&&<label>State <select value={state} onChange={e=>setState(e.target.value)}>{['Ready','Loading','Empty','Error'].map(s=><option key={s}>{s}</option>)}</select></label>}
    </div>
    <div className="bi-preview" style={{maxWidth:device==='Mobile'?390:device==='Tablet'?768:1440}}>
      {mode==='Components'&&state!=='Ready'?<section className="bi-panel" role="status"><h2>{state==='Loading'?'Loading analytics…':state==='Empty'?'No opportunities recorded':'Analytics unavailable'}</h2><p>Simulated preview state.</p><button onClick={()=>setState('Ready')}>Reset</button></section>:!current||!shownPlayer?<section className="bi-panel" role="status"><h2>{error||file?'Season roster unavailable':'Loading season roster'}</h2><p>{error??(file?'The season file has no roster. Regenerate the dataset using the latest analytics script.':'Retrieving the selected season dataset…')}</p></section>:<>
      <PlayerHero key={current.id} player={shownPlayer} sample={source==='Sample'}/>
      <section className="bi-section-title"><div><small>02 / SEASON INTELLIGENCE</small><h2>Reading the season</h2></div><p>{source==='Sample'?'Performance, tendencies and context. All numbers are illustrative.':file?.season===season?'Regular season · nflverse · retrieved '+file.retrievedAt.slice(0,10):'Regular season analytics'}</p></section>
      <div className={'bi-grid '+(mode==='Components'?'bi-stack':'')}>
        {!snapshot?<section className="bi-panel" role="status"><h2>{error?'Dataset unavailable':'Loading analytics'}</h2><p>{error??'Retrieving season data…'}</p></section>:<>
        {rushing?<><RushTrend key={'rush-trend-'+current.id+'-'+season+'-'+source} profile={rushing}/><ExplosiveRuns profile={rushing}/><RushingCorridors key={'rush-corridors-'+current.id+'-'+season+'-'+source} profile={rushing}/>{receiving&&<AfterCatch profile={receiving}/>}</>:receiving?<><ReceiverTrend key={'rec-trend-'+current.id+'-'+season+'-'+source} profile={receiving}/><AfterCatch profile={receiving}/><ReceiverField key={'rec-field-'+current.id+'-'+season+'-'+source} profile={receiving}/><Connections profile={receiving}/></>:<>
        {snapshot.weeklyRatings?.length&&snapshot.leagueRating!==null?<Trend key={snapshot.playerId+'-'+snapshot.season} ratings={snapshot.weeklyRatings} benchmark={snapshot.leagueRating} sample={source==='Sample'}/>:<section className="bi-panel"><h2>Weekly performance</h2><p>No matching position-specific data available.</p></section>}
        {source==='Sample'&&snapshot.weeklyRatings?<League/>:ranks?.length&&file?.qualifiedPassers?<League actual={ranks} count={file.qualifiedPassers}/>:null}
        {snapshot.passing?<Field zones={snapshot.passing} sample={source==='Sample'}/>:<section className="bi-panel"><h2>Passing territory</h2><p>No passing zone data for this player.</p></section>}
        </>}
        {snapshot.thirdDown&&<ThirdDown downs={snapshot.thirdDown} sample={source==='Sample'}/>}
        </>}
      </div>
      {redzone?<><section className="bi-section-title"><div><small>05 / SITUATIONAL INTELLIGENCE</small><h2>The scoring zone</h2></div><p>Team scoring efficiency and individual opportunities inside the 20.</p></section><div className="bi-grid"><RedZoneField key={'rz-field-'+season+'-'+source} data={redzone}/><RedZoneOpportunities data={redzone} player={current}/><RedZonePlayMix data={redzone}/></div></>:source==='nflverse'&&file?<section className="bi-panel bi-rz-unavailable"><h2>Red-zone intelligence</h2><p>Regenerate this season dataset to unlock the new scoring analysis.</p></section>:null}
      </>}
    </div>
    <footer className="bi-footer">{source==='Sample'?'Design prototype · Sample statistics':'Data: nflverse / nflfastR · CC BY 4.0 · Regular season'} · Independent, unofficial Bears project</footer>
  </main>;
}
