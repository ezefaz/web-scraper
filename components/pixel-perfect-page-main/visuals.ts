export function waveBars(length: number, phase = 0) {
  return Array.from({ length }, (_, index) => {
    const value =
      (Math.sin(index * 0.52 + phase) +
        Math.sin(index * 0.17 + phase * 0.7) * 0.45 +
        1.45) /
      2.9;

    return Math.max(0.05, Math.min(0.95, value));
  });
}

export function pulseHeights(length: number, phase = 0) {
  return Array.from({ length }, (_, index) => {
    const value =
      (Math.cos(index * 0.9 + phase) +
        Math.sin(index * 0.31 + phase * 0.5) * 0.6 +
        1.6) /
      3.2;

    return Math.max(6, Math.round(6 + value * 14));
  });
}

