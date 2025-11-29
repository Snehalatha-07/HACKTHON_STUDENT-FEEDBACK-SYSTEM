import React from 'react';

// Simple sparkline SVG. Expects `values` array of numbers.
const Sparkline = ({ values = [], width = 120, height = 36, stroke = 'var(--primary-2)' }) => {
  if (!values || values.length === 0) {
    return <svg width={width} height={height} className="sparkline-empty" />;
  }

  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const len = values.length;
  const xStep = len > 1 ? (width - 6) / (len - 1) : 0;
  const points = values.map((v, i) => {
    const x = 3 + i * xStep;
    const y = height - 3 - ((v - min) / (max - min || 1)) * (height - 6);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="sparkline">
      <polyline points={points} fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default Sparkline;
