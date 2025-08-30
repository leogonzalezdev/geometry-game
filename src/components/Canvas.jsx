import React from 'react';
import Shape from './Shape.jsx';

export default function Canvas({ shapes, leavingIds, onCorrect, onWrong, targetType, onRemove, viewBox }) {

  return (
    <section className="canvas" aria-label="Lienzo de figuras">
      <svg className="svg" viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
        {shapes.map((s) => (
          <Shape
            key={s.id}
            shape={s}
            isLeaving={leavingIds.has(s.id)}
            onCorrect={onCorrect}
            onWrong={onWrong}
            targetType={targetType}
            onRemove={onRemove}
          />
        ))}
      </svg>
    </section>
  );
}
