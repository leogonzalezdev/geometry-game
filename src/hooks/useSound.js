import { useCallback, useEffect, useRef, useState } from 'react';
import bgUrl from '../assets/sound.mp3';
import beepUrl from '../assets/beep.wav';

// Manages background loop and click beep. No external deps.
export function useSound({ bgSrc = bgUrl, beepSrc = beepUrl, initialEnabled = true, bgVolume = 0.25, beepVolume = 0.5 } = {}) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [needsUnlock, setNeedsUnlock] = useState(false);
  const bgRef = useRef(null);
  const unlockedRef = useRef(false);
  const audioCtxRef = useRef(null);

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

  const playError = useCallback(() => {
    if (!enabled) return;
    try {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new Ctx();
      }
      const ctx = audioCtxRef.current;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'square';
      // downward chirp for error
      o.frequency.setValueAtTime(320, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.18);
      g.gain.setValueAtTime(0.001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.24);
    } catch {}
  }, [enabled]);

  return { enabled, toggle, playBeep, playError, needsUnlock };
}
