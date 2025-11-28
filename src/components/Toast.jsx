import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => {
      onClose && onClose();
    }, duration);
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose && onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(id);
      document.removeEventListener('keydown', onKey);
    };
  }, [message, duration, onClose]);

  if (!message) return null;

  const handleClose = (e) => {
    e.stopPropagation();
    onClose && onClose();
  };

  return (
    <div className={`app-toast app-toast-${type}`} role="status" aria-live="polite">
      <div className="toast-message">{message}</div>
      <button type="button" className="toast-close" onClick={handleClose} aria-label="Close notification">×</button>
    </div>
  );
};

export default Toast;
