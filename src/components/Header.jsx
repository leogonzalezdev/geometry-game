import React from 'react';
import Counters from './Counters.jsx';

export default function Header({ counts, onRestart, soundEnabled, onToggleSound }) {
  return (
    <header className="header">
      <div className="header__inner">
        <h1 className="title" aria-label="Geometry">Geometry</h1>
        <Counters counts={counts} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className={`btn btn--round ${soundEnabled ? '' : 'is-muted'}`}
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Silenciar' : 'Activar sonido'}
            title={soundEnabled ? 'Silenciar' : 'Activar sonido'}
          >
            {soundEnabled ? '🔊' : '🔈'}
          </button>
          <button className="btn" onClick={onRestart} aria-label="Reiniciar">
            Reiniciar
          </button>
        </div>
      </div>
    </header>
  );
}
