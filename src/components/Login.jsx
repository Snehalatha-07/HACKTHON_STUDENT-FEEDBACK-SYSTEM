import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useFeedback } from '../context/FeedbackContext';

const Login = () => {
  const { user, setUser } = useFeedback();
  const [loginData, setLoginData] = useState({
    username: '',
    role: 'student'
  });

  // If user is already logged in, redirect to appropriate dashboard
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginData.username.trim()) {
      // Simple authentication - in a real app, this would be validated against a backend
      // normalize using helper
      const { normalizeUserInput } = await import('../utils/authUtils');
      const normalized = normalizeUserInput(loginData.username);
      const newUser = {
        id: normalized.id,
        name: normalized.name,
        role: loginData.role
      };

      // default to not persisted unless remember checked
      setUser({ ...newUser, _persist: !!loginData.remember });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to Student Feedback System</h2>
        <form onSubmit={handleSubmit} className="login-form" aria-label="Login form">
          <div className="form-group">
            <label htmlFor="username">Name or ID:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={loginData.username}
              onChange={handleInputChange}
              required
              placeholder="Enter your name or ID"
              aria-required="true"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              name="role"
              value={loginData.role}
              onChange={handleInputChange}
            >
              <option value="student">Student</option>
              <option value="admin">Administrator/Teacher</option>
            </select>
          </div>
          <div className="form-group form-remember">
            <label>
              <input aria-label="Remember me" type="checkbox" name="remember" checked={loginData.remember || false} onChange={(e) => setLoginData(prev => ({...prev, remember: e.target.checked}))} /> Remember Me
            </label>
          </div>
          
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        
        <div className="login-info">
          <p><strong>Demo Instructions:</strong></p>
          <p>• Select "Student" to access feedback forms and view results</p>
          <p>• Select "Administrator/Teacher" to create forms and view analytics</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
