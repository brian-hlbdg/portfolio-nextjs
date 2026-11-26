'use client';
import { useEffect,useState } from 'react';
import Link from 'next/link';
import { players } from './data';
import { fixtureSnapshot } from './analytics';
import { loadSeason,liveSnapshot,type SeasonFile } from './seasonData';
import { PlayerPicker } from './PlayerPicker';
import { Field,ThirdDown,Trend,League } from './Charts';
import { PlayerHero } from './PlayerHero';
import './studio.css';

export default function Studio(){
  const [device,setDevice]=useState('Desktop');
  const [player,setPlayer]=useState(0);
  const [mode,setMode]=useState('Experience');
  const [state,setState]=useState('Ready');
  const [source,setSource]=useState('Sample');
  const [season,setSeason]=useState(2025);
  const [file,setFile]=useState<SeasonFile|null>(null);
  const [error,setError]=useState<string|null>(null);
  useEffect(()=>{
    if(source!=='nflverse') return;
    const controller=new AbortController();
    loadSeason(season,controller.signal).then(d=>{if(!controller.signal.aborted)setFile(d)}).catch(e=>{if(!controller.signal.aborted)setError(e instanceof Error?e.message:'Unable to load dataset')});
    return ()=>controller.abort();
  },[source,season]);
  const roster=source==='nflverse'&&file?.season===season&&file.roster?.length?file.roster.map(p=>({id:p.espnId??'gsis:'+p.gsisId,name:p.name,number:p.number??-1,position:p.position,stats:[]})):players;
  const selected=Math.min(player,roster.length-1);
  const current=roster[selected];
  const loaded=source==='nflverse'&&file?.season===season?liveSnapshot(file,current):null;
  const ranks=file?.players.find(p=>p.espnId===current.id||'gsis:'+p.gsisId===current.id)?.ranks;
  const snapshot=source==='Sample'?fixtureSnapshot(current):loaded?.snapshot;
  const shownPlayer=source==='Sample'?current:loaded?.player??{...current,stats:[]};
  return <main className="bi-root">
    <nav className="bi-nav">
      <div className="bi-brand"><span>BIL</span><div><b>BEARS <em>INTELLIGENCE</em></b><small>CHICAGO / FOOTBALL ANALYTICS</small></div></div>
      <div className="bi-controls" aria-label="Studio mode">{['Experience','Components'].map(m=><button key={m} aria-pressed={mode===m} onClick={()=>setMode(m)}>{m}</button>)}</div>
      <Link href="/chicago-sports/bears/">Back to dashboard ↗</Link>
    </nav>
    <div className="bi-toolbar">
      <PlayerPicker players={roster} selected={selected} onSelect={setPlayer} sample={source==='Sample'||!file?.roster?.length}/>
      <div className="bi-controls" aria-label="Preview width">{['Desktop','Tablet','Mobile'].map(d=><button key={d} aria-pressed={device===d} onClick={()=>setDevice(d)}>{d}</button>)}</div>
      <label>Data <select value={source} onChange={e=>{setSource(e.target.value);setPlayer(0);setError(null);setFile(null)}}><option>Sample</option><option>nflverse</option></select></label>
      {source==='nflverse'&&<label>Season <select value={season} onChange={e=>{setSeason(Number(e.target.value));setPlayer(0);setError(null);setFile(null)}}>{[2026,2025,2024].map(y=><option key={y}>{y}</option>)}</select></label>}
      <span className="bi-sample">{source==='Sample'?'SAMPLE DATA':'NFLVERSE / '+season}</span>
      {mode==='Components'&&<label>State <select value={state} onChange={e=>setState(e.target.value)}>{['Ready','Loading','Empty','Error'].map(s=><option key={s}>{s}</option>)}</select></label>}
    </div>
    <div className="bi-preview" style={{maxWidth:device==='Mobile'?390:device==='Tablet'?768:1440}}>
      {mode==='Components'&&state!=='Ready'?<section className="bi-panel" role="status"><h2>{state==='Loading'?'Loading analytics…':state==='Empty'?'No opportunities recorded':'Analytics unavailable'}</h2><p>Simulated preview state.</p><button onClick={()=>setState('Ready')}>Reset</button></section>:<>
      <PlayerHero key={current.id} player={shownPlayer} sample={source==='Sample'}/>
      <section className="bi-section-title"><div><small>02 / SEASON INTELLIGENCE</small><h2>Reading the season</h2></div><p>{source==='Sample'?'Performance, tendencies and context. All numbers are illustrative.':file?.season===season?'Regular season · nflverse · retrieved '+file.retrievedAt.slice(0,10):'Regular season analytics'}</p></section>
      <div className={'bi-grid '+(mode==='Components'?'bi-stack':'')}>
        {!snapshot?<section className="bi-panel" role="status"><h2>{error?'Dataset unavailable':'Loading analytics'}</h2><p>{error??'Retrieving season data…'}</p></section>:<>
        {snapshot.weeklyRatings?.length&&snapshot.leagueRating!==null?<Trend key={snapshot.playerId+'-'+snapshot.season} ratings={snapshot.weeklyRatings} benchmark={snapshot.leagueRating} sample={source==='Sample'}/>:<section className="bi-panel"><h2>Weekly performance</h2><p>No matching passing data available.</p></section>}
        {source==='Sample'&&snapshot.weeklyRatings?<League/>:ranks?.length&&file?.qualifiedPassers?<League actual={ranks} count={file.qualifiedPassers}/>:null}
        {snapshot.passing?<Field zones={snapshot.passing} sample={source==='Sample'}/>:<section className="bi-panel"><h2>Passing territory</h2><p>Complete zone data unavailable for this player.</p></section>}
        {snapshot.thirdDown&&<ThirdDown downs={snapshot.thirdDown} sample={source==='Sample'}/>}
        </>}
      </div>
      </>}
    </div>
    <footer className="bi-footer">{source==='Sample'?'Design prototype · Sample statistics':'Data: nflverse / nflfastR · CC BY 4.0 · Regular season'} · Independent, unofficial Bears project</footer>
  </main>;
}
