import React from 'react';

export default function GameOverModal({ onRestart }) {
  return (
    <div className="modal__backdrop" role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="game-over-title">
        <h2 id="game-over-title">¡Bien hecho!</h2>
        <p>Has encontrado todas las figuras.</p>
        <button className="btn" onClick={onRestart} autoFocus>
          Jugar de nuevo
        </button>
      </div>
    </div>
  );
}

