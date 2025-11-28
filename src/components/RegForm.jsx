import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeedback } from '../context/FeedbackContext';
import Toast from './Toast';
import { normalizeUserInput } from '../utils/authUtils';

const RegForm = () => {
  const { setUser } = useFeedback();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nameOrId: '', email: '', password: '', role: 'student', remember: false });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.nameOrId.trim()) e.nameOrId = 'Enter name or ID';
    if (!form.password || form.password.length < 6) e.password = 'Password must be 6+ chars';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    const normalized = normalizeUserInput(form.nameOrId);
    const newUser = { id: normalized.id, name: normalized.name, role: form.role };
    setUser({ ...newUser, _persist: !!form.remember });
    setToast('Registered and logged in');
    setTimeout(() => navigate(newUser.role === 'admin' ? '/admin' : '/student'), 800);
  };

  return (
    <div>
      <form id="reg-form" onSubmit={handleSubmit} className="login-form" aria-label="Registration form">
        <h2>Create Account</h2>

        <div className="form-group">
          <label htmlFor="nameOrId">Name or ID</label>
          <input id="nameOrId" autoFocus value={form.nameOrId} onChange={(e) => setForm(prev => ({ ...prev, nameOrId: e.target.value }))} placeholder="Enter your name or ID" aria-required="true" aria-describedby={errors.nameOrId ? 'reg-nameOrId-error' : undefined} />
          {errors.nameOrId && <div id="reg-nameOrId-error" className="field-error">{errors.nameOrId}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email (optional)</label>
          <input id="email" value={form.email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} placeholder="Email address" />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={form.password} onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))} aria-required="true" aria-describedby={errors.password ? 'reg-password-error' : undefined} />
          {errors.password && <div id="reg-password-error" className="field-error">{errors.password}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select id="role" value={form.role} onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}>
            <option value="student">Student</option>
            <option value="admin">Administrator/Teacher</option>
          </select>
        </div>

        <div className="form-group form-remember">
          <label>
            <input type="checkbox" checked={form.remember} onChange={(e) => setForm(prev => ({ ...prev, remember: e.target.checked }))} aria-label="Remember me" /> Remember Me
          </label>
        </div>

        <button className="btn login-btn" type="submit">Sign Up</button>
      </form>
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default RegForm;
