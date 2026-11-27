'use client';
import {useState,useRef,useEffect} from 'react';
import {useRouter} from 'next/navigation';
import type {MouseEvent} from 'react';
import Link from 'next/link';
import s from '../studio.module.css';
export default function Practice(){
 const router=useRouter();
 const [returning,setReturning]=useState(false);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 function back(e:MouseEvent<HTMLAnchorElement>){
 if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;
 e.preventDefault();
 if(timer.current)return;
 try{sessionStorage.setItem('studio-return','1');}catch{}
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){router.push('/studio/');return;}
 setReturning(true);
 timer.current=setTimeout(()=>router.push('/studio/'),380);
 }
 return <div className={s.studio} data-returning={returning}><header className={s.header}><Link href="/studio/" onClick={back} className={s.brand}>B. Hall</Link><nav className={s.destinationNav} aria-label="Portfolio navigation"><Link href="/case-studies/">Work</Link><Link href="/studio/practice/" aria-current="page">Practice</Link><Link href="/blog/">Journal</Link><Link href="/about/">About</Link><a href="mailto:brian@hlbdesigngroup.com">Let’s talk ↗</a></nav></header><section className={s.destination}><p className={s.eyebrow}>THE PRACTICE</p><h1>Understanding before creating.</h1><p>I enjoy figuring things out, sharing what I learn and helping people turn ideas into reality. Leadership means contributing, not always being in front.</p><Link href="/studio/" onClick={back}>← Return to the studio</Link></section><footer className={s.footer}><span aria-label="HLB maker’s mark">H<b>l</b>B</span><span>CHICAGO · DESIGN & TECHNOLOGY</span><a href="mailto:brian@hlbdesigngroup.com">Get in touch ↗</a></footer></div>}
