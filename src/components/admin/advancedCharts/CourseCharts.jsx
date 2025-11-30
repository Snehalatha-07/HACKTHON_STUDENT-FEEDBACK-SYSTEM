import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bar, Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import ChartExport from './ChartExport';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

function compactNumber(n) {
  if (n >= 1e6) return (n/1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n/1e3).toFixed(1) + 'K';
  return ''+n;
}

export default function CourseCharts({ apiBase = '' }) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [avgByQuestion, setAvgByQuestion] = useState([]);
  const [timeSeries, setTimeSeries] = useState([]);
  const barRef = useRef();
  const lineRef = useRef();
  const radarRef = useRef();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        let rows = [];
        try {
          const res = await fetch((apiBase || '') + '/api/responses');
          if (res && res.ok) rows = await res.json();
        } catch (err) {
          // network/API unavailable — fallback to localStorage
          // eslint-disable-next-line no-console
          console.warn('API /api/responses fetch failed, falling back to localStorage', err);
        }

        // If no rows from API, try localStorage fallback
        if ((!rows || rows.length === 0) && typeof window !== 'undefined') {
          try {
            const ls = window.localStorage.getItem('feedbackResponses');
            if (ls) rows = JSON.parse(ls);
          } catch (e) {
            // ignore parse errors
          }
        }
        // rows: array of { id, form_id, course_id, answers: [{question_id, value}] }
        const questionMap = new Map();
        const counts = {};
        const sums = {};
        const times = {}; // by date (YYYY-MM)
        rows.forEach(r => {
          const date = (r.submitted_at || new Date().toISOString()).slice(0,7);
          if (!times[date]) times[date] = { sum:0, count:0 };
          if (Array.isArray(r.answers)) {
            r.answers.forEach(a => {
              // try parse numeric
              const v = parseFloat(a.value);
              const q = a.question_id || a.questionId || 'q';
              questionMap.set(q, q);
              if (!isNaN(v)) {
                sums[q] = (sums[q]||0) + v;
                counts[q] = (counts[q]||0) + 1;
                times[date].sum += v;
                times[date].count += 1;
              }
            });
          }
        });

        const qs = Array.from(questionMap.keys());
        setQuestions(qs);
        setAvgByQuestion(qs.map(q => ({ q, avg: counts[q] ? sums[q]/counts[q] : 0, count: counts[q]||0 })));

        const series = Object.keys(times).sort().map(k => ({ date: k, avg: times[k].count ? times[k].sum / times[k].count : 0 }));
        setTimeSeries(series);
      } catch (err) {
        console.error('load analytics', err);
      } finally { setLoading(false); }
    }
    load();
  }, [apiBase]);

  const barData = useMemo(() => ({
    labels: avgByQuestion.map(x => x.q),
    datasets: [{ label: 'Avg rating', data: avgByQuestion.map(x => +(x.avg.toFixed(2))), backgroundColor: '#4f46e5' }]
  }), [avgByQuestion]);

  const lineData = useMemo(() => ({
    labels: timeSeries.map(s => s.date),
    datasets: [{ label: 'Avg rating (time)', data: timeSeries.map(s => +(s.avg.toFixed(2))), borderColor: '#059669', backgroundColor: 'rgba(5,150,105,0.2)' }]
  }), [timeSeries]);

  const radarData = useMemo(() => ({
    labels: avgByQuestion.map(x => x.q),
    datasets: [{ label: 'Instructor A', data: avgByQuestion.map(x => +(x.avg.toFixed(2))), backgroundColor: 'rgba(79,70,229,0.2)', borderColor: '#4f46e5' }]
  }), [avgByQuestion]);

  if (loading) return <div>Loading analytics...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
      <section>
        <h3>Average Rating by Question</h3>
        <Bar ref={barRef} data={barData} options={{ responsive:true, plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => {
              const parsed = ctx.parsed?.y ?? ctx.raw ?? ctx.parsed ?? ctx.formattedValue;
              return `${ctx.dataset.label}: ${parsed}`
            } } }, }, scales: { y: { ticks: { callback: v => compactNumber(v) } } } }} />
        <ChartExport chartRef={barRef} filename={`avg-by-question.png`} />
      </section>

      <section>
        <h3>Trend Over Time</h3>
        <Line ref={lineRef} data={lineData} options={{ responsive:true, plugins: { legend:{ display:false } }, scales:{ y: { ticks: { callback: v => v } } } }} />
        <ChartExport chartRef={lineRef} filename={`trend-over-time.png`} />
      </section>

      <section>
        <h3>Radar: Instructor Comparison (sample)</h3>
        <Radar ref={radarRef} data={radarData} options={{ responsive:true }} />
        <ChartExport chartRef={radarRef} filename={`radar-instructors.png`} />
      </section>
    </div>
  );
}
