import React from 'react';
import { Link } from 'react-router-dom';
import { useFeedback } from '../../context/FeedbackContext';

const StudentDashboard = () => {
  const { feedbackForms, feedbackResponses } = useFeedback();

  const activeForms = feedbackForms.filter(form => form.isActive);
  const formsWithResponses = feedbackForms.filter(form => 
    feedbackResponses.some(response => response.formId === form.id)
  );

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h2>Student Dashboard</h2>
        <p>Welcome to the Student Feedback System</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{activeForms.length}</h3>
            <p>Available Forms</p>
            <span className="stat-detail">Ready for feedback</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{formsWithResponses.length}</h3>
            <p>Results Available</p>
            <span className="stat-detail">View insights</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <h3>{feedbackResponses.length}</h3>
            <p>Total Responses</p>
            <span className="stat-detail">Community feedback</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <Link to="/student/feedback" className="action-card">
              <div className="action-icon">📝</div>
              <div className="action-content">
                <h4>Give Feedback</h4>
                <p>Share your thoughts on courses and instructors</p>
                {activeForms.length > 0 && (
                  <div className="action-badge">{activeForms.length} available</div>
                )}
              </div>
            </Link>

            <Link to="/student/results" className="action-card">
              <div className="action-icon">📊</div>
              <div className="action-content">
                <h4>View Results</h4>
                <p>See aggregated feedback insights</p>
                {formsWithResponses.length > 0 && (
                  <div className="action-badge">{formsWithResponses.length} with results</div>
                )}
              </div>
            </Link>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h3>Available Feedback Forms</h3>
          </div>
          <div className="available-forms">
            {activeForms.length === 0 ? (
              <div className="empty-state">
                <p>No feedback forms are currently available. Please check back later.</p>
              </div>
            ) : (
              <div className="forms-preview">
                {activeForms.slice(0, 3).map(form => (
                  <div key={form.id} className="form-preview-card">
                    <div className="form-preview-header">
                      <h4>{form.title}</h4>
                      <span className="form-type">{form.targetType}</span>
                    </div>
                    <div className="form-preview-info">
                      <span className="question-count">
                        {form.questions.length} questions
                      </span>
                      <span className="estimated-time">
                        ~{Math.ceil(form.questions.length * 0.5)} min
                      </span>
                    </div>
                    <Link to="/student/feedback" className="preview-link">
                      Start Feedback →
                    </Link>
                  </div>
                ))}
                {activeForms.length > 3 && (
                  <div className="more-forms">
                    <Link to="/student/feedback" className="view-all-link">
                      View all {activeForms.length} forms →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h3>Recent Results</h3>
          </div>
          <div className="recent-results">
            {formsWithResponses.length === 0 ? (
              <div className="empty-state">
                <p>No results available yet. Results will appear here after feedback is collected.</p>
              </div>
            ) : (
              <div className="results-preview">
                {formsWithResponses.slice(0, 3).map(form => {
                  const responseCount = feedbackResponses.filter(r => r.formId === form.id).length;
                  
                  return (
                    <div key={form.id} className="result-preview-card">
                      <div className="result-preview-header">
                        <h4>{form.title}</h4>
                        <span className="response-count">{responseCount} responses</span>
                      </div>
                      <div className="result-preview-info">
                        <span className="result-type">{form.targetType} feedback</span>
                      </div>
                      <Link to="/student/results" className="preview-link">
                        View Results →
                      </Link>
                    </div>
                  );
                })}
                {formsWithResponses.length > 3 && (
                  <div className="more-results">
                    <Link to="/student/results" className="view-all-link">
                      View all results →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-info">
        <div className="info-card">
          <h4>💡 How it works</h4>
          <ul>
            <li>Browse available feedback forms</li>
            <li>Submit honest and constructive feedback</li>
            <li>View aggregated results to see community insights</li>
            <li>Help improve the educational experience</li>
          </ul>
        </div>

        <div className="info-card">
          <h4>🔒 Your Privacy</h4>
          <ul>
            <li>All feedback is submitted anonymously</li>
            <li>Individual responses are not tracked</li>
            <li>Only aggregated data is displayed</li>
            <li>Your identity remains confidential</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;