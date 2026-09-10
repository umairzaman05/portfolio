'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowUpRight, ArrowDown, ArrowRight, Sun, Moon, Copy, Check, Download, MapPin, Layers3, Workflow, ScanEye, FileCheck2, Command, Code2, ChevronRight, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useScrollMotion } from './use-scroll-motion';
import { Portrait } from './portrait';

const email = 'mdumairzama@gmail.com';
const resume = '/Md_Umair_Uz_Zaman_Resume.pdf';
function themeSnapshot() { try { const saved=document.documentElement.dataset.themePreference||localStorage.getItem('umair-theme');return saved?saved==='dark':matchMedia('(prefers-color-scheme: dark)').matches; } catch { return document.documentElement.dataset.themePreference==='dark'; } }
function subscribeTheme(callback:()=>void) { const media=matchMedia('(prefers-color-scheme: dark)');media.addEventListener('change',callback);window.addEventListener('umair-theme',callback);return()=>{media.removeEventListener('change',callback);window.removeEventListener('umair-theme',callback);}; }
function motionSnapshot(){return !matchMedia('(prefers-reduced-motion: reduce)').matches;}
function subscribeMotion(callback:()=>void){const media=matchMedia('(prefers-reduced-motion: reduce)');media.addEventListener('change',callback);return()=>media.removeEventListener('change',callback);}
function clockSnapshot(){return new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit'}).format(new Date());}
function subscribeClock(callback:()=>void){const timer=setInterval(callback,1000);return()=>clearInterval(timer);}
const stages = [
  { id: 'orchestrate', icon: Workflow, label: 'Orchestrate', detail: 'Coordinate agentic workflows and queue regression runs across applications.', tools: 'AI orchestrator · Execution queue' },
  { id: 'execute', icon: Command, label: 'Execute', detail: 'Drive Android, iOS, and embedded web journeys through automated execution.', tools: 'Appium · Playwright · Android / iOS / PWA' },
  { id: 'observe', icon: ScanEye, label: 'Observe', detail: 'Collect visual evidence, video, network activity, and execution logs for analysis.', tools: 'Vision / OCR · Evidence engine · Network monitor' },
  { id: 'analyze', icon: FileCheck2, label: 'Analyze', detail: 'Connect failures to evidence, surface root-cause suggestions, and inform workflow learning.', tools: 'AI analysis · Reporting · RAG-based retrieval' },
];
const experience = [
  { id: 'labs', dates: 'JUL 2026 — PRESENT', role: 'AI Engineer', company: 'The Binary Labs', note: 'AI-focused division of The Binary Holdings', items: ['Designing AI-powered automation, internal enterprise workflows, and LLM-enabled applications.', 'Driving the design of WaveGuard, from agent orchestration and automated execution to evidence collection and AI-assisted failure analysis.', 'Working across Product, QA, Engineering, and DevOps to turn operational requirements into cloud-ready solutions.'] },
  { id: 'binary', dates: 'NOV 2022 — JUN 2026', role: 'Associate Product Manager', company: 'The Binary Holdings', note: 'Product strategy, delivery, and iteration', items: ['Led the product lifecycle for Fando, Spin It, BNRY Mart, ngage, BNRY Games, and UPlay.', 'Owned requirements, prioritization, stakeholder alignment, and cross-functional execution.', 'Used experimentation and analytics to guide engagement improvements and product decisions.'] },
  { id: 'lulu', dates: 'APR 2021 — SEP 2022', role: 'Product Analyst', company: 'Lulu Group International', note: 'Research, analytics, and product optimization', items: ["Supported Lulu India’s online platform through user research, analytics, and KPI tracking.", 'Identified opportunities to improve checkout workflows and operational efficiency.'] },
];
const toolkit = [
  {id:'ai',label:'AI & orchestration',icon:Sparkles,items:['OpenAI','Claude','Gemini','LangGraph','LangChain','n8n','Prompt engineering','Agentic workflows','RAG concepts'],caption:'Designing prompts, coordinating agents, and connecting models to useful workflows.'},
  {id:'engineering',label:'Engineering & QA',icon:Code2,items:['Python · working knowledge','FastAPI · working knowledge','SQL','REST APIs','Playwright','Appium','Docker','Git','Google Cloud Run','PostgreSQL','Redis','Vision / OCR'],caption:'AI-assisted development, evidence-driven testing, and cloud-ready architecture.'},
  {id:'product',label:'Product & delivery',icon:Layers3,items:['Product strategy','Requirements','Agile delivery','Stakeholder management','System design','Workflow design','Prioritization','Product analytics'],caption:'Connecting business context to clear requirements and cross-functional delivery.'},
];

function SectionTitle({ number, title, aside }: {number: string; title: string; aside?: string}) {
  return <div className="section-heading"><div><span className="section-number">{number}</span><h2>{title}</h2></div>{aside && <span className="section-aside">{aside}</span>}</div>;
}
function ProjectDetail() {
  return <Dialog><DialogTrigger className="text-action">Explore the project <ArrowUpRight size={17}/></DialogTrigger>
    <DialogContent className="project-dialog"><span className="eyebrow">SELECTED WORK / 01</span><DialogTitle className="dialog-title">WaveGuard<span className="accent-dot">.</span></DialogTitle><DialogDescription className="dialog-intro">An internal enterprise platform for AI-powered quality engineering across mobile and web applications.</DialogDescription>
      <div className="dialog-tags"><span>AI engineering</span><span>Quality automation</span><span>Platform design</span></div>
      <div className="case-section"><h3>The challenge</h3><p>Repetitive manual regression testing across white-label applications embedded in multiple Telco apps. The platform is designed to make that validation scalable, evidence-driven, and continuously improving.</p></div>
      <div className="case-section"><h3>My contribution</h3><p>I drive the platform’s design and define intelligent QA workflows: execution, navigation, vision, transaction validation, evidence capture, network observation, failure analysis, and reporting.</p></div>
      <div className="case-section"><h3>System architecture</h3><div className="case-flow">AI orchestrator <ArrowRight size={16}/> Execution queue <ArrowRight size={16}/> Appium / Playwright <ArrowRight size={16}/> Evidence & analysis</div><p>PostgreSQL, Redis, and cloud storage support the architecture. Vision/OCR, root-cause suggestions, RAG-based retrieval, self-healing locators, and workflow learning are part of the design.</p></div>
      <div className="case-section"><h3>Scope</h3><p>Android, iOS, and PWA journeys; cloud, local, and emulator execution; parallel testing; video and screenshot evidence; reporting, historical analytics, scheduling, and continuous monitoring.</p></div>
      <div className="case-note"><Layers3 size={18}/><span>Internal enterprise work · Architecture and scope overview</span></div>
    </DialogContent></Dialog>;
}

export default function Home() {
  const dark=useSyncExternalStore(subscribeTheme,themeSnapshot,()=>false);
  const motion=useSyncExternalStore(subscribeMotion,motionSnapshot,()=>false);
  const time=useSyncExternalStore(subscribeClock,clockSnapshot,()=>'IST');
  const progressRef=useScrollMotion(motion);
  const [copied,setCopied]=useState(false),[copyError,setCopyError]=useState(false),[activeSection,setActiveSection]=useState('work');
  const resetCopy=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)setActiveSection(entry.target.id);},{rootMargin:'-15% 0px -55% 0px'});document.querySelectorAll('section[id]').forEach(section=>observer.observe(section));
    return()=>{observer.disconnect();if(resetCopy.current)clearTimeout(resetCopy.current);};
  },[]);
  useEffect(()=>{document.documentElement.classList.toggle('dark',dark);},[dark]);
  function toggleTheme(){const next=!dark;const apply=()=>{document.documentElement.classList.toggle('dark',next);document.documentElement.dataset.themePreference=next?'dark':'light';try{localStorage.setItem('umair-theme',next?'dark':'light');}catch{}window.dispatchEvent(new Event('umair-theme'));};const doc=document as Document&{startViewTransition?:(fn:()=>void)=>unknown};if(motion&&doc.startViewTransition)doc.startViewTransition(apply);else apply();}
  async function copyEmail(){try{await navigator.clipboard.writeText(email);setCopied(true);setCopyError(false);if(resetCopy.current)clearTimeout(resetCopy.current);resetCopy.current=setTimeout(()=>setCopied(false),2500);}catch{setCopyError(true);}}

  return <><a className="skip-link" href="#main">Skip to content</a><div className="ambient-background" aria-hidden="true"><span/><span/><span/></div><div className="scroll-progress" aria-hidden="true"><div ref={progressRef}/></div><nav className="chapter-rail" aria-label="Page chapters">{[{id:'work',label:'Work'},{id:'about',label:'About'},{id:'experience',label:'Journey'},{id:'toolkit',label:'Toolkit'},{id:'contact',label:'Connect'}].map((chapter,index)=><a key={chapter.id} href={`#${chapter.id}`} aria-current={activeSection===chapter.id?'location':undefined}><span>{String(index+1).padStart(2,'0')}</span><span>{chapter.label}</span></a>)}</nav><div className="page-shell">
    <header className="site-header"><a className="wordmark" href="#top" aria-label="Umair Zaman, back to top">uz<span>✳</span></a><nav aria-label="Main navigation">{['work','about','contact'].map(id=><a key={id} href={`#${id}`} className={activeSection===id?'active':''}>{id[0].toUpperCase()+id.slice(1)}</a>)}</nav><button className="theme-button" aria-label={`Switch to ${dark?'light':'dark'} mode`} onClick={toggleTheme}>{dark?<Sun size={19}/>:<Moon size={19}/>}</button></header>
    <main id="main"><section id="top" className="hero">
      <div className="hero-topline"><span className="location"><MapPin size={13}/> Bengaluru, India <span className="clock">{time}</span></span><span className="edition">PORTFOLIO / 2026</span></div>
      <div className="hero-intro"><div className="hero-copy"><p className="greeting">Hi, I’m</p><h1>Umair Zaman<span className="accent-dot">.</span></h1><p className="hero-role">Generative AI engineer,<br/><span>with a product mindset.</span></p></div><Portrait motion={motion}/></div>
      <p className="hero-description">I turn operational problems into practical AI systems. My work connects agents, automation, and product thinking—from the first workflow to the evidence that it works.</p><div className="current-role"><span className="status-dot"/><span>Currently building at <strong>The Binary Labs</strong></span></div><div className="hero-actions"><a href="#work" className="primary-action">Explore my work <ArrowDown size={16}/></a><a href={resume} download className="quiet-action">Download résumé <Download size={16}/></a></div><div className="hero-footnote"><span>AGENTIC AI</span><span>WORKFLOW AUTOMATION</span><span>INTELLIGENT QA</span></div>
    </section>
    <section id="work" className="work-section"><SectionTitle number="01" title="Selected work" aside="From intent to execution"/>
      <article className="featured-project"><div className="project-heading"><div className="project-logo"><Layers3 size={21}/></div><div><h3>WaveGuard</h3><p>AI-powered quality engineering</p></div><span className="project-badge">FEATURED PROJECT</span></div>
        <Tabs defaultValue="orchestrate" className="architecture"><div className="architecture-caption"><span>SYSTEM OVERVIEW</span><span className="architecture-hint">Select a stage to explore <ArrowDown size={12}/></span></div><TabsList className="pipeline" aria-label="WaveGuard workflow stages">{stages.map((stage,i)=><TabsTrigger value={stage.id} key={stage.id} className="pipeline-step"><span className="step-top"><span className="step-number">0{i+1}</span><stage.icon size={20}/></span><span>{stage.label}</span>{i<3&&<ChevronRight className="step-arrow" size={14}/>}</TabsTrigger>)}</TabsList>{stages.map(stage=><TabsContent key={stage.id} value={stage.id} className="stage-description"><p>{stage.detail}</p><span>{stage.tools}</span></TabsContent>)}</Tabs>
        <div className="project-footer"><p>Making regression testing more intelligent,<br className="desktop-br"/> observable, and repeatable.</p><ProjectDetail/></div>
      </article>
      <article className="product-work"><div className="product-work-icon"><Layers3 size={24}/></div><div><span className="eyebrow">THE PRODUCT FOUNDATION</span><h3>From roadmaps to real products.</h3><p>Product lifecycle ownership across Fando, Spin It, BNRY Mart, ngage, BNRY Games, and UPlay at The Binary Holdings.</p><a className="text-action" href="#experience">See the experience <ArrowUpRight size={16}/></a></div><span className="product-years">2022<br/><span>—</span><br/>2026</span></article>
    </section>
    <section id="about" className="about-section"><SectionTitle number="02" title="A little context"/><div className="about-grid"><h3>Good systems start<br/> with the right<br/> <span>problem.</span></h3><div><p>I came to AI engineering through product management. Years spent translating business needs into roadmaps, requirements, and delivered products shaped how I approach systems today.</p><p>At The Binary Labs, I design agentic workflows and build AI-assisted solutions for practical enterprise use cases. I care about how a system is orchestrated, how it’s validated, and how it fits the people using it.</p><p className="about-signature">Product thinking. Engineering curiosity.</p></div></div></section>
    <section id="experience" className="experience-section"><SectionTitle number="03" title="The journey so far"/><Accordion defaultValue={['labs']} className="experience-list">{experience.map((item,i)=><AccordionItem key={item.id} value={item.id} className="experience-item"><AccordionTrigger className="experience-trigger"><span className="experience-marker">{String(i+1).padStart(2,'0')}</span><span className="experience-body"><span className="experience-dates">{item.dates}</span><strong>{item.role}</strong><span className="experience-company">{item.company}</span></span></AccordionTrigger><AccordionContent className="experience-content"><p className="experience-note">{item.note}</p><ul>{item.items.map(line=><li key={line}>{line}</li>)}</ul></AccordionContent></AccordionItem>)}</Accordion></section>
    <section id="toolkit" className="toolkit-section"><SectionTitle number="04" title="What I work with" aside="Tools in service of the problem"/><Tabs defaultValue="ai" className="toolkit-tabs"><TabsList className="toolkit-list" aria-label="Areas of expertise">{toolkit.map(group=><TabsTrigger key={group.id} value={group.id}>{group.label}</TabsTrigger>)}</TabsList>{toolkit.map(group=><TabsContent key={group.id} value={group.id}><div className="skill-grid">{group.items.map(x=><span key={x}><group.icon size={15}/>{x}</span>)}</div><p className="skill-caption">{group.caption}</p></TabsContent>)}</Tabs><div className="education"><span className="eyebrow">FOUNDATIONS</span><div><strong>Bachelor of Computer Applications</strong><p>Cloud Technology & Information Security · Jain University · 2017–2020</p><p className="certifications">Product Management — Growth School<br/>Digital Marketing — Learn Digital Academy</p></div></div></section>
    <section id="contact" className="contact-section"><div className="contact-top"><span className="section-number">05 / LET’S CONNECT</span><ArrowUpRight size={36} strokeWidth={1.25}/></div><h2>Have a useful problem<br/>in mind<span className="accent-dot">?</span></h2><p>Let’s talk about AI, automation, or the product behind it.</p><div className="email-row"><a href={`mailto:${email}`}>{email}</a><button className="copy-button" onClick={copyEmail} aria-label="Copy email address">{copied?<Check size={18}/>:<Copy size={18}/>}</button></div><output className="copy-status" aria-live="polite">{copied?'Email copied.':copyError?'Select the email address to copy it, or click it to open your mail app.':''}</output><div className="social-links"><a href="https://www.linkedin.com/in/umairzama" target="_blank" rel="noreferrer"><ArrowUpRight size={17}/> LinkedIn <ArrowUpRight size={14}/></a><a href="https://github.com/umairzaman05" target="_blank" rel="noreferrer"><Code2 size={17}/> GitHub <ArrowUpRight size={14}/></a><a href={resume} download><Download size={17}/> Résumé <ArrowUpRight size={14}/></a></div></section>
    </main><footer className="site-footer"><span>© {new Date().getFullYear()} Md Umair Uz Zaman</span><a href="#top">Back to top <ArrowUpRight size={14}/></a><span>Bengaluru, India <span className="footer-dot">↗</span></span></footer>
  </div></>;
}


