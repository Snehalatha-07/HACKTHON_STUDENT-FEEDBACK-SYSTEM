import React, { useEffect, useState } from 'react';

export default function ErrorOverlay() {
  const [error, setError] = useState(null);

  useEffect(() => {
    const onError = (msg, url, lineNo, columnNo, err) => {
      setError({ message: (err && err.message) || msg, stack: (err && err.stack) || `${url}:${lineNo}:${columnNo}` });
      return false;
    };

    const onRejection = (ev) => {
      const reason = ev.reason || ev.detail || ev;
      setError({ message: reason && reason.message ? reason.message : String(reason), stack: reason && reason.stack ? reason.stack : '' });
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);

    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  if (!error) return null;

  return (
    <div style={{ position: 'fixed', left: 12, right: 12, bottom: 12, zIndex: 9999 }}>
      <div style={{ background: 'rgba(220,38,38,0.95)', color: 'white', padding: 12, borderRadius: 6, boxShadow: '0 6px 18px rgba(0,0,0,0.2)' }}>
        <strong>Runtime error detected</strong>
        <div style={{ marginTop: 6, fontFamily: 'monospace', fontSize: 12, whiteSpace: 'pre-wrap' }}>{error.message}</div>
        {error.stack && <details style={{ marginTop: 8, color: '#ffe4e6' }}><summary>Stack</summary><pre style={{ whiteSpace: 'pre-wrap' }}>{error.stack}</pre></details>}
        <div style={{ marginTop: 8 }}>
          <button onClick={() => setError(null)} style={{ background: '#fff', border: 'none', padding: '6px 10px', borderRadius: 4 }}>Dismiss</button>
        </div>
      </div>
    </div>
  );
}
