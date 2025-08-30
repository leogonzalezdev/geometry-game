import React from 'react';

function Icon({ type }) {
  const size = 28;
  const common = { width: size, height: size, 'aria-hidden': true };
  if (type === 'circle') return (<svg {...common} viewBox="0 0 24 24" className="ico ico--circle"><circle cx="12" cy="12" r="9" /></svg>);
  if (type === 'square') return (<svg {...common} viewBox="0 0 24 24" className="ico ico--square"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>);
  return (<svg {...common} viewBox="0 0 24 24" className="ico ico--triangle"><polygon points="12,5 20,19 4,19" /></svg>);
}

const labels = { circle: 'círculos', square: 'cuadrados', triangle: 'triángulos' };

export default function StartScreen({ onStart, targetType = 'square' }) {
  return (
    <div className="start__backdrop" role="presentation">
      <div className="start" role="dialog" aria-modal="true" aria-labelledby="start-title">
        <h2 id="start-title">Geometry</h2>
        <p className="start__instr">
          Juntemos los {labels[targetType] || targetType} <span className="start__icon"><Icon type={targetType} /></span>
        </p>
        <button className="btn" onClick={onStart} autoFocus>
          Jugar
        </button>
      </div>
    </div>
  );
}

