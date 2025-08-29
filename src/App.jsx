import React from 'react';
import Header from './components/Header.jsx';
import Canvas from './components/Canvas.jsx';
import GameOverModal from './components/GameOverModal.jsx';
import StartScreen from './components/StartScreen.jsx';
import { useGameLogic } from './hooks/useGameLogic.js';
import { useSound } from './hooks/useSound.js';

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
  } = useGameLogic();

  const gameFinished = isGameFinished();

  const { enabled: soundEnabled, toggle: toggleSound, playBeep } = useSound();

  const onHitWithSound = (id) => {
    playBeep();
    handleHit(id);
  };

  const startGame = () => {
    if (!started) setStarted(true);
    initGame();
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
        <Canvas
          shapes={shapes}
          leavingIds={leavingIds}
          onHit={onHitWithSound}
          onRemove={handleRemove}
        />
      </main>

      {!started && (
        <StartScreen onStart={startGame} />
      )}

      {started && gameFinished && (
        <GameOverModal
          onRestart={startGame}
        />
      )}
    </div>
  );
}
