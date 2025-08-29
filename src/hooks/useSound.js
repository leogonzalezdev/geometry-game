import { useCallback, useEffect, useRef, useState } from 'react';

// Manages background loop and click beep. No external deps.
export function useSound({ bgSrc = '/assets/sound.mp3', beepSrc = '/assets/beep.mp3', initialEnabled = true, bgVolume = 0.25, beepVolume = 0.5 } = {}) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [needsUnlock, setNeedsUnlock] = useState(false);
  const bgRef = useRef(null);
  const unlockedRef = useRef(false);

  // lazy create to avoid constructing if never used
  const ensureBG = useCallback(() => {
    if (!bgRef.current) {
      const a = new Audio(bgSrc);
      a.loop = true;
      a.volume = bgVolume;
      bgRef.current = a;
    }
    return bgRef.current;
  }, [bgSrc, bgVolume]);

  const tryPlay = useCallback(async () => {
    const audio = ensureBG();
    if (!enabled) return;
    try {
      await audio.play();
      unlockedRef.current = true;
      setNeedsUnlock(false);
    } catch (e) {
      // Autoplay likely blocked; wait for user gesture
      setNeedsUnlock(true);
    }
  }, [enabled, ensureBG]);

  useEffect(() => {
    // Attempt to start on mount
    tryPlay();
  }, [tryPlay]);

  useEffect(() => {
    // If enabled toggles, play/pause background
    const audio = ensureBG();
    if (!audio) return;
    if (enabled) {
      tryPlay();
    } else {
      audio.pause();
    }
  }, [enabled, ensureBG, tryPlay]);

  useEffect(() => {
    if (!needsUnlock) return;
    const unlock = async () => {
      if (unlockedRef.current) return;
      try {
        await tryPlay();
      } catch {}
    };
    const onPointer = () => unlock();
    const onKey = () => unlock();
    window.addEventListener('pointerdown', onPointer, { once: true });
    window.addEventListener('keydown', onKey, { once: true });
    return () => {
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('keydown', onKey);
    };
  }, [needsUnlock, tryPlay]);

  const toggle = useCallback(() => setEnabled((v) => !v), []);

  const playBeep = useCallback(() => {
    if (!enabled) return;
    const a = new Audio(beepSrc);
    a.volume = beepVolume;
    // do not await to keep UI snappy
    a.play().catch(() => {});
  }, [enabled, beepSrc, beepVolume]);

  return { enabled, toggle, playBeep, needsUnlock };
}

