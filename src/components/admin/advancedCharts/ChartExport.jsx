import React from 'react';

export function downloadCanvasAsPng(canvas, filename = 'chart.png') {
  if (!canvas) return;
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function ChartExport({ chartRef, filename }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button onClick={() => chartRef?.current && downloadCanvasAsPng(chartRef.current.canvas, filename || 'chart.png')}>Download PNG</button>
    </div>
  );
}
