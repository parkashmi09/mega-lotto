import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

/**
 * useSmoothScroll Hook
 * Provides smooth scroll-to-top animation using GSAP when route changes.
 */
const useSmoothScroll = () => {
  const location = useLocation();
  const scrollTweenRef = useRef(null);

  useEffect(() => {
    if (scrollTweenRef.current) {
      scrollTweenRef.current.kill();
    }

    const currentScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (currentScroll > 0) {
      const scrollProxy = { value: currentScroll };

      scrollTweenRef.current = gsap.to(scrollProxy, {
        value: 0,
        duration: 0.8,
        ease: 'power2.out',
        onUpdate: () => {
          window.scrollTo(0, scrollProxy.value);
          document.documentElement.scrollTop = scrollProxy.value;
          document.body.scrollTop = scrollProxy.value;
        },
        onComplete: () => {
          window.scrollTo(0, 0);
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        },
      });
    } else {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }

    return () => {
      if (scrollTweenRef.current) {
        scrollTweenRef.current.kill();
      }
    };
  }, [location.pathname]);
};

export default useSmoothScroll;
