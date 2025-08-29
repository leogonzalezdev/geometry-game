import { useCallback, useEffect, useMemo, useState } from 'react';
import { generateShapes, defaultConfig } from '../utils/random.js';

// Small helper to count remaining by type from current shapes
function countByType(shapes) {
  const counts = { circle: 0, square: 0, triangle: 0 };
  for (const s of shapes) counts[s.type]++;
  return counts;
}

export function useGameLogic(initialConfig) {
  const [config, setConfig] = useState(() => ({ ...defaultConfig, ...(initialConfig || {}) }));
  const [shapes, setShapes] = useState([]);
  const [leavingIds, setLeavingIds] = useState(() => new Set());
  const [hitByType, setHitByType] = useState({ circle: 0, square: 0, triangle: 0 });

  const initGame = useCallback((cfg) => {
    const nextCfg = { ...config, ...(cfg || {}) };
    setConfig(nextCfg);
    const newShapes = generateShapes(nextCfg);
    setShapes(newShapes);
    setLeavingIds(new Set());
    setHitByType({ circle: 0, square: 0, triangle: 0 });
  }, [config]);

  useEffect(() => {
    // Init on mount
    initGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remainingByType = useMemo(() => countByType(shapes), [shapes]);
  const totalRemaining = useMemo(() => shapes.length, [shapes]);

  const counts = useMemo(() => ({
    totalByType: {
      circle: remainingByType.circle + hitByType.circle,
      square: remainingByType.square + hitByType.square,
      triangle: remainingByType.triangle + hitByType.triangle,
    },
    hitByType,
    remainingByType,
    totalRemaining,
    totalHit: hitByType.circle + hitByType.square + hitByType.triangle,
  }), [remainingByType, totalRemaining, hitByType]);

  const handleHit = useCallback((id) => {
    // prevent double hit or re-hit of leaving shape
    setShapes((prev) => {
      const shape = prev.find((s) => s.id === id);
      if (!shape) return prev;
      setLeavingIds((set) => new Set(set).add(id));
      setHitByType((old) => ({ ...old, [shape.type]: old[shape.type] + 1 }));
      return prev;
    });
  }, []);

  const handleRemove = useCallback((id) => {
    setShapes((prev) => prev.filter((s) => s.id !== id));
    setLeavingIds((set) => {
      const next = new Set(set);
      next.delete(id);
      return next;
    });
  }, []);

  const isGameFinished = useCallback(() => totalRemaining === 0, [totalRemaining]);

  return {
    shapes,
    leavingIds,
    counts,
    initGame,
    handleHit,
    handleRemove,
    isGameFinished,
    config,
    setConfig,
  };
}

