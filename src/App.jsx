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
  const [toast, setToast] = React.useState(null);

  const onCorrect = (id) => {
    playBeep();
    handleHit(id);
    // if that was the last of this type, advance immediately
    const remainingAfter = (counts.remainingByType[targetType] || 0) - 1;
    if (remainingAfter === 0) {
      // show toast for next stage if exists
      advanceStage();
      setTimeout(() => {
        setToast(targetType === 'square' ? 'Ahora juntemos los círculos' : targetType === 'circle' ? 'Ahora juntemos los triángulos' : null);
        if (targetType !== 'triangle') {
          setTimeout(() => setToast(null), 1600);
        }
      }, 0);
    }
  };

  const onWrong = () => {
    playError();
  };

  const startGame = () => {
    if (!started) setStarted(true);
    // Use viewport size to spread shapes across available space
    const w = document.documentElement.clientWidth;
    const header = document.querySelector('.header');
    const headerH = header ? header.offsetHeight : 0;
    const h = Math.max(200, document.documentElement.clientHeight - headerH);
    initGame({ width: w, height: h });
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
        {toast && <StageToast text={toast} />}
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
