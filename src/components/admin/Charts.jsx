import React from 'react';

// Simple horizontal SVG bar chart
export const BarChart = ({ data = [], labelKey = 'name', valueKey = 'count', heightPer = 34, labelWidth = 180 }) => {
  const max = data.length ? Math.max(...data.map(d => d[valueKey] || 0)) : 1;
  const viewWidth = 800; // svg coordinate system width
  const chartWidth = viewWidth - labelWidth - 40; // leave space for label and right padding
  const height = data.length * heightPer + 20;

  return (
    <svg className="bar-chart" viewBox={`0 0 ${viewWidth} ${height}`} width="100%" height={height} role="img" aria-label="Bar chart">
      {data.map((d, i) => {
        const y = 10 + i * heightPer;
        const value = d[valueKey] || 0;
        const barW = max > 0 ? (value / max) * chartWidth : 0;
        const label = d[labelKey] || '';

        return (
          <g key={i} transform={`translate(0, ${y})`}>
            <text x={10} y={heightPer / 2} alignmentBaseline="middle" className="bar-label">{label}</text>
            <rect x={labelWidth} y={6} rx={6} ry={6} width={chartWidth} height={heightPer - 12} fill="#f1f5f9" />
            <rect x={labelWidth} y={6} rx={6} ry={6} width={barW} height={heightPer - 12} className="bar-fill-svg" />
            <text x={labelWidth + chartWidth + 8} y={heightPer / 2} alignmentBaseline="middle" className="bar-value">{value}</text>
          </g>
        );
      })}
    </svg>
  );
};

export default BarChart;
