'use client';
import {useRef} from 'react';
import type {BearsGame} from './gameData';

export function orderedGames(games:BearsGame[]|undefined){
 return [...(games??[])].sort((a,b)=>a.week-b.week||(a.date??'').localeCompare(b.date??''));
}
export function activeGame(games:BearsGame[],id?:string|null){
 return games.find(g=>g.id===id)??games.filter(g=>g.final).at(-1)??games.at(-1);
}
const matchup=(g:BearsGame)=>g.away+' at '+g.home;
const detail=(g:BearsGame)=>(g.date??'Date unavailable')+' · '+(g.final?'Final':'Recorded');
export function GamePicker({games,selectedId,onSelect,season}:{games:BearsGame[];selectedId?:string;onSelect:(id:string)=>void;season:number}){
 const ordered=orderedGames(games);
 const game=activeGame(ordered,selectedId);
 const index=ordered.findIndex(g=>g.id===game?.id);
 const dialog=useRef<HTMLDialogElement>(null);
 const trigger=useRef<HTMLButtonElement>(null);
 const selectedRow=useRef<HTMLButtonElement>(null);
 function open(){
   const el=dialog.current;if(!el)return;el.showModal();
   requestAnimationFrame(()=>{if(el.open&&selectedRow.current){const row=selectedRow.current.getBoundingClientRect();const box=el.getBoundingClientRect();el.scrollTop+=row.top-box.top-(el.clientHeight-row.height)/2;}});
 }
 function close(){dialog.current?.close();}
 function step(direction:number){const next=ordered[index+direction];if(next)onSelect(next.id);}
 if(!game)return null;
 return <div className="bi-picker bi-picker-navigation" role="group" aria-label="Game navigation">
  <button type="button" className="bi-player-step" disabled={index<=0} onClick={()=>step(-1)} aria-label="Previous recorded game">‹</button>
  <button ref={trigger} type="button" className="bi-picker-trigger" aria-haspopup="dialog" aria-label={'Select game, week '+game.week+', '+matchup(game)} onClick={open}>
   <span className="bi-picker-number" aria-hidden="true">{game.week}</span><span>{matchup(game)}<small>WEEK {game.week} · {detail(game)}</small></span><span aria-hidden="true">⌄</span>
  </button>
  <button type="button" className="bi-player-step" disabled={index>=ordered.length-1} onClick={()=>step(1)} aria-label="Next recorded game">›</button>
  <dialog ref={dialog} className="bi-picker-dialog" aria-label="Choose a game" onClose={()=>trigger.current?.focus({preventScroll:true})} onClick={e=>{if(e.target===e.currentTarget)close();}}>
   <div className="bi-picker-inner"><header><div><small>CHICAGO / {season} SEASON</small><h2>Choose a game</h2></div><button type="button" onClick={close} aria-label="Close game selector">×</button></header>
    <p className="bi-picker-count">{ordered.length} recorded games</p><div className="bi-picker-results">{ordered.map(g=><button key={g.id} ref={g.id===game.id?selectedRow:undefined} type="button" aria-pressed={g.id===game.id} onClick={()=>{onSelect(g.id);close();}}><span className="bi-picker-placeholder" aria-hidden="true">W{g.week}</span><span><strong>{matchup(g)}</strong><small>{detail(g)}{g.homeScore!==null&&g.awayScore!==null?' · '+g.awayScore+'–'+g.homeScore:''}</small></span><span aria-hidden="true">{g.id===game.id?'✓':'→'}</span></button>)}</div>
   </div>
  </dialog>
 </div>;
}
