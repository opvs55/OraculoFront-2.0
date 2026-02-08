import { useCallback, useEffect, useRef, useState } from 'react';

export function useAutoHideHeader(enabled, delay = 3200) {
  const [isHidden, setIsHidden] = useState(false);
  const timeoutRef = useRef(null);

  const reveal = useCallback(() => {
    if (!enabled) {
      setIsHidden(false);
      return;
    }
    setIsHidden(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsHidden(true), delay);
  }, [enabled, delay]);

  useEffect(() => {
    if (!enabled) {
      setIsHidden(false);
      return;
    }
    reveal();
    const handleActivity = () => reveal();
    const scrollContainer = document.querySelector('main');
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('scroll', handleActivity, { passive: true });
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('focusin', handleActivity);
    scrollContainer?.addEventListener('scroll', handleActivity, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('focusin', handleActivity);
      scrollContainer?.removeEventListener('scroll', handleActivity);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [enabled, reveal]);

  return { isHidden, reveal };
}
