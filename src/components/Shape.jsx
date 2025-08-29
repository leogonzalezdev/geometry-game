import React, { useCallback, useRef, useState } from 'react';

export default function Shape({ shape, isLeaving, onHit, onRemove }) {
  const { id, type, x, y, size } = shape;
  const ref = useRef(null);
  const [fly, setFly] = useState({ dx: 0, dy: 0 });

  const handleActivate = useCallback(() => {
    if (isLeaving) return;
    // Compute delta in screen pixels from shape center to counter center
    const el = ref.current;
    const anchorId = `counter-anchor-${type}`;
    const fallbackCounterId = `counter-${type}`;
    const anchor = document.getElementById(anchorId) || document.getElementById(fallbackCounterId);
    if (el && anchor) {
      const a = el.getBoundingClientRect();
      const b = anchor.getBoundingClientRect();
      const ax = a.left + a.width / 2;
      const ay = a.top + a.height / 2;
      const bx = b.left + b.width / 2;
      const by = b.top + b.height / 2;
      setFly({ dx: bx - ax, dy: by - ay });
      // brief pulse on the target counter container for feedback
      const counterEl = anchor.closest ? anchor.closest('.counter') : null;
      const pulseEl = counterEl || document.getElementById(fallbackCounterId) || anchor;
      pulseEl.classList.remove('counter--pulse');
      // force reflow to restart animation if already applied
      void pulseEl.offsetWidth;
      pulseEl.classList.add('counter--pulse');
      setTimeout(() => pulseEl.classList.remove('counter--pulse'), 360);
    }
    onHit(id);
  }, [id, isLeaving, onHit, type]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleActivate();
    }
  };

  const onTransitionEnd = (e) => {
    if (!isLeaving) return;
    // Only remove after the movement/opacity transition on the group ends
    if (e.target === ref.current && (e.propertyName === 'transform' || e.propertyName === 'opacity')) {
      onRemove(id);
    }
  };

  const common = {
    role: 'button',
    tabIndex: 0,
    'aria-label': type === 'circle' ? 'Círculo' : type === 'square' ? 'Cuadrado' : 'Triángulo',
    className: `shape shape--${type}${isLeaving ? ' is-leaving' : ''}`,
    onKeyDown,
    onClick: handleActivate,
    transform: `translate(${x}, ${y})`, // base position via attribute
    ref,
  };

  const half = size / 2;
  return (
    <g {...common}>
      <g
        className="shape__anim"
        onTransitionEnd={onTransitionEnd}
        style={{ '--dx': `${fly.dx}px`, '--dy': `${fly.dy}px` }}
      >
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
    </g>
  );
}
