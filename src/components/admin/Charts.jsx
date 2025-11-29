import React, { useState, useEffect } from 'react';

// Animated horizontal SVG bar chart. Supports onBarClick(row) to allow interaction.
const BarChart = ({ data = [], labelKey = 'name', valueKey = 'count', heightPer = 34, labelWidth = 180, onBarClick }) => {
  const [animatedWidths, setAnimatedWidths] = useState([]);

  const max = data.length ? Math.max(...data.map(d => d[valueKey] || 0)) : 1;
  const viewWidth = 900;
  const chartWidth = viewWidth - labelWidth - 60;
  const height = data.length * heightPer + 20;

  useEffect(() => {
    // initialize to zeros
    setAnimatedWidths(new Array(data.length).fill(0));
    // animate to target widths in next tick
    const targets = data.map(d => (max > 0 ? ((d[valueKey] || 0) / max) * chartWidth : 0));
    const t = setTimeout(() => setAnimatedWidths(targets), 20);
    return () => clearTimeout(t);
  }, [data, chartWidth, max, valueKey]);

  return (
    <div className="bar-chart-wrap" style={{ width: '100%', overflow: 'auto' }}>
      <svg className="bar-chart" viewBox={`0 0 ${viewWidth} ${height}`} width="100%" height={height} role="img" aria-label="Bar chart">
        <defs>
          <linearGradient id="barGradient" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--primary-2)" />
          </linearGradient>
        </defs>
        {data.map((d, i) => {
          const y = 10 + i * heightPer;
          const value = d[valueKey] || 0;
          const barW = animatedWidths[i] ?? 0;
          const label = d[labelKey] || '';

          return (
            <g key={i} transform={`translate(0, ${y})`} style={{ cursor: onBarClick ? 'pointer' : 'default' }} onClick={() => onBarClick && onBarClick(d)} onKeyDown={() => onBarClick && onBarClick(d)} tabIndex={onBarClick ? 0 : -1} aria-label={`${label}: ${value}`}>
              <text x={10} y={heightPer / 2} alignmentBaseline="middle" className="bar-label">{label}</text>
              <rect x={labelWidth} y={6} rx={6} ry={6} width={chartWidth} height={heightPer - 12} fill="#f1f5f9" />
              <rect x={labelWidth} y={6} rx={6} ry={6} width={barW} height={heightPer - 12} className="bar-fill-svg" fill="url(#barGradient)" />
              <text x={labelWidth + chartWidth + 8} y={heightPer / 2} alignmentBaseline="middle" className="bar-value">{value}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default BarChart;
