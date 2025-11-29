import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFeedback } from '../../context/FeedbackContext';
import { storageUtils, generateId } from '../../utils/data';

const AdminDashboard = () => {
  const { feedbackForms, feedbackResponses, courses, instructors } = useFeedback();

  const activeForms = feedbackForms.filter(form => form.isActive).length;
  const totalResponses = feedbackResponses.length;
  const recentResponses = feedbackResponses.slice(-5).reverse();

  const getResponsesPerForm = () => {
    const responseCounts = {};
    feedbackResponses.forEach(response => {
      responseCounts[response.formId] = (responseCounts[response.formId] || 0) + 1;
    });
    return responseCounts;
  };

  const responseCounts = getResponsesPerForm();

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <p>Welcome to the Student Feedback System administration panel</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{feedbackForms.length}</h3>
            <p>Total Forms</p>
            <span className="stat-detail">{activeForms} active</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{totalResponses}</h3>
            <p>Total Responses</p>
            <span className="stat-detail">Across all forms</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <h3>{courses.length}</h3>
            <p>Courses</p>
            <span className="stat-detail">{instructors.length} instructors</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👨‍🏫</div>
          <div className="stat-content">
            <h3>{instructors.length}</h3>
            <p>Instructors</p>
            <span className="stat-detail">Faculty members</span>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h3>Demo Data</h3>
        </div>
        <div className="demo-controls">
          <p>Control seeding of demo feedback forms used for demos and testing.</p>
          <DemoSeedControls />
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <Link to="/admin/forms" className="action-card">
              <div className="action-icon">📝</div>
              <div className="action-content">
                <h4>Create Feedback Form</h4>
                <p>Design new forms to collect student feedback</p>
              </div>
            </Link>

            <Link to="/admin/analytics" className="action-card">
              <div className="action-icon">📊</div>
              <div className="action-content">
                <h4>View Analytics</h4>
                <p>Analyze feedback data and insights</p>
              </div>
            </Link>

            <Link to="/admin/courses" className="action-card">
              <div className="action-icon">🎓</div>
              <div className="action-content">
                <h4>Manage Courses</h4>
                <p>Add and edit course information</p>
              </div>
            </Link>

            <Link to="/admin/responses" className="action-card">
              <div className="action-icon">📥</div>
              <div className="action-content">
                <h4>View Responses</h4>
                <p>List, filter and export collected feedback</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h3>Form Performance</h3>
          </div>
          <div className="form-performance">
            {feedbackForms.length === 0 ? (
              <div className="empty-state">
                <p>No forms created yet. <Link to="/admin/forms">Create your first form</Link></p>
              </div>
            ) : (
              <div className="performance-list">
                {feedbackForms.slice(0, 5).map(form => (
                  <div key={form.id} className="performance-item">
                    <div className="performance-info">
                      <h4>{form.title}</h4>
                      <p>{form.targetType} feedback</p>
                    </div>
                    <div className="performance-stats">
                      <span className="response-count">
                        {responseCounts[form.id] || 0} responses
                      </span>
                      <span className={`status ${form.isActive ? 'active' : 'inactive'}`}>
                        {form.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h3>Recent Activity</h3>
          </div>
          <div className="recent-activity">
            {recentResponses.length === 0 ? (
              <div className="empty-state">
                <p>No responses yet. Share your forms to start collecting feedback.</p>
              </div>
            ) : (
              <div className="activity-list">
                {recentResponses.map(response => {
                  const form = feedbackForms.find(f => f.id === response.formId);
                  return (
                    <div key={response.id} className="activity-item">
                      <div className="activity-icon">💬</div>
                      <div className="activity-content">
                        <p>New response submitted for <strong>{form ? form.title : 'Unknown Form'}</strong></p>
                        <span className="activity-time">
                          {new Date(response.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

// Small component for toggling demo seeding
const DemoSeedControls = () => {
  const [enabled, setEnabled] = useState(() => {
    const val = storageUtils.loadFromStorage('seedDemoForms');
    return typeof val === 'boolean' ? val : true;
  });

  useEffect(() => {
    storageUtils.saveToStorage('seedDemoForms', enabled);
  }, [enabled]);

  const clearSeeded = () => {
    if (!confirm('Remove all demo-seeded forms? This cannot be undone.')) return;
    const forms = storageUtils.loadFromStorage('feedbackForms', []);
    const remaining = forms.filter(f => !f.seeded);
    storageUtils.saveToStorage('feedbackForms', remaining);
    // also update in-memory store by reloading the page (simple approach)
    window.location.reload();
  };

  const seedResponses = () => {
    if (!confirm('Create sample responses for seeded forms?')) return;
    const forms = storageUtils.loadFromStorage('feedbackForms', []);
    const seeded = forms.filter(f => f.seeded);
    if (!seeded.length) {
      alert('No seeded forms found to create responses for.');
      return;
    }

    const existing = storageUtils.loadFromStorage('feedbackResponses', []);
    const newResponses = [];

    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    seeded.forEach(form => {
      // create 3 demo responses per form
      for (let i = 0; i < 3; i++) {
        const answers = {};
        form.questions.forEach(q => {
          if (q.type === 'rating') {
            const min = (q.scale && q.scale.min) || 1;
            const max = (q.scale && q.scale.max) || 5;
            answers[q.id] = randInt(min, max);
          } else if (q.type === 'yes_no') {
            answers[q.id] = Math.random() > 0.3 ? 'Yes' : 'No';
          } else if (q.type === 'multiple_choice') {
            answers[q.id] = (q.options && q.options[0]) || 'Option A';
          } else if (q.type === 'text') {
            answers[q.id] = 'This is a sample response to help demonstrate results.';
          }
        });

        newResponses.push({
          id: generateId(),
          formId: form.id,
          answers,
          studentId: `demo_${Math.random().toString(36).slice(2,8)}`,
          submittedAt: new Date().toISOString()
        });
      }
    });

    const combined = existing.concat(newResponses);
    storageUtils.saveToStorage('feedbackResponses', combined);
    alert(`Created ${newResponses.length} demo responses.`);
    window.location.reload();
  };

  return (
    <div className="demo-seed-controls">
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
        <label style={{ fontWeight: 600 }}>Seed Demo Forms:</label>
        <button type="button" className="btn btn-small" onClick={() => setEnabled(true)} aria-pressed={enabled}>Enable</button>
        <button type="button" className="btn btn-small" onClick={() => setEnabled(false)} aria-pressed={!enabled}>Disable</button>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" className="btn btn-secondary" onClick={clearSeeded}>Clear seeded forms</button>
        <small className="login-info">Clears forms created by the demo seeder. This is reversible by enabling seeding and reloading.</small>
      </div>
    </div>
  );
};