import React from 'react';
import Counters from './Counters.jsx';

function SoundIcon({ on = true }) {
  return on ? (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M3 10v4h4l5 4V6l-5 4H3z"/>
      <path fill="currentColor" d="M16.5 12a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" opacity=".6"/>
      <path fill="currentColor" d="M18.5 12a6.5 6.5 0 0 0-3.5-5.7v2.2a4.5 4.5 0 0 1 0 7v2.2a6.5 6.5 0 0 0 3.5-5.7z" opacity=".35"/>
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M3 10v4h4l5 4V6l-5 4H3z"/>
      <path fill="currentColor" d="M16 8l6 6m0-6l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function Header({ counts, onRestart, soundEnabled, onToggleSound }) {
  return (
    <header className="header">
      <div className="header__inner">
        <h1 className="title" aria-label="Geometry">Geometry</h1>
        <Counters counts={counts} />
        <div className="header__actions">
          <button
            className={`btn btn--round ${soundEnabled ? '' : 'is-muted'}`}
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Silenciar' : 'Activar sonido'}
            title={soundEnabled ? 'Silenciar' : 'Activar sonido'}
          >
            <SoundIcon on={soundEnabled} />
          </button>
          <button className="btn" onClick={onRestart} aria-label="Reiniciar">
            Reiniciar
          </button>
        </div>
      </div>
    </header>
  );
}

