import React from 'react';
import Header from './components/Header.jsx';
import Canvas from './components/Canvas.jsx';
import GameOverModal from './components/GameOverModal.jsx';
import StartScreen from './components/StartScreen.jsx';
import { useGameLogic } from './hooks/useGameLogic.js';
import { useSound } from './hooks/useSound.js';
import StagePrompt from './components/StagePrompt.jsx';
import StageToast from './components/StageToast.jsx';

export default function App() {
  const [started, setStarted] = React.useState(false);
  const {
    shapes,
    leavingIds,
    counts,
    initGame,
    handleHit,
    handleRemove,
    isGameFinished,
    config,
    setConfig,
    targetType,
    advanceStage,
  } = useGameLogic();

  const gameFinished = isGameFinished();

  const { enabled: soundEnabled, toggle: toggleSound, playBeep, playError } = useSound();
  const [toast, setToast] = React.useState(null); // { type }

  const onCorrect = (id) => {
    playBeep();
    handleHit(id);
    // if that was the last of this type, advance immediately and show big toast
    const remainingAfter = (counts.remainingByType[targetType] || 0) - 1;
    if (remainingAfter === 0) {
      const nextType = targetType === 'square' ? 'circle' : targetType === 'circle' ? 'triangle' : null;
      if (nextType) {
        advanceStage();
        setToast({ type: nextType });
        setTimeout(() => setToast(null), 2000);
      }
    }
  };

  const onWrong = () => {
    playError();
  };

  const startGame = () => {
    if (!started) setStarted(true);
    // Use viewport size to spread shapes across available space and scale totals
    const w = document.documentElement.clientWidth;
    const header = document.querySelector('.header');
    const headerH = header ? header.offsetHeight : 0;
    const h = Math.max(200, document.documentElement.clientHeight - headerH);
    const area = Math.max(1, w * h);
    const base = Math.max(24, Math.min(70, Math.round(area / 25000))); // scale with screen
    initGame({ width: w, height: h, totalMin: base, totalMax: base + 8, sizeMin: 48, sizeMax: 120 });
  };

  return (
    <div className="app">
      <Header
        counts={counts}
        onRestart={startGame}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      <main className="main">
        <StagePrompt targetType={targetType} remaining={counts.remainingByType[targetType]} />
        <Canvas
          shapes={shapes}
          leavingIds={leavingIds}
          onCorrect={onCorrect}
          onWrong={onWrong}
          targetType={targetType}
          onRemove={handleRemove}
          viewBox={`0 0 ${config.width} ${config.height}`}
        />
        {toast && <StageToast targetType={toast.type} />}
      </main>

      {!started && (
        <StartScreen onStart={startGame} targetType={targetType} />
      )}

      {started && gameFinished && (
        <GameOverModal
          onRestart={startGame}
        />
      )}
    </div>
  );
}
