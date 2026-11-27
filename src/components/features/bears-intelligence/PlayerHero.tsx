'use client';
import { useState } from 'react';
import type { Player } from './data';
import {playerIdentity,playerNickname,type PlayerSeasonProfile} from './playerIdentity';

export function PlayerHero({player,sample=true,season,profile}:{player:Player;sample?:boolean;season?:number;profile?:PlayerSeasonProfile}) {
  return <PlayerHeroContent key={player.id+':'+player.name+':'+player.number} player={player} sample={sample} season={season} profile={profile}/>;
}

function PlayerHeroContent({player,sample,season,profile}:{player:Player;sample:boolean;season?:number;profile?:PlayerSeasonProfile}) {
  const [imageIndex,setImageIndex] = useState(0);
  const [first,...last] = player.name.split(' ');
  const slug=player.name.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/['’]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const base='/images/bears-intelligence/';
  const images=[
    ...(slug&&player.number>=0?[{src:base+slug+'-'+player.number+'.webp',cinematic:true}]:[]),
    ...(slug&&player.number>=0&&player.number<10?[{src:base+slug+'-'+String(player.number).padStart(2,'0')+'.webp',cinematic:true}]:[]),
    ...(slug?[{src:base+slug+'.webp',cinematic:true}]:[]),
    ...(player.name==='Caleb Williams'?[{src:base+'cw18-hero.webp',cinematic:true}]:[]),
    ...(/^\d+$/.test(player.id)?[{src:'https://a.espncdn.com/i/headshots/nfl/players/full/'+player.id+'.png',cinematic:false}]:[])
  ];
  const current=images[imageIndex];
  const cinematic=current?.cinematic??false;
  const hasPhoto=Boolean(current);
  const facts=!sample&&season?playerIdentity(player.id,season,profile):[];
  const nickname=!sample?playerNickname(player.id):undefined;
  return <section className="bi-hero">
    <span className="bi-watermark" aria-hidden="true">{player.number>=0?player.number:""}</span>
    <div className="bi-art">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {hasPhoto?<img className={cinematic?'bi-art-cinematic':'bi-art-fallback'}
        key={current?.src}
        src={current?.src}
        alt={cinematic?'Custom concept artwork for '+player.name:player.name+' headshot'}
        onError={()=>setImageIndex(i=>i===imageIndex?i+1:i)}/>:<div className="bi-art-empty"><strong aria-hidden="true">{player.number>=0?player.number:player.position}</strong><small>Portrait unavailable</small></div>}
    </div>
    <div className="bi-hero-copy">
      <small>PLAYER SPOTLIGHT / CHICAGO</small>
      <div className={'bi-hero-title'+(facts.length?' has-identity':'')}><div className="bi-hero-name"><h1><span>{first}</span><em>{last.join(' ')}</em></h1>{nickname&&<a className="bi-hero-nickname" href={nickname.source} target="_blank" rel="noreferrer">{nickname.value}</a>}</div>{facts.length>0&&<dl className="bi-player-bio" aria-label={'Player identity for '+season}>{facts.map(f=><div key={f.label}><dt>{f.label}</dt><dd><a href={f.source} target="_blank" rel="noreferrer" aria-label={f.value+' — '+f.label+' source (opens in new tab)'}>{f.value}</a></dd></div>)}</dl>}</div>
      <p className="bi-identity">#{player.number>=0?player.number:"—"} / {player.position} / CHICAGO BEARS</p>
      {!player.stats.length&&<p>Player statistics unavailable.</p>}<div className="bi-stats">{player.stats.map(([label,value])=><div key={label}><strong>{value}</strong><small>{label}</small></div>)}</div>
      <p className="bi-credit">{sample?'Illustrative statistics':'Regular-season player data'} · {cinematic?'AI concept art':hasPhoto?'Headshot via ESPN':'Portrait unavailable'}</p>
    </div>
  </section>;
}
