import React from 'react';

export default function StartScreen({ onStart }) {
  return (
    <div className="start__backdrop" role="presentation">
      <div className="start" role="dialog" aria-modal="true" aria-labelledby="start-title">
        <h2 id="start-title">Geometry</h2>
        <p>¡Toca las figuras para acertar!</p>
        <button className="btn" onClick={onStart} autoFocus>
          Jugar
        </button>
      </div>
    </div>
  );
}

