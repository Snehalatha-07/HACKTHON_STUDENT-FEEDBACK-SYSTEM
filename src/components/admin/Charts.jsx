import React, { useState, useEffect, useRef } from 'react';

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
    // gentle stagger for nicer animation
    const t = setTimeout(() => {
      // set widths with small stagger
      targets.forEach((w, i) => {
        setTimeout(() => setAnimatedWidths(prev => { const next = [...prev]; next[i] = w; return next; }), i * 80);
      });
    }, 30);
    return () => clearTimeout(t);
  }, [data, chartWidth, max, valueKey]);

  const wrapRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, label: '', value: 0, percent: 0 });

  const showTooltip = (ev, row) => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    let x = ev.clientX - rect.left + 8;
    let y = ev.clientY - rect.top + 8;
    // compute percent of total
    const total = data.reduce((s, it) => s + (it[valueKey] || 0), 0) || 1;
    const percent = total > 0 ? Math.round(((row[valueKey] || 0) / total) * 1000) / 10 : 0;
    // clamp tooltip inside container (approx widths)
    const maxW = Math.max(160, rect.width * 0.25);
    const maxX = Math.max(8, rect.width - maxW - 8);
    const maxY = Math.max(8, rect.height - 48);
    if (x > maxX) x = maxX;
    if (y > maxY) y = maxY;
    setTooltip({ visible: true, x, y, label: row[labelKey], value: row[valueKey], percent });
  };

  const moveTooltip = (ev) => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left + 8;
    const y = ev.clientY - rect.top + 8;
    setTooltip(t => ({ ...t, x, y }));
  };

  const hideTooltip = () => setTooltip({ visible: false, x: 0, y: 0, label: '', value: 0 });

  return (
    <div ref={wrapRef} className="bar-chart-wrap" style={{ width: '100%', overflow: 'auto', position: 'relative' }}>
      <svg className="bar-chart" viewBox={`0 0 ${viewWidth} ${height}`} width="100%" height={height} role="img" aria-label="Bar chart">
        <defs>
          <linearGradient id="barGradient" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--primary-2)" />
          </linearGradient>
        </defs>
        {/* bottom axis ticks (0 to max) */}
        {(() => {
          const ticks = [0, 0.25, 0.5, 0.75, 1];
          return (
            <g transform={`translate(${labelWidth}, ${height - 6})`} aria-hidden="true">
              {ticks.map((t, idx) => {
                const x = Math.round(t * chartWidth);
                const val = Math.round(t * max);
                return (
                  <g key={idx} transform={`translate(${x},0)`}>
                    <line x1={0} y1={0} x2={0} y2={6} stroke="#cbd5e1" strokeWidth={1} />
                    <text x={0} y={18} fontSize={10} fill="#6b7280" textAnchor="middle">{val}</text>
                  </g>
                );
              })}
            </g>
          );
        })()}
        {data.map((d, i) => {
          const y = 10 + i * heightPer;
          const value = d[valueKey] || 0;
          const barW = animatedWidths[i] ?? 0;
          const label = d[labelKey] || '';

          return (
            <g
              key={i}
              transform={`translate(0, ${y})`}
              style={{ cursor: onBarClick ? 'pointer' : 'default' }}
              onClick={() => onBarClick && onBarClick(d)}
              onKeyDown={(e) => {
                if (!onBarClick) return;
                // Activate on Enter or Space
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                  e.preventDefault();
                  onBarClick(d);
                }
              }}
              tabIndex={onBarClick ? 0 : -1}
              role={onBarClick ? 'button' : undefined}
              aria-label={`${label}: ${value}`}
              onMouseEnter={(e) => showTooltip(e, d)}
              onMouseMove={moveTooltip}
              onMouseLeave={hideTooltip}
            >
              <text x={10} y={heightPer / 2} alignmentBaseline="middle" className="bar-label">{label}</text>
              <rect x={labelWidth} y={6} rx={6} ry={6} width={chartWidth} height={heightPer - 12} fill="#f1f5f9" />
              <rect x={labelWidth} y={6} rx={6} ry={6} width={barW} height={heightPer - 12} className="bar-fill-svg" fill="url(#barGradient)" />
              <text x={labelWidth + chartWidth + 8} y={heightPer / 2} alignmentBaseline="middle" className="bar-value">{value}</text>
            </g>
          );
        })}
      </svg>

      {tooltip.visible && (
        <div className="chart-tooltip" style={{ left: tooltip.x, top: tooltip.y }} role="note">
          <div className="chart-tooltip-label">{tooltip.label}</div>
          <div className="chart-tooltip-value">{tooltip.value} responses • {tooltip.percent}%</div>
        </div>
      )}
    </div>
  );
};

export default BarChart;
