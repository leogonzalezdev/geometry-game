import React from 'react';
import Header from './components/Header.jsx';
import Canvas from './components/Canvas.jsx';
import GameOverModal from './components/GameOverModal.jsx';
import { useGameLogic } from './hooks/useGameLogic.js';
import { useSound } from './hooks/useSound.js';

export default function App() {
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
  } = useGameLogic();

  const gameFinished = isGameFinished();

  const { enabled: soundEnabled, toggle: toggleSound, playBeep } = useSound();

  const onHitWithSound = (id) => {
    playBeep();
    handleHit(id);
  };

  return (
    <div className="app">
      <Header
        counts={counts}
        onRestart={() => initGame()}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      <main className="main">
        <Canvas
          shapes={shapes}
          leavingIds={leavingIds}
          onHit={onHitWithSound}
          onRemove={handleRemove}
        />
      </main>

      {gameFinished && (
        <GameOverModal
          onRestart={() => initGame()}
        />
      )}
    </div>
  );
}
