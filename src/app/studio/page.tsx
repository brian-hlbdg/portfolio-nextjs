import {Header} from '@/components/layout/Header';
import {HeroSection} from '@/components/features/home/HeroSection';
import {ProofStrip} from '@/components/features/home/ProofStrip';
import {WorkIndex} from '@/components/features/home/WorkIndex';
import {ExperienceChapters} from '@/components/features/home/ExperienceChapters';
import {SportsBand} from '@/components/features/home/SportsBand';
import {Footer} from '@/components/layout/Footer';
import s from './reused.module.css';
export const metadata={title:'B. Hall | Design and technology',robots:{index:false,follow:false}};
export default function Page(){return <div className={s.preview}><Header studio/><HeroSection studio/><ProofStrip/><WorkIndex studio/><ExperienceChapters studio/><SportsBand studio/><Footer studio/></div>;}
