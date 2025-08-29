import React from 'react';
import Header from './components/Header.jsx';
import Canvas from './components/Canvas.jsx';
import GameOverModal from './components/GameOverModal.jsx';
import { useGameLogic } from './hooks/useGameLogic.js';

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

  return (
    <div className="app">
      <Header
        counts={counts}
        onRestart={() => initGame()}
      />

      <main className="main">
        <Canvas
          shapes={shapes}
          leavingIds={leavingIds}
          onHit={handleHit}
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

