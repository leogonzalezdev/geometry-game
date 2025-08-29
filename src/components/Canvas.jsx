import React from 'react';
import Shape from './Shape.jsx';

export default function Canvas({ shapes, leavingIds, onHit, onRemove }) {
  // Virtual canvas matches utils default (1000 x 700). It scales on screen.
  const viewBox = '0 0 1000 700';

  return (
    <section className="canvas" aria-label="Lienzo de figuras">
      <svg className="svg" viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
        {shapes.map((s) => (
          <Shape
            key={s.id}
            shape={s}
            isLeaving={leavingIds.has(s.id)}
            onHit={onHit}
            onRemove={onRemove}
          />
        ))}
      </svg>
    </section>
  );
}

