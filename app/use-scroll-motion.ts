'use client';

import { useEffect, useRef } from 'react';

export function useScrollMotion(enabled: boolean) {
  const progressRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('.section-heading, .featured-project, .product-work, .about-grid, .experience-item, .toolkit-tabs, .education, .contact-top, .contact-section > h2, .contact-section > p, .email-row, .social-links, .site-footer'));
    const reset = () => targets.forEach(element => { element.classList.remove('reveal-pending'); element.style.removeProperty('--reveal-delay'); });
    let frame = 0;
    const update = () => {
      const available = document.documentElement.scrollHeight - innerHeight;
      const fraction = available > 0 ? Math.max(0, Math.min(1, scrollY / available)) : 0;
      progressRef.current?.style.setProperty('transform', `scaleX(${fraction})`);
      document.documentElement.style.setProperty('--page-progress', String(fraction));
      frame = 0;
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(); addEventListener('scroll', queue, { passive: true }); addEventListener('resize', queue);
    const sizeObserver = new ResizeObserver(queue); sizeObserver.observe(document.body);
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.featured-project, .product-work'));
    const illuminate = (event: PointerEvent) => {
      if (!enabled || event.pointerType === 'touch') return;
      const card=event.currentTarget as HTMLElement;const box=card.getBoundingClientRect();
      card.style.setProperty('--card-x', `${event.clientX-box.left}px`);card.style.setProperty('--card-y', `${event.clientY-box.top}px`);
    };
    if(enabled) cards.forEach(card=>card.addEventListener('pointermove',illuminate,{passive:true}));
    let observer: IntersectionObserver | undefined;
    const revealFocus = (event: FocusEvent) => { (event.target as HTMLElement)?.closest<HTMLElement>('.reveal-pending')?.classList.remove('reveal-pending'); };
    if (enabled) {
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.remove('reveal-pending'); entry.target.classList.add('is-revealed'); observer?.unobserve(entry.target); }
      }), { threshold: 0.05, rootMargin: '0px 0px -24px 0px' });
      targets.forEach((element, index) => {
        element.classList.add('scroll-reveal');
        if (element.getBoundingClientRect().top >= innerHeight - 24) {
          element.style.setProperty('--reveal-delay', `${index % 2 * 55}ms`);
          element.classList.add('reveal-pending'); observer?.observe(element);
        }
      });
      document.addEventListener('focusin', revealFocus);
    } else reset();
    return () => { reset(); observer?.disconnect(); sizeObserver.disconnect(); cancelAnimationFrame(frame); removeEventListener('scroll', queue); removeEventListener('resize', queue); document.removeEventListener('focusin', revealFocus); cards.forEach(card=>card.removeEventListener('pointermove',illuminate)); };
  }, [enabled]);
  return progressRef;
}
