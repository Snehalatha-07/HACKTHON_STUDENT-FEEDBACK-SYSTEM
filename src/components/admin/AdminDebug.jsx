import React from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { generateId, questionTypes, ratingScales } from '../../utils/data';

export default function AdminDebug() {
  const context = useFeedback();

  const dump = {
    context: {
      user: context.user,
      courses: context.courses,
      instructors: context.instructors,
      feedbackForms: context.feedbackForms,
      feedbackResponses: context.feedbackResponses
    },
    localStorage: (() => {
      try {
        const keys = Object.keys(localStorage).sort();
        const out = {};
        keys.forEach(k => { try { out[k] = JSON.parse(localStorage.getItem(k)); } catch(e) { out[k] = localStorage.getItem(k); } });
        return out;
      } catch (e) { return { error: String(e) }; }
    })()
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'debug_dump.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const repairData = () => {
    try {
      // Repair feedbackForms
      const rawForms = localStorage.getItem('feedbackForms');
      let forms = [];
      if (rawForms) {
        try { forms = JSON.parse(rawForms) || []; } catch (e) { forms = []; }
      }

      const repairedForms = forms.map(f => {
        const form = Object.assign({}, f || {});
        if (!form.id) form.id = generateId();
        if (!form.title) form.title = 'Untitled Form';
        if (!Array.isArray(form.questions)) form.questions = [];
        form.questions = form.questions.map(q => {
          const qq = Object.assign({}, q || {});
          if (!qq.id) qq.id = generateId();
          if (!qq.type) qq.type = questionTypes.TEXT;
          if (!qq.question) qq.question = 'Untitled question';
          if (qq.type === questionTypes.RATING) {
            if (!qq.scale) qq.scale = ratingScales.FIVE_STAR;
            else {
              qq.scale.min = qq.scale.min || ratingScales.FIVE_STAR.min;
              qq.scale.max = qq.scale.max || ratingScales.FIVE_STAR.max;
              qq.scale.labels = Array.isArray(qq.scale.labels) && qq.scale.labels.length ? qq.scale.labels : ratingScales.FIVE_STAR.labels;
            }
          }
          qq.required = !!qq.required;
          return qq;
        });
        return form;
      });

      localStorage.setItem('feedbackForms', JSON.stringify(repairedForms));

      // Repair feedbackResponses
      const rawResponses = localStorage.getItem('feedbackResponses');
      let responses = [];
      if (rawResponses) {
        try { responses = JSON.parse(rawResponses) || []; } catch (e) { responses = []; }
      }

      const repairedResponses = responses.map(r => {
        const rr = Object.assign({}, r || {});
        if (!rr.id) rr.id = generateId();
        if (!rr.submittedAt) rr.submittedAt = new Date().toISOString();
        // Normalize answers: accept array [{question_id,value}] or object { qid: val }
        if (Array.isArray(rr.answers)) {
          const obj = {};
          rr.answers.forEach(a => {
            if (a && (a.question_id || a.questionId || a.q)) {
              const qid = a.question_id || a.questionId || a.q;
              obj[qid] = a.value !== undefined ? a.value : (a.answer || '');
            }
          });
          rr.answers = obj;
        } else if (typeof rr.answers !== 'object' || rr.answers === null) {
          rr.answers = {};
        }
        return rr;
      });

      localStorage.setItem('feedbackResponses', JSON.stringify(repairedResponses));

      alert('Data repaired. Reloading page to apply fixes.');
      window.location.reload();
    } catch (e) {
      console.error('Repair failed', e);
      alert('Repair failed: ' + e.message);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Admin Debug</h2>
      <p>This page shows the runtime FeedbackContext and localStorage contents for debugging.</p>
      <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
        <button className="btn" onClick={downloadJson}>Download JSON</button>
        <button className="btn btn-warning" onClick={() => {
          if (confirm('Repair local data now? This will modify feedbackForms and feedbackResponses in localStorage. Proceed?')) repairData();
        }}>Repair localStorage data</button>
      </div>
      <pre style={{ background: '#f7f7f9', padding: 12, overflow: 'auto', maxHeight: '70vh' }}>{JSON.stringify(dump, null, 2)}</pre>
    </div>
  );
}
