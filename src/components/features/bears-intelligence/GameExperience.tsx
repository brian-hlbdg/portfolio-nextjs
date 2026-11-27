'use client';
import {useState,useId,useRef} from 'react';
import SeasonSchedule from './SeasonSchedule';
import {orderedGames,activeGame} from './GamePicker';
import {fieldPosition,driveOutcome,type BearsGame,type GameDrive,type GamePlay} from './gameData';
const signed=(n:number|null,d=0)=>n===null?'—':(n>0?'+':'')+n.toFixed(d);
const kindLabel=(k:string)=>k.replaceAll('_',' ');
function DriveField({drive,active,onSelect}:{drive:GameDrive;active:GamePlay|undefined;onSelect:(id:number)=>void}){
 const titleId=useId();
 const rows=drive.plays;
 const count=Math.max(1,rows.length);
 const height=52+count*25;
 const x=(y:number)=>38+(100-y)*6.4;
 return <section className="bi-panel bi-drive-field"><header className="bi-heading"><div><small>POSSESSION ANATOMY</small><h2>Every yard matters</h2><p>Recorded snap positions and estimated net progression</p></div></header>
 <p className="bi-scroll-hint">Scroll the field horizontally on narrow screens.</p><div className="bi-drive-scroll" tabIndex={0} role="region" aria-label="Scrollable drive field"><svg viewBox={'0 0 716 '+height} role="img" aria-labelledby={titleId} style={{minWidth:440}}><title id={titleId}>Drive starting field positions and play progression toward opponent goal</title>
 <rect x="22" y="25" width="672" height={height-40} rx="4" fill="#183e30"/>
 {[0,10,20,30,40,50,60,70,80,90,100].map(v=><g key={v}><line x1={x(v)} x2={x(v)} y1="25" y2={height-15} stroke="#92ac9c" strokeOpacity=".55" strokeDasharray={v===50?'0':'4 4'}/><text x={x(v)} y="18" fill="#d1dfd6" fontSize="11" textAnchor="middle">{v===100?'OWN':v===0?'GOAL':v>50?100-v:v}</text></g>)}
 {rows.map((p,i)=>{const y=43+i*25;const color=p.turnover?'#f5c15b':drive.team==='CHI'?'#ff9b60':'#84b6eb';return <g key={p.id}>
 {active?.id===p.id&&<rect x="22" y={y-12} width="672" height="24" fill="#ffffff18"/>}
 <text x="12" y={y+4} fill="#d4dfe7" fontSize="10" textAnchor="middle">{i+1}</text>
 {p.start!==null&&<><circle cx={x(p.start)} cy={y} r="4" fill="#e9efe9"/>{p.end!==null&&<><line x1={x(p.start)} x2={x(p.end)} y1={y} y2={y} stroke={color} strokeWidth="5" strokeLinecap="round"/><circle cx={x(p.end)} cy={y} r="4" fill={color}/></>}</>}
 <text x="706" y={y+4} textAnchor="end" fontSize="10" fill="#e9efe9">{p.yards===null?'':signed(p.yards)}</text>
 </g>})}
 </svg></div>
 <div className="bi-drive-steps" role="group" aria-label="Select a play">{rows.map((p,i)=><button key={p.id} aria-pressed={active?.id===p.id} onClick={()=>onSelect(p.id)} aria-label={'Play '+(i+1)+', '+kindLabel(p.kind)+', '+fieldPosition(p.start)}>{i+1}</button>)}</div>
 {active&&<div className="bi-drive-detail" aria-live="polite"><div><small>SELECTED PLAY</small><h3>{kindLabel(active.kind)} · {signed(active.yards)} yd</h3></div><div><small>SNAP POSITION</small><strong>{fieldPosition(active.start)}</strong></div><div><small>EPA</small><strong>{signed(active.epa,2)}</strong></div><p>{active.description}</p></div>}
 <p className="bi-insight">Rows follow recorded play order. End positions are estimated from net yards where available; kicks, turnovers and penalty-only entries do not imply a tracked endpoint.</p></section>
}
function PlayLog({drive,active,onSelect}:{drive:GameDrive;active:GamePlay|undefined;onSelect:(id:number)=>void}){
 return <section className="bi-panel"><header className="bi-heading"><div><small>PLAY-BY-PLAY</small><h2>Inside the possession</h2><p>Choose a play to inspect it on the field</p></div></header><div className="bi-play-log">{drive.plays.map((p,i)=><button key={p.id} aria-pressed={p.id===active?.id} onClick={()=>onSelect(p.id)}><span className="bi-play-index">{String(i+1).padStart(2,'0')}</span><span><small>Q{p.quarter??'—'} {p.clock??''} · {p.down??'—'} &amp; {p.distance??'—'} · {kindLabel(p.kind)}</small><strong>{p.description}</strong></span><span className="bi-play-yards">{signed(p.yards)}<small>YDS</small></span></button>)}</div></section>
}
function GameDetail({game}:{game:BearsGame}){
 const [filter,setFilter]=useState<'all'|'CHI'|'opponent'>('all');
 const [driveId,setDriveId]=useState<string|null>(null);
 const [playId,setPlayId]=useState<number|null>(null);
 const visible=game.drives.filter(d=>filter==='all'||(filter==='CHI'?d.team==='CHI':d.team!=='CHI'));
 const drive=visible.find(d=>d.id===driveId)??visible[0];
 const active=drive?.plays.find(p=>p.id===playId)??drive?.plays[0];
 const chicago=game.home==='CHI'?game.homeScore:game.awayScore;
 const opp=game.home==='CHI'?game.away:game.home;
 const oppScore=game.home==='CHI'?game.awayScore:game.homeScore;
 return <>
 <section className="bi-game-hero"><div><small>GAME INTELLIGENCE / WEEK {game.week} · {game.date??''}</small><h1>CHI <em>{chicago??'—'}</em><span> / </span>{opp} <em>{oppScore??'—'}</em></h1><p>{game.final?'Final score':'Last recorded score'} · {game.home==='CHI'?'Home':'Away'} · regular season</p></div><div className="bi-stats">{[['CHI POSSESSIONS',game.drives.filter(d=>d.team==='CHI').length],['OPP POSSESSIONS',game.drives.filter(d=>d.team!=='CHI').length],['RECORDED SNAPS',game.drives.reduce((n,d)=>n+d.snapCount,0)],['POSSESSIONS',game.drives.length]].map(([label,v])=><div key={label}><strong>{v}</strong><small>{label}</small></div>)}</div></section>
 <section className="bi-section-title"><div><small>01 / POSSESSION TIMELINE</small><h2>Anatomy of a game</h2></div><p>Explore the recorded possessions for both teams.</p></section>
 <section className="bi-panel"><header className="bi-heading"><div><small>DRIVE SELECTOR</small><h2>The flow of the game</h2></div><div className="bi-controls">{(['all','CHI','opponent'] as const).map(f=><button key={f} aria-pressed={filter===f} onClick={()=>{setFilter(f);setDriveId(null);setPlayId(null)}}>{f==='all'?'All drives':f==='CHI'?'Chicago':'Opponent'}</button>)}</div></header>
 <p className="bi-scroll-hint">Scroll to explore all possessions.</p><div className="bi-drive-timeline" tabIndex={0} role="region" aria-label="Scrollable possession timeline">{visible.map(d=><button key={d.id} aria-pressed={drive?.id===d.id} className={d.team==='CHI'?'chi':'opp'} onClick={()=>{setDriveId(d.id);setPlayId(null)}}><small>{d.team} · #{game.drives.indexOf(d)+1}</small><strong>{driveOutcome(d)}</strong><span>{d.snapCount} snaps · {signed(d.netYards)} yd</span><small>{fieldPosition(d.start)}</small></button>)}</div></section>
 {drive&&<><section className="bi-section-title"><div><small>02 / SELECTED POSSESSION</small><h2>{drive.team} · Drive {game.drives.indexOf(drive)+1}</h2></div><p>{driveOutcome(drive)} · {drive.snapCount} snaps · {signed(drive.netYards)} net yards · {signed(drive.epa,2)} total measured EPA</p></section><div className="bi-grid"><DriveField drive={drive} active={active} onSelect={setPlayId}/><PlayLog drive={drive} active={active} onSelect={setPlayId}/></div></>}
 {!drive&&<section className="bi-panel"><p>No recorded possessions for this filter.</p></section>}
 <p className="bi-insight">Possession totals are observed drive groups, not official drive-chart totals. Net yards and EPA summarize recorded scrimmage plays; EPA coverage may be incomplete. Special-teams returns and conversion attempts are not reconstructed.</p>
 </>
}
export function GameExperience({games,season,onMatchup,lab=false,selectedGameId,onGameChange}:{games:BearsGame[]|undefined;season:number;onMatchup:(id:string)=>void;lab?:boolean;selectedGameId?:string;onGameChange?:(id:string)=>void}){
 const [localGameId,setLocalGameId]=useState<string|null>(null);
 const gameId=onGameChange?selectedGameId:localGameId;
 const setGameId=(id:string)=>onGameChange?onGameChange(id):setLocalGameId(id);
 const ordered=orderedGames(games);
 const game=activeGame(ordered,gameId);
 const detail=useRef<HTMLDivElement>(null);
 const selectGame=(id:string)=>{setGameId(id);detail.current?.focus({preventScroll:true});detail.current?.scrollIntoView({block:'start'});};
 return <>
 <div ref={detail} tabIndex={-1} className="bi-game-analysis">
 <section className="bi-section-title"><div><small>GAME / {season}</small><h2>Game Intelligence</h2></div><p>Explore game results, possessions and recorded plays.</p></section>
 {!game?<section className="bi-panel"><h2>{games===undefined?'Game intelligence loading or unavailable':'Game intelligence unavailable'}</h2><p>No recorded game or drive analysis is currently available for this season.</p></section>:<>
 <GameDetail key={game.id} game={game}/></>}
 </div>
 {!lab&&<SeasonSchedule season={season} recorded={ordered} selectedId={game?.id} onGame={selectGame} onMatchup={onMatchup}/>}
 </>
}
