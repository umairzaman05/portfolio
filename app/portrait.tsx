'use client';

import { useEffect, useRef, useState } from 'react';
import NextImage from 'next/image';
import { Switch } from '@/components/ui/switch';

// Small dead zone and hysteresis keep poses stable near the portrait's center.
function axisPose(value: number, previous: number) {
  if (Math.abs(value) < (previous === 0 ? 0.24 : 0.14)) return 0;
  return Math.sign(value);
}

export function Portrait({ motion }: { motion: boolean }) {
  const [shades, setShades] = useState(false);
  const [ready, setReady] = useState(false);
  const portrait = useRef<HTMLDivElement>(null);
  const pose = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let active = true;
    const image = new Image();
    image.onload = () => { if (active) setReady(true); };
    image.src = '/portraits/directions-clean.png';
    return () => { active = false; image.onload = null; };
  }, []);

  useEffect(() => {
    const element = portrait.current;
    if (!element) return;
    const render = (x: number, y: number) => {
      element.style.setProperty('--face-x', `${(x + 1 + (shades ? 3 : 0)) * 20}%`);
      element.style.setProperty('--face-y', `${(y + 1) * 50}%`);
    };
    const reset = () => { pose.current = { x: 0, y: 0 }; render(0, 0); };
    reset();
    if (!motion || !ready || !matchMedia('(pointer: fine)').matches) return;
    let frame = 0;
    let point = { x: 0, y: 0 };
    const update = () => {
      frame = 0;
      const box = element.getBoundingClientRect();
      if (box.bottom < 0 || box.top > innerHeight || document.hidden) return;
      const x = axisPose((point.x - box.left - box.width / 2) / Math.min(240, innerWidth * .3), pose.current.x);
      const y = axisPose((point.y - box.top - box.height / 2) / 190, pose.current.y);
      if (pose.current.x !== x || pose.current.y !== y) {
        pose.current = { x, y };
        render(x, y);
      }
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      point = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(update);
    };
    const leave = () => { cancelAnimationFrame(frame); frame = 0; reset(); };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('blur', leave);
    document.documentElement.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('blur', leave);
      document.documentElement.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', leave);
      leave();
    };
  }, [motion, ready, shades]);

  return <div className="portrait-wrap">
    <link rel="preload" as="image" href="/portraits/directions-clean.png" />
    <div className="portrait-stage" ref={portrait}>
      <div className="portrait-halo" aria-hidden="true" />
      <NextImage unoptimized src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E" className={`portrait-image ${ready ? 'portrait-loaded' : ''}`} alt={`Portrait of Umair Zaman${shades ? ' wearing sunglasses' : ''}`} width={210} height={210} />
    </div>
    <label className="portrait-controls" htmlFor="portrait-shades"><span>Shades</span><Switch id="portrait-shades" checked={shades} onCheckedChange={setShades} aria-label="Portrait sunglasses" disabled={!ready} /></label>
    <span className="portrait-caption">{motion ? 'MOVE YOUR CURSOR · SAY HELLO' : 'HELLO, I’M UMAIR'}</span>
  </div>;
}
