import React from 'react';

function Icon({ type }) {
  const size = 18;
  const common = { width: size, height: size, 'aria-hidden': true };
  if (type === 'circle') {
    return (
      <svg {...common} viewBox="0 0 24 24" className="ico ico--circle">
        <circle cx="12" cy="12" r="9" />
      </svg>
    );
  }
  if (type === 'square') {
    return (
      <svg {...common} viewBox="0 0 24 24" className="ico ico--square">
        <rect x="6" y="6" width="12" height="12" rx="2" />
      </svg>
    );
  }
  return (
    <svg {...common} viewBox="0 0 24 24" className="ico ico--triangle">
      <polygon points="12,5 20,19 4,19" />
    </svg>
  );
}

export default function Counters({ counts }) {
  const { remainingByType, hitByType, totalRemaining, totalHit } = counts;

  return (
    <div className="counters" aria-label="Contadores">
      {['circle', 'square', 'triangle'].map((t) => (
        <div className={`counter counter--${t}`} key={t} id={`counter-${t}`}>
          <Icon type={t} />
          <div className="counter__nums">
            <span className="counter__remain" title="Restantes">{remainingByType[t]}</span>
            <span className="counter__hit" title="Acertados">{hitByType[t]}</span>
          </div>
        </div>
      ))}
      <div className="counter total">
        <span className="total__label">Total</span>
        <div className="counter__nums">
          <span className="counter__remain" title="Restantes">{totalRemaining}</span>
          <span className="counter__hit" title="Acertados">{totalHit}</span>
        </div>
      </div>
    </div>
  );
}
