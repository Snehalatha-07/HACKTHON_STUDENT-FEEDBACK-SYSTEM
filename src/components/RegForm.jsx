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
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = (pw) => {
    if (!pw) return { score: 0, label: 'Too short' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const labels = ['Very weak', 'Weak', 'OK', 'Strong', 'Very strong'];
    return { score, label: labels[score] || labels[0] };
  };

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

        <div className="form-group password-field">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrap">
            <input id="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))} aria-required="true" aria-describedby={errors.password ? 'reg-password-error' : undefined} />
            <button type="button" className="password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(s => !s)} aria-pressed={showPassword}>
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10.58 10.58A3 3 0 0 0 13.42 13.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M1.5 12s3.5-6 10.5-6 10.5 6 10.5 6-3.5 6-10.5 6S1.5 12 1.5 12z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && <div id="reg-password-error" className="field-error">{errors.password}</div>}

          {/* Password strength meter */}
          <div className="strength-meter" aria-hidden>
            <div className={`strength-bar s-${passwordStrength(form.password).score}`} style={{width: `${(passwordStrength(form.password).score/4)*100}%`}} />
            <div className="strength-label">{form.password ? passwordStrength(form.password).label : ''}</div>
          </div>
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
