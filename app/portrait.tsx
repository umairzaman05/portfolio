'use client';

import { useEffect, useRef, useState } from 'react';
import NextImage from 'next/image';
import { Switch } from '@/components/ui/switch';

// Native vector display masks isolate each bust from the atlas artboard.
// Coordinates use one 296px cell; the original image remains untouched.
const outlines = [
  '148,43 189,38 224,53 249,79 258,109 251,140 236,167 225,204 207,233 214,251 278,276 278,293 25,293 25,282 123,250 124,233 108,217 102,192 104,166 109,143 110,112 119,78',
  '112,42 146,35 184,40 219,58 231,84 232,112 223,149 211,184 200,214 187,236 204,253 280,277 280,292 19,292 19,279 94,254 107,233 95,209 84,180 77,148 77,111 82,77',
  '128,47 164,41 199,45 224,60 232,88 234,121 247,150 246,179 226,207 208,236 217,250 278,274 278,292 17,292 17,278 102,250 112,225 91,194 80,151 79,107 91,75',
  '146,40 188,40 225,54 247,81 253,113 245,145 235,177 222,210 205,235 216,251 279,276 279,292 23,292 23,281 124,251 121,231 108,209 101,179 106,149 107,111 116,76',
  '114,39 151,34 193,41 224,62 233,87 231,121 224,158 209,192 195,222 190,239 207,255 278,277 278,292 17,292 17,278 104,251 107,232 94,208 85,180 78,148 78,110 86,76',
  '119,47 159,38 198,41 230,55 250,78 254,106 257,139 263,158 250,184 229,208 211,234 219,250 270,275 270,292 16,292 16,278 105,250 111,227 91,198 79,157 79,115 89,78',
  '139,28 181,23 220,36 243,62 250,95 243,127 229,162 212,199 208,225 277,254 277,272 25,272 25,258 116,226 117,207 101,185 97,163 100,140 110,117 108,87 117,52',
  '101,30 142,24 183,29 219,46 236,76 240,106 229,142 218,175 199,204 199,228 281,255 281,272 19,272 19,257 106,229 103,209 88,183 78,150 76,119 80,84 84,59',
  '126,28 165,22 205,31 231,55 239,86 238,117 255,141 253,163 238,186 218,211 216,230 278,254 278,272 16,272 16,257 104,230 111,208 95,178 83,142 80,107 88,68',
  '133,29 174,22 217,34 242,57 251,89 247,117 233,151 219,188 205,214 211,231 277,255 277,272 23,272 23,259 113,228 115,207 98,184 92,158 97,135 108,112 106,83 113,55',
  '107,28 146,24 187,29 224,47 238,78 241,109 230,143 217,180 198,209 202,229 278,255 278,272 20,272 20,257 107,229 106,211 91,184 82,149 79,117 84,82 89,59',
  '119,29 161,23 201,30 233,51 247,82 246,114 264,138 263,159 246,184 223,211 219,230 270,255 270,272 16,272 16,258 100,231 109,211 94,181 83,145 83,111 91,73',
  '123,14 162,11 202,24 229,48 239,80 236,112 222,145 210,177 207,209 218,236 277,254 277,264 24,264 24,253 121,222 118,204 97,183 88,159 83,135 93,107 94,69 104,37',
  '103,15 141,10 180,17 215,33 239,62 243,95 230,129 218,162 202,193 191,215 202,235 281,255 281,264 19,264 19,253 105,226 104,210 86,185 77,153 75,122 78,91 80,54',
  '126,15 169,10 210,22 237,44 247,72 241,107 252,133 251,155 235,181 215,207 213,231 278,254 278,264 17,264 17,253 108,226 111,205 94,177 80,139 77,104 86,67 96,39',
  '128,17 167,10 208,24 235,48 243,81 239,113 226,145 215,178 211,209 221,232 277,253 277,264 23,264 23,253 122,223 120,204 97,182 87,157 85,132 94,105 96,68 106,38',
  '111,16 151,10 191,17 224,37 245,68 246,99 234,130 221,167 203,196 198,216 211,235 277,255 277,264 19,264 19,253 112,226 109,210 92,185 82,155 79,123 83,89 87,55',
  '122,15 164,11 205,21 236,41 252,70 248,106 262,131 261,154 242,182 219,209 215,232 270,254 270,264 18,264 18,254 105,229 110,209 95,181 82,144 79,108 88,70 99,40',
];
function outline(index: number) {
  return `polygon(${outlines[index].split(' ').map(point => point.split(',').map(n => `${Number(n) / 296 * 100}%`).join(' ')).join(',')})`;
}

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
    image.src = '/portraits/directions.png';
    return () => { active = false; image.onload = null; };
  }, []);

  useEffect(() => {
    const element = portrait.current;
    if (!element) return;
    const render = (x: number, y: number) => {
      element.style.setProperty('--face-x', `${(x + 1 + (shades ? 3 : 0)) * 20}%`);
      element.style.setProperty('--face-y', `${(y + 1) * 50}%`);
      element.style.setProperty('--face-outline', outline((y + 1) * 6 + x + 1 + (shades ? 3 : 0)));
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
    <div className="portrait-stage" ref={portrait}>
      <div className="portrait-halo" aria-hidden="true" />
      <NextImage unoptimized src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E" className={`portrait-image ${ready ? 'portrait-loaded' : ''}`} alt={`Portrait of Umair Zaman${shades ? ' wearing sunglasses' : ''}`} width={210} height={210} />
    </div>
    <label className="portrait-controls" htmlFor="portrait-shades"><span>Shades</span><Switch id="portrait-shades" checked={shades} onCheckedChange={setShades} aria-label="Portrait sunglasses" disabled={!ready} /></label>
    <span className="portrait-caption">{motion ? 'A LITTLE HUMAN, A LITTLE AI' : 'HELLO, I’M UMAIR'}</span>
  </div>;
}
