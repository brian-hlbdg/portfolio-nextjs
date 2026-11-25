'use client';
import { useRef,useState } from 'react';
import type { Player } from './data';

export function PlayerPicker({players,selected,onSelect}:{players:readonly Player[];selected:number;onSelect:(index:number)=>void}){
  const dialog=useRef<HTMLDialogElement>(null);
  const trigger=useRef<HTMLButtonElement>(null);
  const [query,setQuery]=useState('');
  const player=players[selected];
  const matches=players.map((p,i)=>({p,i})).filter(({p})=>(p.name+' '+p.position+' '+p.number).toLowerCase().includes(query.trim().toLowerCase()));
  function close(){dialog.current?.close();}
  return <div className="bi-picker">
    <button ref={trigger} type="button" className="bi-picker-trigger" aria-haspopup="dialog" onClick={()=>{setQuery('');dialog.current?.showModal();}}>
      <span className="bi-picker-number">{player.number}</span><span>{player.name}<small>{player.position} · SELECT PLAYER</small></span><span aria-hidden="true">⌄</span>
    </button>
    <dialog ref={dialog} className="bi-picker-dialog" aria-label="Choose a player" onClose={()=>trigger.current?.focus()} onClick={e=>{if(e.target===e.currentTarget)close();}}>
      <div className="bi-picker-inner">
        <header><div><small>CHICAGO / SAMPLE ROSTER</small><h2>Choose a player</h2></div><button type="button" onClick={close} aria-label="Close player selector">×</button></header>
        <label htmlFor="bi-player-search">Search by name, position or number</label>
        <input id="bi-player-search" autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search players"/>
        <div className="bi-picker-results">{matches.map(({p,i})=><button key={p.id} type="button" aria-pressed={selected===i} onClick={()=>{onSelect(i);close();}}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={'https://a.espncdn.com/i/headshots/nfl/players/full/'+p.id+'.png'} alt="" loading="lazy" onError={e=>{e.currentTarget.style.visibility='hidden';}}/>
          <span><strong>{p.name}</strong><small>#{p.number} / {p.position}</small></span><span aria-hidden="true">{i===selected?'✓':'→'}</span>
        </button>)}{!matches.length&&<p>No matching sample players.</p>}</div>
      </div>
    </dialog>
  </div>;
}
