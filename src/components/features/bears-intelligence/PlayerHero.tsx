'use client';
import { useState } from 'react';
import type { Player } from './data';

export function PlayerHero({player,sample=true}:{player:Player;sample?:boolean}) {
  const [failed,setFailed] = useState(false);
  const [first,...last] = player.name.split(' ');
  const isQB = player.position === 'QB';
  return <section className="bi-hero">
    <span className="bi-watermark" aria-hidden="true">{player.number}</span>
    <div className="bi-art">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={isQB&&!failed?'bi-art-cinematic':'bi-art-fallback'}
        src={isQB&&!failed?'/images/bears-intelligence/cw18-hero.webp':'https://a.espncdn.com/i/headshots/nfl/players/full/'+player.id+'.png'}
        alt={isQB&&!failed?'AI-generated quarterback concept artwork':player.name+' headshot'}
        onError={()=>setFailed(true)}/>
    </div>
    <div className="bi-hero-copy">
      <small>PLAYER SPOTLIGHT / CHICAGO</small>
      <h1><span>{first}</span><em>{last.join(' ')}</em></h1>
      <p className="bi-identity">#{player.number} / {player.position} / CHICAGO BEARS</p>
      {!player.stats.length&&<p>Player statistics unavailable.</p>}<div className="bi-stats">{player.stats.map(([label,value])=><div key={label}><strong>{value}</strong><small>{label}</small></div>)}</div>
      <p className="bi-credit">{sample?'Illustrative statistics':'Regular-season passing data'} · {isQB&&!failed?'AI concept art':'Headshot via ESPN'}</p>
    </div>
  </section>;
}
