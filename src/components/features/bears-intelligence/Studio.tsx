'use client';
import { useState } from 'react';
import Link from 'next/link';
import { players } from './data';
import { fixtureSnapshot } from './analytics';
import { PlayerPicker } from './PlayerPicker';
import { Field,ThirdDown,Trend,League } from './Charts';
import { PlayerHero } from './PlayerHero';
import './studio.css';

export default function Studio(){
  const [device,setDevice]=useState('Desktop');
  const [player,setPlayer]=useState(0);
  const [mode,setMode]=useState('Experience');
  const [state,setState]=useState('Ready');
  const snapshot=fixtureSnapshot(players[player]);
  return <main className="bi-root">
    <nav className="bi-nav">
      <div className="bi-brand"><span>BIL</span><div><b>BEARS <em>INTELLIGENCE</em></b><small>CHICAGO / FOOTBALL ANALYTICS</small></div></div>
      <div className="bi-controls" aria-label="Studio mode">{['Experience','Components'].map(m=><button key={m} aria-pressed={mode===m} onClick={()=>setMode(m)}>{m}</button>)}</div>
      <Link href="/chicago-sports/bears/">Back to dashboard ↗</Link>
    </nav>
    <div className="bi-toolbar">
      <PlayerPicker players={players} selected={player} onSelect={setPlayer}/>
      <div className="bi-controls" aria-label="Preview width">{['Desktop','Tablet','Mobile'].map(d=><button key={d} aria-pressed={device===d} onClick={()=>setDevice(d)}>{d}</button>)}</div>
      <span className="bi-sample">SAMPLE DATA</span>
      {mode==='Components'&&<label>State <select value={state} onChange={e=>setState(e.target.value)}>{['Ready','Loading','Empty','Error'].map(s=><option key={s}>{s}</option>)}</select></label>}
    </div>
    <div className="bi-preview" style={{maxWidth:device==='Mobile'?390:device==='Tablet'?768:1440}}>
      {mode==='Components'&&state!=='Ready'?<section className="bi-panel" role="status"><h2>{state==='Loading'?'Loading analytics…':state==='Empty'?'No opportunities recorded':'Analytics unavailable'}</h2><p>Simulated preview state.</p><button onClick={()=>setState('Ready')}>Reset</button></section>:<>
      <PlayerHero key={players[player].id} player={players[player]}/>
      <section className="bi-section-title"><div><small>02 / SEASON INTELLIGENCE</small><h2>Reading the season</h2></div><p>Performance, tendencies and context. All numbers are illustrative.</p></section>
      <div className={'bi-grid '+(mode==='Components'?'bi-stack':'')}>
        {snapshot.passing&&snapshot.weeklyRatings&&snapshot.leagueRating!==null?<><Trend key={snapshot.playerId} ratings={snapshot.weeklyRatings} benchmark={snapshot.leagueRating}/><League/><Field zones={snapshot.passing}/></>:<section className="bi-panel"><h2>Position analytics</h2><p>Detailed player splits are not yet available for this position.</p></section>}
        {snapshot.thirdDown&&<ThirdDown downs={snapshot.thirdDown}/>}
      </div>
      </>}
    </div>
    <footer className="bi-footer">Design prototype · Sample statistics · Independent, unofficial Bears project</footer>
  </main>;
}
