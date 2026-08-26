import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets scroll on navigation. Without this, arriving from the bottom of a long
 * page (e.g. the home footer) leaves the next route scrolled past its content.
 * The resize event nudges GSAP ScrollTrigger, which caches page height for the
 * footer reveal and would otherwise keep the previous route's measurements.
 */
export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    if (hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    const raf = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      window.dispatchEvent(new Event('resize'));
    });

    return () => window.cancelAnimationFrame(raf);
  }, [pathname, hash]);

  return null;
};
