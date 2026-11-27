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
import { defensePosition,defenseStats } from './defense';
import { DefenderProduction,DefenderImpact,CoverageTerritory,RunDefense } from './DefenseCharts';
import { TeamExperience } from './TeamExperience';
import { GameExperience } from './GameExperience';
import { MatchupExperience } from './MatchupExperience';
import CurrentTeamContext from './CurrentTeamContext';
import DataFreshness from './DataFreshness';
import './studio.css';
import {readNavigation,navigationUrl,type NavigationState} from './navigationState';

export default function Studio({lab=false}:{lab?:boolean}){
  const defaultSeason=lab?2025:2026;
  const [navigation,setNavigation]=useState<NavigationState>({view:'Team',season:defaultSeason});
  const [navigationReady,setNavigationReady]=useState(lab);
  const {view,season,opponent,game,player}=navigation;
  useEffect(()=>{
    if(lab)return;
    const restore=()=>{setNavigation(readNavigation(window.location.search,defaultSeason));setNavigationReady(true);};
    restore();window.addEventListener('popstate',restore);return()=>window.removeEventListener('popstate',restore);
  },[lab,defaultSeason]);
  function navigate(patch:Partial<NavigationState>){
    const next={...navigation,...patch};
    if(!lab){const url=navigationUrl(window.location.href,next);if(url.href!==window.location.href)window.history.pushState(null,'',url);}
    setNavigation(next);
  }
  function changeView(next:NavigationState['view']){navigate({view:next});}
  function openMatchup(id?:string){navigate({view:'Matchup',opponent:id});}
  const [device,setDevice]=useState('Desktop');
  const [mode,setMode]=useState('Experience');
  const [state,setState]=useState('Ready');
  const [source,setSource]=useState('nflverse');
  const [file,setFile]=useState<SeasonFile|null>(null);
  const [error,setError]=useState<string|null>(null);
  const [retry,setRetry]=useState(0);
  useEffect(()=>{
    if(source!=='nflverse'||!navigationReady) return;
    const controller=new AbortController();
    setError(null);
    loadSeason(season,controller.signal).then(d=>{if(!controller.signal.aborted)setFile(d)}).catch(e=>{if(!controller.signal.aborted)setError(e instanceof Error?e.message:'Unable to load dataset')});
    return ()=>controller.abort();
  },[source,season,retry,navigationReady]);
  const roster=source==='Sample'?players.map(p=>({...p,gsisId:undefined as string|undefined})):file?.season===season?(file.roster??[]).map(p=>({id:p.espnId??'gsis:'+p.gsisId,gsisId:p.gsisId,name:p.name,number:p.number??-1,position:p.position,depth:p.depth,stats:[]})):[];
  const selected=player?roster.findIndex(p=>p.id===player||p.gsisId===player||'gsis:'+p.gsisId===player):roster.findIndex(p=>p.name==='Caleb Williams');
  const activeIndex=player?selected:Math.max(0,selected);
  const current=roster[activeIndex];
  const playerMissing=!!player&&roster.length>0&&!current;
  const loaded=source==='nflverse'&&file?.season===season&&current?liveSnapshot(file,current):null;
  const ranks=current?file?.players.find(p=>p.espnId===current.id||'gsis:'+p.gsisId===current.id)?.ranks:undefined;
  const snapshot=source==='Sample'&&current?fixtureSnapshot(current):loaded?.snapshot;
  const rushing=current&&(current.position==='RB'||current.position==='FB')?(source==='Sample'?sampleRushing:file?.rushing?.find(p=>p.espnId===current.id||'gsis:'+p.gsisId===current.id)):undefined;
  const receiving=current&&['WR','TE','RB','FB'].includes(current.position)?(source==='Sample'?(current.position==='WR'?sampleReceiving:undefined):file?.receiving?.find(p=>p.espnId===current.id||'gsis:'+p.gsisId===current.id)):undefined;
  const redzone=source==='Sample'?sampleRedZone:file?.season===season?file.redzone:undefined;
  const isDefender=!!current&&defensePosition(current.position);
  const defense=source==='nflverse'&&file?.season===season?file.defense:undefined;
  const defender=current&&isDefender?defense?.players.find(p=>(!!current.gsisId&&p.gsisId===current.gsisId)||p.espnId===current.id||'gsis:'+p.gsisId===current.id):undefined;
  const basePlayer=current?(source==='Sample'?current:loaded?.player??{...current,stats:[]}):undefined;
  const shownPlayer=basePlayer?(isDefender?{...basePlayer,stats:defenseStats(defender,basePlayer.position)}:rushing?{...basePlayer,stats:rushStats(rushing)}:receiving?{...basePlayer,stats:receivingStats(receiving)}:basePlayer):undefined;
  if(!navigationReady)return <main className="bi-root"><p role="status">Loading Bears Intelligence…</p></main>;
  return <main className="bi-root">
    <a className="bi-skip-link" href="#bi-analytics-content">Skip to analytics</a>
    <header className="bi-shell-header">
      <div className="bi-nav">
        <div className="bi-brand"><span aria-hidden="true">BIL</span><div><b>BEARS <em>INTELLIGENCE</em></b><small>CHICAGO / FOOTBALL ANALYTICS</small></div></div>
        <div className="bi-shell-actions">{lab?<Link href="/chicago-sports/bears/">Bears homepage ↗</Link>:<Link href="/chicago-sports/bears/classic/">Classic dashboard ↗</Link>}{lab&&<button type="button" className="bi-studio-toggle" aria-pressed={mode==='Components'} onClick={()=>{if(mode==='Components'){setMode('Experience');setState('Ready');setDevice('Desktop');if(source==='Sample'){setSource('nflverse');setFile(null);setError(null)}}else setMode('Components')}}>{mode==='Components'?'Exit component lab':'Component lab'}</button>}</div>
      </div>
    </header>
      <nav className="bi-primary-nav" aria-label="Intelligence experiences">
        {(['Team','Player','Game','Matchup'] as const).map((v,i)=><button type="button" key={v} aria-current={view===v?'page':undefined} onClick={()=>{if(v!==view){changeView(v);window.scrollTo({top:0,behavior:'instant'});}if(v!=='Player'&&source==='Sample'){setSource('nflverse');setFile(null);setError(null)}}}><small>0{i+1}</small><span>{v}</span><span className="bi-nav-description">{({Player:'Individual performance',Team:'Season identity',Game:'Drive explorer',Matchup:'Opponent comparison'})[v]}</span></button>)}
      </nav>
    <div className={"bi-toolbar bi-context-bar"+(view==='Player'?' bi-context-player':'')}>
      <div className="bi-context-controls">
        {source==='nflverse'&&<label className="bi-context-label"><span>SEASON</span><select value={season} onChange={e=>{navigate({season:Number(e.target.value),opponent:undefined,game:undefined});setError(null);setFile(null)}}>{[2026,2025,2024].map(y=><option key={y}>{y}</option>)}</select></label>}
        {view==='Player'&&(roster.length?<PlayerPicker players={roster} selected={activeIndex} onSelect={i=>{const p=roster[i];if(p)navigate({player:p.gsisId??p.id})}} sample={source==='Sample'} depthAsOf={file?.depthChart?.asOf}/>:<span role="status" className="bi-data-meta">{error||file?'Roster unavailable':'Loading roster…'}</span>)}
      </div>
      {!lab&&source==='nflverse'?<DataFreshness key={season} season={season} file={file?.season===season?file:null} datasetError={error} onRefresh={()=>{setError(null);setRetry(n=>n+1)}}/>:<div className="bi-data-meta" role="status"><span className={source==='Sample'?'bi-source-dot sample':'bi-source-dot'} aria-hidden="true"/><span>{source==='Sample'?'Illustrative sample data':file?.season===season?'nflverse · Regular season':'nflverse · '+season}{source!=='Sample'&&file?.season===season&&<small>Retrieved {file.retrievedAt.slice(0,10)}</small>}</span></div>}
    </div>
    {lab&&mode==='Components'&&<div className="bi-lab-bar"><div><small>DEVELOPMENT ONLY</small><strong>Component lab</strong></div><div className="bi-controls" role="group" aria-label="Preview width">{['Desktop','Tablet','Mobile'].map(d=><button type="button" key={d} aria-pressed={device===d} onClick={()=>setDevice(d)}>{d}</button>)}</div><label>Data <select value={source} onChange={e=>{setSource(e.target.value);setError(null);setFile(null)}}><option value="nflverse">nflverse</option>{view==='Player'&&<option value="Sample">Sample (3 players)</option>}</select></label><label>State <select value={state} onChange={e=>setState(e.target.value)}>{['Ready','Loading','Empty','Error'].map(s=><option key={s}>{s}</option>)}</select></label></div>}
    <div className="bi-preview" id="bi-analytics-content" tabIndex={-1} aria-busy={source==='nflverse'&&!file&&!error} style={{maxWidth:mode==='Components'&&device==='Mobile'?390:mode==='Components'&&device==='Tablet'?768:1440}}>
      {!lab&&view==='Team'&&season===2026&&<CurrentTeamContext onGames={()=>changeView('Game')} onMatchup={openMatchup}/>}
      {error&&source==='nflverse'&&<section className="bi-panel bi-retry-panel" role="alert"><h2>Unable to load season data</h2><p>{error}</p><button type="button" onClick={()=>{setError(null);setFile(null);setRetry(n=>n+1)}}>Retry dataset</button></section>}
      {mode==='Components'&&state!=='Ready'?<section className="bi-panel" role="status"><h2>{state==='Loading'?'Loading analytics…':state==='Empty'?'No opportunities recorded':'Analytics unavailable'}</h2><p>Simulated preview state.</p><button onClick={()=>setState('Ready')}>Reset</button></section>:view==='Matchup'?(file?.season===season?<MatchupExperience key={'matchup-'+season} file={file} initialOpponent={opponent} onOpponentChange={id=>navigate({opponent:id})}/>:<section className="bi-panel" role="status"><h2>{error?'Matchup dataset unavailable':'Loading matchup intelligence'}</h2><p>{error??'Retrieving season data…'}</p></section>):view==='Game'?<GameExperience key={'game-'+season} games={file?.season===season?file.games:undefined} season={season} lab={lab} onMatchup={openMatchup} selectedGameId={game} onGameChange={id=>navigate({game:id})}/>:view==='Team'?(file?.season===season?<TeamExperience key={'team-'+season} file={file} onMatchup={!lab&&season===2026?id=>{openMatchup(id);window.scrollTo({top:0,behavior:'instant'})}:undefined}/>:<section className="bi-panel" role="status"><h2>{error?'Team dataset unavailable':'Loading team intelligence'}</h2><p>{error??'Retrieving season data…'}</p></section>):!current||!shownPlayer?<section className="bi-panel" role="status"><h2>{playerMissing?'Player not on selected roster':error||file?'Season roster unavailable':'Loading season roster'}</h2><p>{playerMissing?'The selected player is not listed on the '+(source==='Sample'?'sample':season)+' roster. Choose another player or return to a season where this player is listed.':error??(file?'The season file has no roster. The selected season may not have been published yet.':'Retrieving the selected season dataset…')}</p></section>:<>
      <PlayerHero key={current.id+'-'+season+'-'+source} player={shownPlayer} sample={source==='Sample'}/>
      <section className="bi-section-title"><div><small>02 / SEASON INTELLIGENCE</small><h2>Reading the season</h2></div><p>{source==='Sample'?'Performance, tendencies and context. All numbers are illustrative.':file?.season===season?'Regular season · nflverse · retrieved '+file.retrievedAt.slice(0,10):'Regular season analytics'}</p></section>
      <div className={'bi-grid '+(mode==='Components'?'bi-stack':'')}>
        {!snapshot?<section className="bi-panel" role="status"><h2>{error?'Dataset unavailable':'Loading analytics'}</h2><p>{error??'Retrieving season data…'}</p></section>:<>
        {isDefender?<>{defender?<><DefenderProduction key={'defender-production-'+current.id+'-'+season} profile={defender} position={current.position}/><DefenderImpact profile={defender}/></>:<section className="bi-panel"><h2>Defensive production</h2><p>{defense?'No recorded defensive events matched this player for the season.':'Defensive analytics are not available in this season dataset.'}</p></section>}</>:rushing?<><RushTrend key={'rush-trend-'+current.id+'-'+season+'-'+source} profile={rushing}/><ExplosiveRuns profile={rushing}/><RushingCorridors key={'rush-corridors-'+current.id+'-'+season+'-'+source} profile={rushing}/>{receiving&&<AfterCatch profile={receiving}/>}</>:receiving?<><ReceiverTrend key={'rec-trend-'+current.id+'-'+season+'-'+source} profile={receiving}/><AfterCatch profile={receiving}/><ReceiverField key={'rec-field-'+current.id+'-'+season+'-'+source} profile={receiving}/><Connections profile={receiving}/></>:<>
        {snapshot.weeklyRatings?.length&&snapshot.leagueRating!==null?<Trend key={'passing-trend-'+snapshot.playerId+'-'+snapshot.season} ratings={snapshot.weeklyRatings} benchmark={snapshot.leagueRating} sample={source==='Sample'}/>:<section className="bi-panel"><h2>Weekly performance</h2><p>{current.position==='QB'?'No recorded Chicago passing attempts matched this player for the selected season. This may reflect no playing time or incomplete player-ID coverage.':'No matching position-specific data available.'}</p></section>}
        {source==='Sample'&&snapshot.weeklyRatings?<League/>:ranks?.length&&file?.qualifiedPassers?<League actual={ranks} count={file.qualifiedPassers}/>:null}
        {snapshot.passing?<Field key={'passing-field-'+current.id+'-'+season+'-'+source} zones={snapshot.passing} sample={source==='Sample'}/>:<section className="bi-panel"><h2>Passing territory</h2><p>No passing zone data for this player.</p></section>}
        </>}
        {snapshot.thirdDown&&<ThirdDown downs={snapshot.thirdDown} sample={source==='Sample'}/>}
        </>}
      </div>
      {defense&&isDefender&&<><section className="bi-section-title"><div><small>05 / DEFENSIVE INTELLIGENCE</small><h2>Protecting Chicago</h2></div><p>Team results against opposing offenses.</p></section><div className="bi-grid"><CoverageTerritory key={'coverage-'+season} data={defense}/><RunDefense key={'run-defense-'+season} data={defense}/></div></>}
      {redzone&&!isDefender?<><section className="bi-section-title"><div><small>05 / SITUATIONAL INTELLIGENCE</small><h2>The scoring zone</h2></div><p>Team scoring efficiency and individual opportunities inside the 20.</p></section><div className="bi-grid"><RedZoneField key={'rz-field-'+season+'-'+source} data={redzone}/><RedZoneOpportunities data={redzone} player={current}/><RedZonePlayMix data={redzone}/></div></>:source==='nflverse'&&file&&!isDefender?<section className="bi-panel bi-rz-unavailable"><h2>Red-zone intelligence</h2><p>Scoring analysis is not available in this season dataset.</p></section>:null}
      </>}
    </div>
    <footer className="bi-footer">{source==='Sample'?'Design prototype · Sample statistics':'Data: nflverse / nflfastR · CC BY 4.0 · Regular season'} · Independent, unofficial Bears project</footer>
  </main>;
}
