/**
 * useScreenSize – responsive breakpoints (mobile / tablet / desktop).
 * Aligns with CSS: --breakpoint-sm 949px, --breakpoint-lg 1331px.
 * Updates smoothly on resize (throttled).
 */
import { useState, useEffect, useMemo } from 'react';

const BREAKPOINT_SM = 949;
const BREAKPOINT_LG = 1331;

const THROTTLE_MS = 100;

function getSize() {
  return {
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  };
}

function getBreakpoint(width) {
  if (width < BREAKPOINT_SM) return 'mobile';
  if (width < BREAKPOINT_LG) return 'tablet';
  return 'desktop';
}

export function useScreenSize() {
  const [size, setSize] = useState(getSize);

  useEffect(() => {
    let rafId = null;
    let lastRun = 0;

    function update() {
      const now = Date.now();
      if (now - lastRun < THROTTLE_MS) {
        rafId = requestAnimationFrame(update);
        return;
      }
      lastRun = now;
      setSize(getSize());
    }

    function onResize() {
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    }

    setSize(getSize());
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  return useMemo(() => {
    const breakpoint = getBreakpoint(size.width);
    return {
      width: size.width,
      height: size.height,
      breakpoint,
      isMobile: breakpoint === 'mobile',
      isTablet: breakpoint === 'tablet',
      isDesktop: breakpoint === 'desktop',
    };
  }, [size.width, size.height]);
}

export default useScreenSize;
