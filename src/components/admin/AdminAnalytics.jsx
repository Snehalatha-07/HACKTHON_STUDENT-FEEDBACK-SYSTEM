import React, { useState } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { dataUtils } from '../../utils/data';
import BarChart from './Charts';
import { useNavigate } from 'react-router-dom';

const AdminAnalytics = () => {
  const { feedbackForms, feedbackResponses, courses, instructors } = useFeedback();
  const navigate = useNavigate();
  const [selectedForm, setSelectedForm] = useState(null);

  const getFormResponses = (formId) => {
    return feedbackResponses.filter(response => response.formId === formId);
  };

  const getFormSummary = (form) => {
    const responses = getFormResponses(form.id);
    return dataUtils.getFeedbackSummary(responses, form);
  };

  const renderRatingChart = (distribution, scale) => {
    const maxCount = Math.max(...Object.values(distribution));
    
    return (
      <div className="rating-chart">
        {scale.labels.map((label, index) => {
          const value = index + scale.min;
          const count = distribution[value] || 0;
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
          
          return (
            <div key={value} className="rating-bar">
              <span className="rating-label">{label}</span>
              <div className="bar-container">
                <div 
                  className="bar-fill" 
                  style={{ width: `${percentage}%` }}
                ></div>
                <span className="bar-count">{count}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDistributionChart = (distribution) => {
    const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
    
    return (
      <div className="distribution-chart">
        {Object.entries(distribution).map(([option, count]) => {
          const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
          
          return (
            <div key={option} className="distribution-item">
              <span className="option-label">{option}</span>
              <div className="distribution-bar">
                <div 
                  className="distribution-fill" 
                  style={{ width: `${percentage}%` }}
                ></div>
                <span className="distribution-text">{count} ({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (selectedForm) {
    const responses = getFormResponses(selectedForm.id);
    const summary = getFormSummary(selectedForm);

    return (
      <div className="admin-analytics">
        <div className="analytics-header">
          <button type="button" onClick={() => setSelectedForm(null)} className="btn btn-secondary">← Back to Forms</button>
          <h2>Analytics: {selectedForm.title}</h2>
        </div>

        <div className="analytics-overview">
          <div className="overview-cards">
            <div className="overview-card">
              <h3>Total Responses</h3>
              <div className="overview-number">{summary.totalResponses}</div>
            </div>
            <div className="overview-card">
              <h3>Questions</h3>
              <div className="overview-number">{selectedForm.questions.length}</div>
            </div>
            <div className="overview-card">
              <h3>Response Rate</h3>
              <div className="overview-number">
                {summary.totalResponses > 0 ? '100%' : '0%'}
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-content">
          <h3>Question Analysis</h3>
          
          {selectedForm.questions.map((question, index) => {
            const questionSummary = summary.questionSummaries[question.id];
            
            return (
              <div key={question.id} className="question-analytics">
                <div className="question-header">
                  <h4>Q{index + 1}: {question.question}</h4>
                  <span className="question-type">{question.type}</span>
                </div>

                <div className="question-results">
                  {question.type === 'rating' && questionSummary.averageRating !== undefined && (
                    <div className="rating-results">
                      <div className="average-rating">
                        <span className="average-label">Average Rating:</span>
                        <span className="average-value">
                          {questionSummary.averageRating.toFixed(1)} / {question.scale.max}
                        </span>
                        <div className="star-rating">
                          {'★'.repeat(Math.round(questionSummary.averageRating))}
                          {'☆'.repeat(question.scale.max - Math.round(questionSummary.averageRating))}
                        </div>
                      </div>
                      {renderRatingChart(questionSummary.distribution, question.scale)}
                    </div>
                  )}

                  {(question.type === 'multiple_choice' || question.type === 'yes_no') && questionSummary.distribution && (
                    <div className="distribution-results">
                      {renderDistributionChart(questionSummary.distribution)}
                    </div>
                  )}

                  {question.type === 'text' && questionSummary.responses && (
                    <div className="text-responses">
                      <h5>Text Responses ({questionSummary.responses.length}):</h5>
                      <div className="text-responses-list">
                        {questionSummary.responses.map((response, idx) => (
                          <div key={idx} className="text-response">
                            <p>"{response}"</p>
                          </div>
                        ))}
                        {questionSummary.responses.length === 0 && (
                          <p className="no-responses">No text responses submitted yet.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-analytics">
      <div className="page-header">
        <h2>Feedback Analytics</h2>
      </div>

      <div className="analytics-overview">
        <div className="overview-cards">
          <div className="overview-card">
            <h3>Total Forms</h3>
            <div className="overview-number">{feedbackForms.length}</div>
          </div>
          <div className="overview-card">
            <h3>Total Responses</h3>
            <div className="overview-number">{feedbackResponses.length}</div>
          </div>
          <div className="overview-card">
            <h3>Active Forms</h3>
            <div className="overview-number">
              {feedbackForms.filter(form => form.isActive).length}
            </div>
          </div>
        </div>
      </div>

      {/* Courses responses chart */}
      <div className="analytics-section">
        <h3>Responses by Course</h3>
        <div className="courses-chart">
          {courses.length === 0 ? (
            <div className="empty-state">No courses available</div>
          ) : (
            (() => {
              const counts = {};
              feedbackResponses.forEach(r => {
                counts[r.courseId] = (counts[r.courseId] || 0) + 1;
              });

              const rows = courses.map(c => ({ id: c.id, name: c.name, count: counts[c.id] || 0 }));

              return (
                <div>
                  <BarChart data={rows} labelKey="name" valueKey="count" onBarClick={(row) => {
                    // navigate to admin responses filtered by course
                    navigate(`/admin/responses?course=${encodeURIComponent(row.id)}`);
                  }} />
                </div>
              );
            })()
          )}
        </div>
      </div>

      <div className="forms-analytics">
        <h3>Form Analytics</h3>
        
        {feedbackForms.length === 0 ? (
          <div className="empty-state">
            <h4>No feedback forms available</h4>
            <p>Create feedback forms to start collecting and analyzing student responses.</p>
          </div>
        ) : (
          <div className="forms-list">
            {feedbackForms.map(form => {
              const responses = getFormResponses(form.id);
              const summary = getFormSummary(form);
              
              return (
                <div key={form.id} className="form-analytics-card">
                  <div className="form-card-header">
                    <h4>{form.title}</h4>
                    <button 
                      type="button"
                      onClick={() => setSelectedForm(form)}
                      className="btn btn-primary"
                      disabled={responses.length === 0}
                    >
                      {responses.length === 0 ? 'No Data' : 'View Details'}
                    </button>
                  </div>
                  
                  <div className="form-card-stats">
                    <div className="stat-item">
                      <span className="stat-label">Responses:</span>
                      <span className="stat-value">{responses.length}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Questions:</span>
                      <span className="stat-value">{form.questions.length}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Type:</span>
                      <span className="stat-value">{form.targetType}</span>
                    </div>
                  </div>

                  {responses.length > 0 && (
                    <div className="form-quick-stats">
                      <h5>Quick Overview:</h5>
                      {form.questions.slice(0, 2).map(question => {
                        const questionSummary = summary.questionSummaries[question.id];
                        if (question.type === 'rating' && questionSummary.averageRating !== undefined) {
                          return (
                            <div key={question.id} className="quick-stat">
                              <span className="stat-question">{question.question.substring(0, 50)}...</span>
                              <span className="stat-rating">
                                {questionSummary.averageRating.toFixed(1)}/5 ⭐
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;