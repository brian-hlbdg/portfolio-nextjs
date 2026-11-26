'use client';
import { useState } from 'react';
import type { Player } from './data';

export function PlayerHero({player,sample=true}:{player:Player;sample?:boolean}) {
  const [artFailed,setArtFailed] = useState(false);
  const [headshotFailed,setHeadshotFailed] = useState(false);
  const [first,...last] = player.name.split(' ');
  const isQB = player.name === 'Caleb Williams';
  const cinematic=isQB&&!artFailed;
  const hasPhoto=cinematic||(!player.id.startsWith('gsis:')&&!headshotFailed);
  return <section className="bi-hero">
    <span className="bi-watermark" aria-hidden="true">{player.number>=0?player.number:""}</span>
    <div className="bi-art">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {hasPhoto?<img className={cinematic?'bi-art-cinematic':'bi-art-fallback'}
        src={cinematic?'/images/bears-intelligence/cw18-hero.webp':player.id.startsWith('gsis:')?undefined:'https://a.espncdn.com/i/headshots/nfl/players/full/'+player.id+'.png'}
        alt={cinematic?'AI-generated quarterback concept artwork':player.name+' headshot'}
        onError={()=>cinematic?setArtFailed(true):setHeadshotFailed(true)}/>:<div className="bi-art-empty"><strong aria-hidden="true">{player.number>=0?player.number:player.position}</strong><small>Portrait unavailable</small></div>}
    </div>
    <div className="bi-hero-copy">
      <small>PLAYER SPOTLIGHT / CHICAGO</small>
      <h1><span>{first}</span><em>{last.join(' ')}</em></h1>
      <p className="bi-identity">#{player.number>=0?player.number:"—"} / {player.position} / CHICAGO BEARS</p>
      {!player.stats.length&&<p>Player statistics unavailable.</p>}<div className="bi-stats">{player.stats.map(([label,value])=><div key={label}><strong>{value}</strong><small>{label}</small></div>)}</div>
      <p className="bi-credit">{sample?'Illustrative statistics':'Regular-season player data'} · {cinematic?'AI concept art':hasPhoto?'Headshot via ESPN':'Portrait unavailable'}</p>
    </div>
  </section>;
}
