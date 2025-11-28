import React, { useState } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { dataUtils } from '../../utils/data';

const StudentResults = () => {
  const { feedbackForms, feedbackResponses, courses, instructors } = useFeedback();
  const [selectedForm, setSelectedForm] = useState(null);

  // Only show forms that have responses (aggregated results)
  const formsWithResponses = feedbackForms.filter(form => 
    feedbackResponses.some(response => response.formId === form.id)
  );

  const getFormResponses = (formId) => {
    return feedbackResponses.filter(response => response.formId === formId);
  };

  const getFormSummary = (form) => {
    const responses = getFormResponses(form.id);
    return dataUtils.getFeedbackSummary(responses, form);
  };

  const renderRatingSummary = (question, questionSummary) => {
    if (!questionSummary.averageRating) return null;

    const { averageRating, distribution } = questionSummary;
    const totalResponses = Object.values(distribution).reduce((sum, count) => sum + count, 0);

    return (
      <div className="rating-summary">
        <div className="average-rating">
          <div className="rating-display">
            <span className="rating-number">{averageRating.toFixed(1)}</span>
            <span className="rating-scale">/ {question.scale.max}</span>
          </div>
          <div className="star-rating">
            {'★'.repeat(Math.round(averageRating))}
            {'☆'.repeat(question.scale.max - Math.round(averageRating))}
          </div>
          <div className="response-count">{totalResponses} responses</div>
        </div>

        <div className="rating-breakdown">
          {question.scale.labels.map((label, index) => {
            const value = index + question.scale.min;
            const count = distribution[value] || 0;
            const percentage = totalResponses > 0 ? (count / totalResponses) * 100 : 0;

            return (
              <div key={value} className="rating-bar">
                <span className="rating-label">{value} {label}</span>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                  <span className="bar-percentage">{percentage.toFixed(0)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDistributionSummary = (questionSummary) => {
    const { distribution } = questionSummary;
    const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);

    return (
      <div className="distribution-summary">
        {Object.entries(distribution).map(([option, count]) => {
          const percentage = total > 0 ? (count / total) * 100 : 0;
          
          return (
            <div key={option} className="distribution-item">
              <div className="option-info">
                <span className="option-label">{option}</span>
                <span className="option-stats">{count} ({percentage.toFixed(1)}%)</span>
              </div>
              <div className="option-bar">
                <div 
                  className="option-fill" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderTextSummary = (questionSummary) => {
    const { responses } = questionSummary;
    
    if (!responses || responses.length === 0) {
      return <p className="no-responses">No text responses available</p>;
    }

    return (
      <div className="text-summary">
        <div className="response-count">{responses.length} text responses</div>
        <div className="text-responses-sample">
          <h5>Sample Responses:</h5>
          {responses.slice(0, 3).map((response, index) => (
            <blockquote key={index} className="text-response">
              "{response}"
            </blockquote>
          ))}
          {responses.length > 3 && (
            <p className="more-responses">
              And {responses.length - 3} more responses...
            </p>
          )}
        </div>
      </div>
    );
  };

  if (selectedForm) {
    const summary = getFormSummary(selectedForm);
    const targetInfo = selectedForm.targetType === 'course' 
      ? courses.find(c => c.id === selectedForm.targetId)
      : selectedForm.targetType === 'instructor'
      ? instructors.find(i => i.id === selectedForm.targetId)
      : null;

    return (
      <div className="student-results">
        <div className="results-header">
          <button type="button" onClick={() => setSelectedForm(null)} className="btn-secondary">
            ← Back to Results
          </button>
          <div className="form-info">
            <h2>{selectedForm.title} - Results</h2>
            {targetInfo && (
              <div className="target-info">
                <strong>
                  {selectedForm.targetType === 'course' ? 'Course: ' : 'Instructor: '}
                  {targetInfo.name}
                </strong>
              </div>
            )}
            <div className="summary-stats">
              <span>Total Responses: {summary.totalResponses}</span>
            </div>
          </div>
        </div>

        <div className="results-content">
          {selectedForm.questions.map((question, index) => {
            const questionSummary = summary.questionSummaries[question.id];
            
            return (
              <div key={question.id} className="question-results">
                <div className="question-header">
                  <h4>Q{index + 1}: {question.question}</h4>
                </div>

                <div className="question-summary">
                  {question.type === 'rating' && renderRatingSummary(question, questionSummary)}
                  {(question.type === 'multiple_choice' || question.type === 'yes_no') && 
                    renderDistributionSummary(questionSummary)}
                  {question.type === 'text' && renderTextSummary(questionSummary)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="student-results">
      <div className="page-header">
        <h2>Feedback Results</h2>
        <p>View aggregated feedback results and insights</p>
      </div>

      {formsWithResponses.length === 0 ? (
        <div className="empty-state">
          <h3>No results available yet</h3>
          <p>Feedback results will appear here once responses have been collected.</p>
        </div>
      ) : (
        <div className="results-grid">
          {formsWithResponses.map(form => {
            const responses = getFormResponses(form.id);
            const summary = getFormSummary(form);
            const targetInfo = form.targetType === 'course' 
              ? courses.find(c => c.id === form.targetId)
              : form.targetType === 'instructor'
              ? instructors.find(i => i.id === form.targetId)
              : null;

            // Calculate average rating across all rating questions
            const ratingQuestions = form.questions.filter(q => q.type === 'rating');
            const averageRatings = ratingQuestions.map(q => {
              const qSummary = summary.questionSummaries[q.id];
              return qSummary.averageRating || 0;
            });
            const overallAverage = averageRatings.length > 0 
              ? averageRatings.reduce((sum, rating) => sum + rating, 0) / averageRatings.length 
              : 0;

            return (
              <div key={form.id} className="results-card">
                <div className="results-card-header">
                  <h3>{form.title}</h3>
                  <span className="form-type">{form.targetType}</span>
                </div>
                
                <div className="results-card-body">
                  {targetInfo && (
                    <div className="target-info">
                      <strong>
                        {form.targetType === 'course' ? 'Course: ' : 'Instructor: '}
                        {targetInfo.name}
                      </strong>
                      {form.targetType === 'course' && targetInfo.instructor && (
                        <div className="instructor-name">Instructor: {targetInfo.instructor}</div>
                      )}
                    </div>
                  )}

                  <div className="results-summary">
                    <div className="summary-item">
                      <span className="summary-label">Responses:</span>
                      <span className="summary-value">{responses.length}</span>
                    </div>
                    
                    {overallAverage > 0 && (
                      <div className="summary-item">
                        <span className="summary-label">Average Rating:</span>
                        <span className="summary-value">
                          {overallAverage.toFixed(1)}/5 ⭐
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Show a preview of top-rated aspects */}
                  {ratingQuestions.length > 0 && (
                    <div className="quick-insights">
                      <h5>Top Rated Aspects:</h5>
                      {ratingQuestions
                        .map(q => ({
                          question: q.question,
                          rating: summary.questionSummaries[q.id].averageRating || 0
                        }))
                        .sort((a, b) => b.rating - a.rating)
                        .slice(0, 2)
                        .map((item, idx) => (
                          <div key={idx} className="insight-item">
                            <span className="insight-text">
                              {item.question.length > 50 
                                ? item.question.substring(0, 47) + '...' 
                                : item.question}
                            </span>
                            <span className="insight-rating">{item.rating.toFixed(1)}/5</span>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>

                <div className="results-card-actions">
                  <button 
                    type="button"
                    onClick={() => setSelectedForm(form)}
                    className="btn-primary"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentResults;