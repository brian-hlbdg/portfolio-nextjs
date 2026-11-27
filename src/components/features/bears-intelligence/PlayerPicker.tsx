'use client';
import { useRef,useState } from 'react';
import type { Player } from './data';
type RosterPlayer=Player&{depth?:{rank:number;position:string|null;group:string|null}|null};
const positionOrder=['QB','RB','HB','FB','WR','TE','LT','LG','C','RG','RT','OT','OG','T','G','OL','DE','LDE','RDE','DT','NT','DL','EDGE','LB','ILB','MLB','OLB','SLB','WLB','CB','LCB','RCB','NB','DB','S','FS','SS','K','P','LS','KR','PR'];
const posRank=(p:RosterPlayer)=>{const n=positionOrder.indexOf(p.position.toUpperCase());return n<0?999:n};
const depthTier=(p:RosterPlayer)=>p.depth?.rank===1?1:p.depth?.rank===2?2:p.depth&&p.depth.rank>=3?3:4;
const tierLabels=['First string / starters','Second string','Third string and additional depth','Depth assignment unavailable'];

export function PlayerPicker({players,selected,onSelect,sample=true,depthAsOf}:{players:readonly RosterPlayer[];selected:number;onSelect:(index:number)=>void;sample?:boolean;depthAsOf?:string}){
  const dialog=useRef<HTMLDialogElement>(null);
  const trigger=useRef<HTMLButtonElement>(null);
  const selectedRow=useRef<HTMLButtonElement>(null);
  const savedScroll=useRef(0);
  const [query,setQuery]=useState('');
  const player=players[selected];
  const ordered=players.map((p,i)=>({p,i})).sort((a,b)=>depthTier(a.p)-depthTier(b.p)||posRank(a.p)-posRank(b.p)||(a.p.depth?.rank??999)-(b.p.depth?.rank??999)||a.p.name.localeCompare(b.p.name));
  const matches=ordered.filter(({p})=>(p.name+' '+p.position+' '+p.number).toLowerCase().includes(query.trim().toLowerCase()));
  const index=ordered.findIndex(({i})=>i===selected);
  function close(){if(dialog.current)savedScroll.current=dialog.current.scrollTop;dialog.current?.close();}
  function open(){const el=dialog.current;if(!el)return;el.showModal();requestAnimationFrame(()=>{if(!el.open)return;const row=selectedRow.current;if(row){const bounds=el.getBoundingClientRect();const item=row.getBoundingClientRect();el.scrollTop+=item.top-bounds.top-(el.clientHeight-item.height)/2;}else el.scrollTop=savedScroll.current;});}
  function step(direction:number){const next=ordered[index+direction];if(next){setQuery('');onSelect(next.i);}}
  return <div className="bi-picker bi-picker-navigation">
    <button type="button" className="bi-player-step" disabled={index<=0} onClick={()=>step(-1)} aria-label="Previous player">‹</button>
    <button ref={trigger} type="button" className="bi-picker-trigger" aria-haspopup="dialog" onClick={open}>
      <span className="bi-picker-number">{player&&player.number>=0?player.number:'—'}</span><span>{player?.name??'Choose a player'}<small>{player?.position??'ROSTER'} · SELECT PLAYER</small></span><span aria-hidden="true">⌄</span>
    </button>
    <button type="button" className="bi-player-step" disabled={index>=ordered.length-1} onClick={()=>step(1)} aria-label="Next player">›</button>
    <dialog ref={dialog} className="bi-picker-dialog" aria-label="Choose a player" onClose={()=>trigger.current?.focus({preventScroll:true})} onClick={e=>{if(e.target===e.currentTarget)close();}}>
      <div className="bi-picker-inner">
        <header><div><small>CHICAGO / {sample?'SAMPLE ROSTER':'SEASON ROSTER'}</small><h2>Choose a player</h2></div><button type="button" onClick={close} aria-label="Close player selector">×</button></header>
        <label htmlFor="bi-player-search">Search by name, position or number</label>
        <input id="bi-player-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search players"/>{query&&<button type="button" onClick={()=>setQuery('')}>Clear search</button>}
        <p role="status" className="bi-picker-count">{matches.length} of {players.length} players</p>
        <p className="bi-depth-note">{depthAsOf?'Depth chart snapshot: '+depthAsOf:sample?'Illustrative roster; depth ranks not assigned.':'Depth chart unavailable; ordered by position.'}</p>
        <div className="bi-picker-results">{[1,2,3,4].map(tier=>{const rows=matches.filter(({p})=>depthTier(p)===tier);return rows.length?<section key={tier} className="bi-depth-group"><h3>{tierLabels[tier-1]} <span>{rows.length}</span></h3>{rows.map(({p,i})=><button key={p.id} ref={selected===i?selectedRow:undefined} type="button" aria-pressed={selected===i} onClick={()=>{onSelect(i);close();}}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {p.id.startsWith('gsis:')?<span className="bi-picker-placeholder" aria-hidden="true">{p.number>=0?p.number:p.position}</span>:<img src={'https://a.espncdn.com/i/headshots/nfl/players/full/'+p.id+'.png'} alt="" loading="lazy" onError={e=>{e.currentTarget.style.visibility='hidden';}}/>}
          <span><strong>{p.name}</strong><small>#{p.number>=0?p.number:'—'} / {p.position}{p.depth?.position&&p.depth.position!==p.position?' · '+p.depth.position:''}{p.depth?' · Depth '+p.depth.rank:''}</small></span><span aria-hidden="true">{i===selected?'✓':'→'}</span>
        </button>)}</section>:null})}{!matches.length&&<p>No matching players.</p>}</div>
      </div>
    </dialog>
  </div>;
}
