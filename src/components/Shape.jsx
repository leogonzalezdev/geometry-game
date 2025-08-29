import React, { useCallback } from 'react';

export default function Shape({ shape, isLeaving, onHit, onRemove }) {
  const { id, type, x, y, size } = shape;

  const handleActivate = useCallback(() => {
    if (!isLeaving) onHit(id);
  }, [id, isLeaving, onHit]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleActivate();
    }
  };

  const onTransitionEnd = (e) => {
    if (isLeaving) onRemove(id);
  };

  const common = {
    role: 'button',
    tabIndex: 0,
    'aria-label': type === 'circle' ? 'Círculo' : type === 'square' ? 'Cuadrado' : 'Triángulo',
    className: `shape shape--${type}${isLeaving ? ' is-leaving' : ''}`,
    onKeyDown,
    onClick: handleActivate,
    onTransitionEnd,
    transform: `translate(${x}, ${y})`,
  };

  const half = size / 2;
  return (
    <g {...common}>
      {type === 'circle' && (
        <circle cx={half} cy={half} r={half - 1} className="shape__el" />
      )}
      {type === 'square' && (
        <rect x={1} y={1} width={size - 2} height={size - 2} rx={6} className="shape__el" />
      )}
      {type === 'triangle' && (
        <polygon
          className="shape__el"
          points={`${half},1 ${size - 1},${size - 1} 1,${size - 1}`}
        />
      )}
    </g>
  );
}
