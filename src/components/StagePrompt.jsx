import React from 'react';

function Icon({ type }) {
  const size = 22;
  const common = { width: size, height: size, 'aria-hidden': true };
  if (type === 'circle') {
    return (
      <svg {...common} viewBox="0 0 24 24" className="ico ico--circle"><circle cx="12" cy="12" r="9" /></svg>
    );
  }
  if (type === 'square') {
    return (
      <svg {...common} viewBox="0 0 24 24" className="ico ico--square"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
    );
  }
  return (
    <svg {...common} viewBox="0 0 24 24" className="ico ico--triangle"><polygon points="12,5 20,19 4,19" /></svg>
  );
}

const labels = { circle: 'círculos', square: 'cuadrados', triangle: 'triángulos' };

export default function StagePrompt({ targetType, remaining }) {
  return (
    <div className="stage" role="status" aria-live="polite">
      <span className="stage__text">Juntemos los {labels[targetType] || targetType}</span>
      <span className="stage__icon"><Icon type={targetType} /></span>
      <span className="stage__remain">({remaining} restantes)</span>
    </div>
  );
}

