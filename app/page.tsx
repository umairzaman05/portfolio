'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowUpRight, Sun, Moon, Copy, Check, Download, Layers3, Code2, Sparkles, Pause, Play } from 'lucide-react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useScrollMotion } from './use-scroll-motion';
import { CinematicHero, ExpertiseMarquee } from './cinematic-hero';
import { WorkStory, BuildMethod } from './work-story';
import { CompanyLogos } from './company-logos';

const email = 'mdumairzama@gmail.com';
const resume = '/Md_Umair_Uz_Zaman_Resume.pdf';
function themeSnapshot() { try { const saved=document.documentElement.dataset.themePreference||localStorage.getItem('umair-theme');return saved?saved==='dark':true; } catch { return true; } }
function subscribeTheme(callback:()=>void) { const media=matchMedia('(prefers-color-scheme: dark)');media.addEventListener('change',callback);window.addEventListener('umair-theme',callback);return()=>{media.removeEventListener('change',callback);window.removeEventListener('umair-theme',callback);}; }
function motionSnapshot(){return !matchMedia('(prefers-reduced-motion: reduce)').matches;}
function subscribeMotion(callback:()=>void){const media=matchMedia('(prefers-reduced-motion: reduce)');media.addEventListener('change',callback);return()=>media.removeEventListener('change',callback);}
function clockSnapshot(){return new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit'}).format(new Date());}
function subscribeClock(callback:()=>void){const timer=setInterval(callback,1000);return()=>clearInterval(timer);}
const experience = [
  { id: 'labs', dates: 'JUL 2026 — PRESENT', role: 'AI Engineer', company: 'The Binary Holdings · The Binary Labs', note: 'Progression within the group · The Binary Labs is the AI-focused division', items: ['Automating departmental workflows through multiple agents, tool integrations, and AI-assisted development.', 'Developed an in-house intranet to bring departmental work into a shared workspace.', 'Contributing to ARIA intelligence-layer work and building WaveGuard with Appium and Playwright for in-house quality engineering.'] },
  { id: 'binary', dates: 'NOV 2022 — JUN 2026', role: 'Associate Product Manager', company: 'The Binary Holdings', note: 'The product foundation for my transition into AI engineering', items: ['Led the product lifecycle for Fando, Spin It, BNRY Mart, ngage, BNRY Games, and UPlay.', 'Owned requirements, prioritization, stakeholder alignment, and cross-functional execution.', 'Used experimentation and analytics to guide engagement improvements and product decisions.'] },
  { id: 'lulu', dates: 'APR 2021 — SEP 2022', role: 'Product Analyst', company: 'Lulu Group International', note: 'Research, analytics, and product optimization', items: ["Supported Lulu India’s online platform through user research, analytics, and KPI tracking.", 'Identified opportunities to improve checkout workflows and operational efficiency.'] },
];
const toolkit = [
  {id:'ai',label:'AI & orchestration',icon:Sparkles,items:['OpenAI','Claude','Gemini','LangGraph','LangChain','n8n','Prompt engineering','Agentic workflows','RAG concepts','MCP integrations'],caption:'Designing prompts, coordinating agents, and connecting models to useful workflows.'},
  {id:'engineering',label:'Engineering & QA',icon:Code2,items:['Python · working knowledge','FastAPI · working knowledge','SQL','REST APIs','Playwright','Appium','Docker · working knowledge','Git','Google Cloud Run','PostgreSQL','Redis','Vision / OCR'],caption:'AI-assisted implementation and debugging, with working knowledge of Python and FastAPI. My strength is connecting tools to deliver a usable system.'},
  {id:'product',label:'Product & delivery',icon:Layers3,items:['Product strategy','Requirements','Agile delivery','Stakeholder management','System design','Workflow design','Prioritization','Product analytics'],caption:'Connecting business context to clear requirements and cross-functional delivery.'},
];

function SectionTitle({ number, title, aside }: {number: string; title: string; aside?: string}) {
  return <div className="section-heading"><div><span className="section-number">{number}</span><h2>{title}</h2></div>{aside && <span className="section-aside">{aside}</span>}</div>;
}

export default function Home() {
  const dark=useSyncExternalStore(subscribeTheme,themeSnapshot,()=>true);
  const systemMotion=useSyncExternalStore(subscribeMotion,motionSnapshot,()=>false);
  const [paused,setPaused]=useState(false);
  const motion=systemMotion&&!paused;
  const time=useSyncExternalStore(subscribeClock,clockSnapshot,()=>'IST');
  const progressRef=useScrollMotion(motion);
  const [copied,setCopied]=useState(false),[copyError,setCopyError]=useState(false),[activeSection,setActiveSection]=useState('work');
  const resetCopy=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)setActiveSection(entry.target.id);},{rootMargin:'-15% 0px -55% 0px'});document.querySelectorAll('section[id]').forEach(section=>observer.observe(section));
    return()=>{observer.disconnect();if(resetCopy.current)clearTimeout(resetCopy.current);};
  },[]);
  useEffect(()=>{document.documentElement.classList.toggle('dark',dark);},[dark]);
  function toggleTheme(){const next=!dark;const apply=()=>{document.documentElement.classList.toggle('dark',next);document.documentElement.dataset.themePreference=next?'dark':'light';try{localStorage.setItem('umair-theme',next?'dark':'light');}catch{}window.dispatchEvent(new Event('umair-theme'));};if(motion&&typeof document.startViewTransition==='function'){const transition=document.startViewTransition(apply);void transition.ready.catch(()=>{});void transition.finished.catch(()=>{});}else apply();}
  async function copyEmail(){try{await navigator.clipboard.writeText(email);setCopied(true);setCopyError(false);if(resetCopy.current)clearTimeout(resetCopy.current);resetCopy.current=setTimeout(()=>setCopied(false),2500);}catch{setCopyError(true);}}

  return <div className="portfolio-root" data-motion={motion?'on':'off'}><a className="skip-link" href="#main">Skip to content</a><div className="ambient-background" aria-hidden="true"><span/><span/><span/></div><div className="scroll-progress" aria-hidden="true"><div ref={progressRef}/></div><nav className="chapter-rail" aria-label="Page chapters">{[{id:'work',label:'Work'},{id:'about',label:'About'},{id:'experience',label:'Journey'},{id:'toolkit',label:'Toolkit'},{id:'contact',label:'Connect'}].map((chapter,index)=><a key={chapter.id} href={`#${chapter.id}`} aria-current={activeSection===chapter.id?'location':undefined}><span>{String(index+1).padStart(2,'0')}</span><span>{chapter.label}</span></a>)}</nav><div className="page-shell">
    <header className="site-header"><a className="wordmark" href="#top" aria-label="Umair Zaman, back to top">UZ<span>✳</span><small>UMAIR ZAMAN</small></a><nav aria-label="Main navigation">{['work','about','contact'].map(id=><a key={id} href={`#${id}`} className={activeSection===id?'active':''}>{id[0].toUpperCase()+id.slice(1)}</a>)}</nav><button className="motion-button" aria-label={paused?'Resume animations':'Pause animations'} aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?<Play size={15}/>:<Pause size={15}/>}</button><button className="theme-button" aria-label={`Switch to ${dark?'light':'dark'} mode`} onClick={toggleTheme}>{dark?<Sun size={19}/>:<Moon size={19}/>}</button></header>
    <main id="main"><CinematicHero motion={motion} time={time}/><ExpertiseMarquee motion={motion}/>
    <section id="work" className="work-section"><SectionTitle number="01" title="Ideas into working systems." aside="SELECTED WORK / 01—05"/><WorkStory/></section>
    <section id="about" className="about-section"><SectionTitle number="02" title="Product roots. AI direction."/><div className="about-grid"><h3>I used to define<br/> what comes next.<br/> <span>Now I build it, too.</span></h3><div><p>Product management taught me to listen to teams, untangle a problem, and turn it into something worth building. That foundation still shapes every AI workflow I work on.</p><p>At The Binary Holdings, my work has evolved from managing products to automating the work around them. Today, within The Binary Labs, I connect agents, internal platforms, and intelligent workflows to real business needs.</p><p className="about-signature">I bring the context. I orchestrate the tools. I own the outcome.</p></div></div><BuildMethod/></section>
    <section id="experience" className="experience-section"><SectionTitle number="03" title="Every chapter, connected."/><CompanyLogos/><Accordion defaultValue={['labs']} className="experience-list">{experience.map((item,i)=><AccordionItem key={item.id} value={item.id} className="experience-item"><AccordionTrigger className="experience-trigger"><span className="experience-marker">{String(i+1).padStart(2,'0')}</span><span className="experience-body"><span className="experience-dates">{item.dates}</span><strong>{item.role}</strong><span className="experience-company">{item.company}</span></span></AccordionTrigger><AccordionContent className="experience-content"><p className="experience-note">{item.note}</p><ul>{item.items.map(line=><li key={line}>{line}</li>)}</ul></AccordionContent></AccordionItem>)}</Accordion></section>
    <section id="toolkit" className="toolkit-section"><SectionTitle number="04" title="The tools behind the work." aside="CONTEXT BEFORE CODE"/><Tabs defaultValue="ai" className="toolkit-tabs"><TabsList className="toolkit-list" aria-label="Areas of expertise">{toolkit.map(group=><TabsTrigger key={group.id} value={group.id}>{group.label}</TabsTrigger>)}</TabsList>{toolkit.map(group=><TabsContent key={group.id} value={group.id}><div className="skill-grid">{group.items.map(x=><span key={x}><group.icon size={15}/>{x}</span>)}</div><p className="skill-caption">{group.caption}</p></TabsContent>)}</Tabs><div className="education"><span className="eyebrow">FOUNDATIONS</span><div><strong>Bachelor of Computer Applications</strong><p>Cloud Technology & Information Security · Jain University · 2017–2020</p><p className="certifications">Product Management — Growth School<br/>Digital Marketing — Learn Digital Academy</p></div></div></section>
    <section id="contact" className="contact-section"><div className="contact-top"><span className="section-number">05 / LET’S CONNECT</span><ArrowUpRight size={36} strokeWidth={1.25}/></div><h2>Let’s build<br/>something useful<span className="accent-dot">?</span></h2><p>Let’s talk about AI, automation, or the product behind it.</p><div className="email-row"><a href={`mailto:${email}`}>{email}</a><button className="copy-button" onClick={copyEmail} aria-label="Copy email address">{copied?<Check size={18}/>:<Copy size={18}/>}</button></div><output className="copy-status" aria-live="polite">{copied?'Email copied.':copyError?'Select the email address to copy it, or click it to open your mail app.':''}</output><div className="social-links"><a href="https://www.linkedin.com/in/umairzama" target="_blank" rel="noreferrer"><ArrowUpRight size={17}/> LinkedIn <ArrowUpRight size={14}/></a><a href="https://github.com/umairzaman05" target="_blank" rel="noreferrer"><Code2 size={17}/> GitHub <ArrowUpRight size={14}/></a><a href={resume} download><Download size={17}/> Résumé <ArrowUpRight size={14}/></a></div></section>
    </main><footer className="site-footer"><span>© {new Date().getFullYear()} Md Umair Uz Zaman</span><a href="#top">Back to top <ArrowUpRight size={14}/></a><span>Bengaluru, India <span className="footer-dot">↗</span></span></footer>
  </div></div>;
}


