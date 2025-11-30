import React from 'react';
import CourseCharts from './advancedCharts/CourseCharts';

export default function AnalyticsAdvancedDemo() {
  const apiBase = ''; // empty -> same origin; set to 'http://localhost:4000' when running server
  return (
    <div style={{ padding: 16 }}>
      <h2>Advanced Analytics Demo</h2>
      <p>These charts pull demo data from <code>/api/responses</code>. Run the `server` seed to generate demo rows.</p>
      <CourseCharts apiBase={apiBase} />
    </div>
  );
}
