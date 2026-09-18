'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowDown, ArrowUpRight, Download } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const chapters = [
  { label: 'The mindset', title: <>PRODUCT<br/><em>THINKER.</em></>, text: 'Start with people. Understand the problem. Build something that belongs in their day.', tag: '01 / UNDERSTAND' },
  { label: 'The craft', title: <>AI<br/><em>ENGINEER.</em></>, text: 'Connect agents, tools, and context. Turn a business need into a system that works.', tag: '02 / ORCHESTRATE' },
  { label: 'The outcome', title: <>USEFUL<br/><em>SYSTEMS.</em></>, text: 'From internal platforms to intelligent QA. Make the everyday work flow.', tag: '03 / DELIVER' },
];

export function CinematicHero({ motion, time }: { motion: boolean; time: string }) {
  const root = useRef<HTMLElement>(null);
  const [chapter, setChapter] = useState(0);
  const [portraitState, setPortraitState] = useState<'loading' | 'ready' | 'fallback'>('loading');
  const [portraitFailed, setPortraitFailed] = useState(false);

  useGSAP(() => {
    if (!root.current || !motion) return;
    const media = gsap.matchMedia();
    media.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      const scene = root.current!;
      gsap.timeline({ scrollTrigger: {
        trigger: scene, start: 'top top', end: 'bottom bottom', scrub: .7,
        onUpdate: self => { setChapter(Math.min(2, Math.floor(self.progress * 3))); scene.style.setProperty('--story-progress', String(self.progress)); },
      } })
        .to('.hero-portrait-scroll', { x: '+=45', y: 22, scale: 1.06, rotation: 2, ease: 'none' }, 0)
        .to('.hero-orbit', { rotation: 75, scale: 1.12, ease: 'none' }, 0)
        .to('.hero-ghost-name', { xPercent: -9, opacity: .035, ease: 'none' }, 0);

      const moveX = gsap.quickTo('.hero-portrait-pointer', 'x', { duration: .9, ease: 'power3.out' });
      const moveY = gsap.quickTo('.hero-portrait-pointer', 'y', { duration: .9, ease: 'power3.out' });
      const onMove = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return;
        const rect = scene.getBoundingClientRect();
        if (rect.bottom < 0) return;
        const x = event.clientX / innerWidth - .5;
        const y = event.clientY / innerHeight - .5;
        moveX(x * 18); moveY(y * 12);
        scene.style.setProperty('--spot-x', `${50 + x * 8}%`);
      };
      const reset = () => { moveX(0); moveY(0); };
      scene.addEventListener('pointermove', onMove, { passive: true });
      scene.addEventListener('pointerleave', reset);
      return () => { scene.removeEventListener('pointermove', onMove); scene.removeEventListener('pointerleave', reset); };
    });
    return () => media.revert();
  }, { scope: root, dependencies: [motion], revertOnUpdate: true });

  const active = motion ? chapter : 0;
  return <section ref={root} id="top" className="cinematic-hero" data-motion={motion ? 'on' : 'off'} aria-label="Introduction">
    <div className="hero-scene">
      <div className="hero-scene-top"><span><i /> BASED IN BENGALURU <span className="hero-local-time">{time} IST</span></span><span>INDEPENDENT MIND. CONNECTED WORK.</span></div>
      <div className="hero-ghost-name" aria-hidden="true">UMAIR ZAMAN</div>
      <div className="hero-spotlight" aria-hidden="true" />
      <div className="hero-orbit" aria-hidden="true"><span /><span /></div>
      <div className="hero-portrait-scroll"><div className="hero-portrait-pointer">
        <Image className={`hero-portrait-asset ${portraitState === 'loading' ? 'portrait-loading' : ''}`} src={portraitFailed ? '/portraits/original.jpeg' : '/portraits/hero-editorial.png'} alt="Umair Zaman" width={1086} height={1448} unoptimized priority onLoad={() => setPortraitState('ready')} onError={() => { setPortraitFailed(true); setPortraitState('fallback'); }} />
      </div></div>
      <div className="hero-editorial-copy">
        <p className="hero-eyebrow">HI, I’M UMAIR ZAMAN <span>↗</span></p>
        <h1><span className="sr-only">Umair Zaman — Generative AI engineer with a product mindset.</span><span key={active} className="hero-changing-title" aria-hidden="true">{chapters[active].title}</span></h1>
        <p className="hero-profession">Generative AI engineer.<br/>With a product mindset.</p>
      </div>
      <div className="hero-side-story"><span className="eyebrow">{chapters[active].tag}</span><p key={active}>{chapters[active].text}</p><span className="hero-role-tag"><span className="status-dot" /> THE BINARY HOLDINGS<br/><span className="labs-line">× THE BINARY LABS</span></span></div>
      <div className="hero-scene-bottom"><a href="#work" className="scroll-invitation"><span className="scroll-invitation-icon"><ArrowDown size={17} /></span><span>SCROLL TO EXPLORE<br/><small>A LITTLE HUMAN. A LITTLE AI.</small></span></a><div className="hero-cta-pair"><a href="#work" className="primary-action">Selected work <ArrowUpRight size={16}/></a><a className="quiet-action" href="/Md_Umair_Uz_Zaman_Resume.pdf" download>Résumé <Download size={15}/></a></div></div>
      <div className="hero-chapters" aria-hidden="true">{chapters.map((item,i)=><span className={active === i ? 'current' : ''} key={item.label}><b>0{i+1}</b> {item.label}</span>)}<i /></div>
    </div>
  </section>;
}

export function ExpertiseMarquee({ motion }: { motion: boolean }) {
  const words = ['AGENTIC AI', 'PRODUCT THINKING', 'WORKFLOW AUTOMATION', 'INTELLIGENT QA'];
  return <div className="expertise-marquee" data-motion={motion ? 'on' : 'off'} aria-label={words.join(', ')}><div aria-hidden="true">{[0,1].map(copy=><span key={copy}>{words.map(word=><span key={word}>{word}<i>✳</i></span>)}</span>)}</div></div>;
}
