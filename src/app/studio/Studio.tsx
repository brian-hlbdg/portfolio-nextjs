'use client';
import {useState,useRef,useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import type {MouseEvent} from 'react';
import s from './studio.module.css';
const destinations=[
{title:'Work',desc:'From possibility to reality.',href:'/case-studies/',note:'Enterprise systems, independent products and living experiments.'},
{title:'Practice',desc:'How I think, design and lead.',href:'/studio/?view=practice',note:'Understand before creating. Leadership through contribution.'},
{title:'Journal',desc:'What I learn and share.',href:'/blog/',note:'Design, technology and the human experience.'},
{title:'About',desc:'The person behind the work.',href:'/about/',note:'A career shaped by curiosity, people and practical impact.'}
];

// Morph the existing phrase in place, using staggered, gently faded glyph changes.
function Scramble({target,base,note}:{target:string;base:string;note:string}){
 const [display,setDisplay]=useState(target);
 const [opacity,setOpacity]=useState(1);
 const current=useRef(target);
 const previous=useRef(target);
 useEffect(()=>{
  if(previous.current===target)return;
  previous.current=target;
  const from=current.current;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const start=performance.now();
  let frame=0,last=-100;
  const glyphs='abcdefghijklmnopqrstuvwxyz';
  const length=Math.max(from.length,target.length);
  const offsets=Array.from({length},(_,i)=>((i*17+11)%31)/31*.18);
  function tick(now:number){
   const p=reduced?1:Math.min((now-start)/950,1);
   if(p===1){current.current=target;setDisplay(target);setOpacity(1);return;}
   if(now-last>=65){
    last=now;
    const next=Array.from({length},(_,i)=>{
     const a=from[i]??' ',b=target[i]??' ';
     const local=(p-offsets[i])/.78;
     if(local<.12)return a;
     if(local>.82)return b;
     if(a===' '&&b===' ')return ' ';
     if(a===b&&a!==' '&&local<.35)return a;
     if(a===' '&&local<.34)return ' ';
     if(b===' '&&local>.58)return ' ';
     const g=glyphs[Math.floor(Math.random()*glyphs.length)];
     return /[A-Z]/.test(a)||/[A-Z]/.test(b)?g.toUpperCase():g;
    }).join('').trimEnd();
    current.current=next;setDisplay(next);
   }
   setOpacity(1-.24*Math.sin(Math.PI*p));
   frame=requestAnimationFrame(tick);
  }
  frame=requestAnimationFrame(tick);
  return ()=>cancelAnimationFrame(frame);
 },[target]);
 return <span style={{display:'grid',position:'relative',margin:0,color:'inherit',lineHeight:1.55,minHeight:'3.1em',overflow:'hidden'}}><span style={{position:'absolute',width:1,height:1,padding:0,margin:-1,overflow:'hidden',clip:'rect(0,0,0,0)',whiteSpace:'nowrap',border:0}}>{target}</span><span aria-hidden="true" style={{gridArea:'1 / 1',opacity:0,margin:0,color:'inherit',overflowWrap:'anywhere',pointerEvents:'none'}}>{base}</span><span aria-hidden="true" style={{gridArea:'1 / 1',opacity:0,margin:0,color:'inherit',overflowWrap:'anywhere',pointerEvents:'none'}}>{note}</span><span aria-hidden="true" style={{position:'absolute',inset:0,margin:0,color:'inherit',overflowWrap:'anywhere',lineHeight:'inherit',opacity}}>{display}</span></span>;
}

export default function Studio(){
 const router=useRouter();
 const [leaving,setLeaving]=useState(false);
 const leaveTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>()=>{if(leaveTimer.current)clearTimeout(leaveTimer.current);},[]);
 function navigate(e:MouseEvent<HTMLElement>,href:string){
 if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;
 e.preventDefault();
 if(leaveTimer.current)return;
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){router.push(href);return;}
 setLeaving(true);
 leaveTimer.current=setTimeout(()=>router.push(href),420);
 }
 const [open,setOpen]=useState(false);
 const [active,setActive]=useState<number|null>(null);
 const [practice,setPractice]=useState(false);
 const [visible,setVisible]=useState(false);
 const closeTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>()=>{if(closeTimer.current)clearTimeout(closeTimer.current);},[]);
 const trigger=useRef<HTMLButtonElement>(null);
 const index=useRef<HTMLElement>(null);
 function reveal(showPractice=false){
 if(closeTimer.current)clearTimeout(closeTimer.current);
 setVisible(true);setOpen(true);setPractice(showPractice);
 requestAnimationFrame(()=>index.current?.focus());
 }
 function toggle(){
 if(open){
 trigger.current?.focus();setOpen(false);
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 closeTimer.current=setTimeout(()=>{setVisible(false);setActive(null);setPractice(false);},reduced?0:1000);
 }else reveal();
 }
 return <div className={s.studio} data-open={open} data-leaving={leaving} onKeyDown={e=>{if(e.key==='Escape'&&open)toggle();}}>
 <div className={s.art} aria-hidden="true"><svg viewBox="0 -90 900 940" preserveAspectRatio="xMidYMid slice"><defs><pattern id="studio-grid" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M 100 0 H 0 V 100" fill="none" stroke="#93877c" strokeWidth=".65" opacity=".24"/></pattern></defs><rect x="260" width="640" height="760" fill="url(#studio-grid)"/><circle cx="820" cy="-35" r="250" fill="#243e49"/><path d="M820 -285 A250 250 0 0 1 820 215 Z" fill="#a74318"/><path d="M360 760 A300 300 0 0 1 960 760 A300 300 0 0 1 360 760Z" fill="#d6c6b1"/><path d="M600 1055 V465 A295 295 0 0 1 895 760 A295 295 0 0 1 600 1055Z" fill="#243e49"/><path d="M250 470 C250 120 620 110 790 290 S900 620 1030 635" fill="none" stroke="#233c48" strokeWidth="1.8"/><path d="M590 -100 C380 220 470 510 900 625" fill="none" stroke="#ab451b" strokeWidth="1.4"/><circle cx="515" cy="470" r="115" fill="none" stroke="#9b8e80" strokeDasharray="5 7"/><circle cx="515" cy="470" r="28" fill="#ac471c"/><g stroke="#273b43" fill="none" strokeWidth="1.2"><path d="M250 470 L240 350 M530 205 L390 180 M515 470 L365 530 L290 610 M515 470 L675 335"/><path d="M540 145 H790 M540 137 V153 M790 137 V153 M540 145 V205 M790 145 V290"/></g><g fill="#263d48"><circle cx="240" cy="350" r="4"/><circle cx="390" cy="180" r="4"/><circle cx="365" cy="530" r="5"/><circle cx="290" cy="610" r="4"/><circle cx="675" cy="335" r="4"/></g><g fill="#f4eee5" stroke="#263d48" strokeWidth="1.5"><rect x="245" y="465" width="10" height="10"/><rect x="525" y="200" width="10" height="10"/></g><text x="665" y="134" textAnchor="middle" fontSize="12" fill="#4b4b45" fontFamily="monospace">250 px</text></svg><pre className={s.code}><span>type</span> Contribution = {'{'}{'\n'}  listen: boolean;{'\n'}  connect: Idea[];{'\n'}  create: Experience;{'\n'}{'}'};</pre></div>
 <header className={s.header}><Link href="/studio/" className={s.brand}>B. Hall</Link><nav aria-label="Portfolio navigation" className={s.nav}>{destinations.map((d,i)=>i===1?<button key={d.title} onClick={e=>navigate(e,"/studio/practice/")}>{d.title}</button>:<Link key={d.title} href={d.href} onClick={e=>navigate(e,d.href)}>{d.title}</Link>)}<a href="mailto:brian@hlbdesigngroup.com">Let’s talk ↗</a></nav></header>
 <div className={s.canvas}>

 <section className={s.intro} aria-label="Introduction"><p className={s.eyebrow}>DESIGN × TECHNOLOGY × PEOPLE</p><h1>Ideas that work<br/> for <em>people.</em></h1><p className={s.description}>I bring people, design and technology together to understand problems and turn ideas into meaningful experiences.</p><button ref={trigger} className={s.action} aria-expanded={open} aria-controls="studio-index" onClick={toggle}><span>{open?'←':'→'}</span>{open?'Return to introduction':'Explore the portfolio'}</button></section>
 <section id="studio-index" ref={index} tabIndex={-1} hidden={!visible} inert={!open} aria-hidden={!open} className={s.index} aria-label="Explore the portfolio"><p className={s.eyebrow}>01 / THE INDEX</p><h2>{practice?'The practice':'My Peccadilloes'}</h2>{practice?<div className={s.practice}><p>Understand. Connect. Create.</p><p>I enjoy figuring things out, sharing what I learn and helping people turn ideas into reality. Leadership means contributing, not always being in front.</p><button onClick={()=>setPractice(false)}>← Back to index</button></div>:<div className={s.entries}>{destinations.map((d,i)=><div key={d.title} onMouseEnter={()=>setActive(i)} onMouseLeave={()=>setActive(null)}>{i===1?<button onFocus={()=>setActive(i)} onBlur={()=>setActive(null)} onClick={e=>navigate(e,"/studio/practice/")}><small>0{i+1}</small><strong>{d.title}</strong><span>↗</span></button>:<Link onFocus={()=>setActive(i)} onBlur={()=>setActive(null)} href={d.href} onClick={e=>navigate(e,d.href)}><small>0{i+1}</small><strong>{d.title}</strong><span>↗</span></Link>}<p><Scramble target={active===i?d.note:d.desc} base={d.desc} note={d.note}/></p></div>)}</div>}</section>
 </div><footer className={s.footer}><span aria-label="HLB maker’s mark">H<b>l</b>B</span><span>CHICAGO · DESIGN & TECHNOLOGY</span><a href="mailto:brian@hlbdesigngroup.com">Get in touch ↗</a></footer></div>;
}
