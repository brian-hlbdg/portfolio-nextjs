'use client';
import { useRef,useState } from 'react';
import type { Player } from './data';

export function PlayerPicker({players,selected,onSelect,sample=true}:{players:readonly Player[];selected:number;onSelect:(index:number)=>void;sample?:boolean}){
  const dialog=useRef<HTMLDialogElement>(null);
  const trigger=useRef<HTMLButtonElement>(null);
  const [query,setQuery]=useState('');
  const player=players[selected];
  const matches=players.map((p,i)=>({p,i})).filter(({p})=>(p.name+' '+p.position+' '+p.number).toLowerCase().includes(query.trim().toLowerCase()));
  function close(){dialog.current?.close();}
  return <div className="bi-picker">
    <button ref={trigger} type="button" className="bi-picker-trigger" aria-haspopup="dialog" onClick={()=>{setQuery('');dialog.current?.showModal();}}>
      <span className="bi-picker-number">{player&&player.number>=0?player.number:'—'}</span><span>{player?.name??'Choose a player'}<small>{player?.position??'ROSTER'} · SELECT PLAYER</small></span><span aria-hidden="true">⌄</span>
    </button>
    <dialog ref={dialog} className="bi-picker-dialog" aria-label="Choose a player" onClose={()=>trigger.current?.focus()} onClick={e=>{if(e.target===e.currentTarget)close();}}>
      <div className="bi-picker-inner">
        <header><div><small>CHICAGO / {sample?'SAMPLE ROSTER':'SEASON ROSTER'}</small><h2>Choose a player</h2></div><button type="button" onClick={close} aria-label="Close player selector">×</button></header>
        <label htmlFor="bi-player-search">Search by name, position or number</label>
        <input id="bi-player-search" autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search players"/>
        <p role="status" className="bi-picker-count">{matches.length} of {players.length} players</p>
        <div className="bi-picker-results">{matches.map(({p,i})=><button key={p.id} type="button" aria-pressed={selected===i} onClick={()=>{onSelect(i);close();}}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {p.id.startsWith('gsis:')?<span className="bi-picker-placeholder" aria-hidden="true">{p.number>=0?p.number:p.position}</span>:<img src={'https://a.espncdn.com/i/headshots/nfl/players/full/'+p.id+'.png'} alt="" loading="lazy" onError={e=>{e.currentTarget.style.visibility='hidden';}}/>}
          <span><strong>{p.name}</strong><small>#{p.number>=0?p.number:'—'} / {p.position}</small></span><span aria-hidden="true">{i===selected?'✓':'→'}</span>
        </button>)}{!matches.length&&<p>No matching players.</p>}</div>
      </div>
    </dialog>
  </div>;
}
