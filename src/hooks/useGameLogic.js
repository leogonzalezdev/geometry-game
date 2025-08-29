import { useCallback, useEffect, useMemo, useState } from 'react';
import { generateShapes, defaultConfig } from '../utils/random.js';

// Small helper to count remaining by type from current shapes
function countRemainingByType(shapes, leavingIds) {
  const counts = { circle: 0, square: 0, triangle: 0 };
  const leaving = leavingIds || new Set();
  for (const s of shapes) if (!leaving.has(s.id)) counts[s.type]++;
  return counts;
}

export function useGameLogic(initialConfig) {
  const [config, setConfig] = useState(() => ({ ...defaultConfig, ...(initialConfig || {}) }));
  const [shapes, setShapes] = useState([]);
  const [leavingIds, setLeavingIds] = useState(() => new Set());
  const [initialCountsByType, setInitialCountsByType] = useState({ circle: 0, square: 0, triangle: 0 });

  const initGame = useCallback((cfg) => {
    const nextCfg = { ...config, ...(cfg || {}) };
    setConfig(nextCfg);
    const newShapes = generateShapes(nextCfg);
    setShapes(newShapes);
    setLeavingIds(new Set());
    // snapshot initial totals by type
    const snapshot = { circle: 0, square: 0, triangle: 0 };
    for (const s of newShapes) snapshot[s.type]++;
    setInitialCountsByType(snapshot);
  }, [config]);

  // No auto init; the App controls when to start

  const remainingByType = useMemo(() => countRemainingByType(shapes, leavingIds), [shapes, leavingIds]);
  const totalRemaining = useMemo(() => remainingByType.circle + remainingByType.square + remainingByType.triangle, [remainingByType]);

  const hitByType = useMemo(() => ({
    circle: Math.max(0, initialCountsByType.circle - remainingByType.circle),
    square: Math.max(0, initialCountsByType.square - remainingByType.square),
    triangle: Math.max(0, initialCountsByType.triangle - remainingByType.triangle),
  }), [initialCountsByType, remainingByType]);

  const counts = useMemo(() => ({
    totalByType: initialCountsByType,
    hitByType,
    remainingByType,
    totalRemaining,
    totalHit: hitByType.circle + hitByType.square + hitByType.triangle,
  }), [initialCountsByType, hitByType, remainingByType, totalRemaining]);

  const handleHit = useCallback((id) => {
    // mark as leaving (excluded from remaining immediately)
    setShapes((prev) => {
      const shape = prev.find((s) => s.id === id);
      if (!shape) return prev;
      setLeavingIds((set) => new Set(set).add(id));
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
