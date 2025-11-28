import React, { useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useFeedback } from '../context/FeedbackContext';
import Toast from './Toast';
import { normalizeUserInput } from '../utils/authUtils';

const Auth = () => {
  const { user, setUser } = useFeedback();
  const [tab, setTab] = useState('login');
  const loginTabRef = useRef(null);
  const registerTabRef = useRef(null);
  const [toast, setToast] = useState(null);

  const [loginData, setLoginData] = useState({ username: '', role: 'student', remember: false });
  const [registerData, setRegisterData] = useState({ username: '', role: 'student', password: '', remember: false });
  const [errors, setErrors] = useState({});

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
  }

  const validateLogin = () => {
    const err = {};
    if (!loginData.username.trim()) err.username = 'Enter your name';
    return err;
  };

  const validateRegister = () => {
    const err = {};
    if (!registerData.username.trim()) err.username = 'Enter your name';
    if (!registerData.password || registerData.password.length < 6) err.password = 'Password must be 6+ chars';
    return err;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const err = validateLogin();
    setErrors(err);
    if (Object.keys(err).length) return;
    // Normalize input: if user entered a numeric ID, use it as id; otherwise generate id
    const normalized = normalizeUserInput(loginData.username);
    const newUser = { id: normalized.id, name: normalized.name, role: loginData.role };
    // persist only if remember checked
    setUser({ ...newUser, _persist: !!loginData.remember });
    setToast('Login successful');
    setTimeout(() => setToast(null), 2500);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const err = validateRegister();
    setErrors(err);
    if (Object.keys(err).length) return;
    const normalized = normalizeUserInput(registerData.username);
    const newUser = { id: normalized.id, name: normalized.name, role: registerData.role };
    setUser({ ...newUser, _persist: !!registerData.remember });
    setToast('Registration successful');
    setTimeout(() => setToast(null), 2500);
  };

  const handleTabKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setTab((t) => (t === 'login' ? 'register' : 'login'));
      // Move focus to the newly active tab
      setTimeout(() => {
        if (tab === 'login') {
          registerTabRef.current && registerTabRef.current.focus();
        } else {
          loginTabRef.current && loginTabRef.current.focus();
        }
      }, 0);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="auth-tabs" role="tablist" aria-label="Authentication tabs">
          <button
            ref={loginTabRef}
            id="tab-login"
            role="tab"
            type="button"
            aria-selected={tab === 'login'}
            aria-controls="login-panel"
            className={`tab-btn ${tab === 'login' ? 'active' : ''}`}
            onClick={() => setTab('login')}
            onKeyDown={handleTabKeyDown}
          >
            Login
          </button>
          <button
            ref={registerTabRef}
            id="tab-register"
            role="tab"
            type="button"
            aria-selected={tab === 'register'}
            aria-controls="register-panel"
            className={`tab-btn ${tab === 'register' ? 'active' : ''}`}
            onClick={() => setTab('register')}
            onKeyDown={handleTabKeyDown}
          >
            Sign Up
          </button>
        </div>

        {tab === 'login' ? (
          <form id="login-panel" role="tabpanel" aria-labelledby="tab-login" className="login-form" onSubmit={handleLogin} noValidate aria-label="Login form">
            <h2>Welcome Back</h2>
            <div className="form-group">
              <label htmlFor="login-username">Name or ID</label>
              <input id="login-username" name="username" value={loginData.username} onChange={(e) => setLoginData(prev => ({...prev, username: e.target.value}))} placeholder="Enter your name or ID" aria-required="true" aria-describedby={errors.username ? 'login-username-error' : undefined} />
              {errors.username && <div id="login-username-error" className="field-error">{errors.username}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="login-role">Role</label>
              <select id="login-role" value={loginData.role} onChange={(e) => setLoginData(prev => ({...prev, role: e.target.value}))}>
                <option value="student">Student</option>
                <option value="admin">Administrator/Teacher</option>
              </select>
            </div>

            <div className="form-group form-remember">
              <label>
                <input aria-label="Remember me" type="checkbox" checked={loginData.remember} onChange={(e) => setLoginData(prev => ({...prev, remember: e.target.checked}))} /> Remember Me
              </label>
            </div>

            <button className="btn login-btn" type="submit">Login</button>
          </form>
        ) : (
          <form id="register-panel" role="tabpanel" aria-labelledby="tab-register" className="login-form" onSubmit={handleRegister} noValidate aria-label="Registration form">
            <h2>Create Account</h2>
            <div className="form-group">
              <label htmlFor="reg-username">Name or ID</label>
              <input id="reg-username" name="username" value={registerData.username} onChange={(e) => setRegisterData(prev => ({...prev, username: e.target.value}))} placeholder="Enter your name or ID" aria-required="true" aria-describedby={errors.username ? 'reg-username-error' : undefined} />
              {errors.username && <div id="reg-username-error" className="field-error">{errors.username}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="reg-role">Role</label>
              <select id="reg-role" value={registerData.role} onChange={(e) => setRegisterData(prev => ({...prev, role: e.target.value}))}>
                <option value="student">Student</option>
                <option value="admin">Administrator/Teacher</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <input id="reg-password" type="password" value={registerData.password} onChange={(e) => setRegisterData(prev => ({...prev, password: e.target.value}))} aria-required="true" aria-describedby={errors.password ? 'reg-password-error' : undefined} />
              {errors.password && <div id="reg-password-error" className="field-error">{errors.password}</div>}
            </div>

            <div className="form-group form-remember">
              <label>
                <input aria-label="Remember me" type="checkbox" checked={registerData.remember} onChange={(e) => setRegisterData(prev => ({...prev, remember: e.target.checked}))} /> Remember Me
              </label>
            </div>

            <button className="btn login-btn" type="submit">Sign Up</button>
          </form>
        )}

        <div style={{ marginTop: 16 }}>
          <small className="login-info">Demo app — authentication is client-side only.</small>
        </div>

        <Toast message={toast} onClose={() => setToast(null)} />
      </div>
    </div>
  );
};

export default Auth;
