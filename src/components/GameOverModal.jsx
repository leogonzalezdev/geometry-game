import React from 'react';

export default function GameOverModal({ onRestart }) {
  return (
    <div className="modal__backdrop" role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="game-over-title">
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 28 }).map((_, i) => (
            <span className="confetti__piece" key={i} />
          ))}
        </div>
        <h2 id="game-over-title">¡Bien hecho!</h2>
        <p>Has encontrado todas las figuras.</p>
        <button className="btn" onClick={onRestart} autoFocus>
          Jugar de nuevo
        </button>
      </div>
    </div>
  );
}
