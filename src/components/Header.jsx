import React from 'react';
import Counters from './Counters.jsx';

export default function Header({ counts, onRestart }) {
  return (
    <header className="header">
      <div className="header__inner">
        <h1 className="title" aria-label="Figuras">Figuras</h1>
        <Counters counts={counts} />
        <button className="btn" onClick={onRestart} aria-label="Reiniciar">
          Reiniciar
        </button>
      </div>
    </header>
  );
}

