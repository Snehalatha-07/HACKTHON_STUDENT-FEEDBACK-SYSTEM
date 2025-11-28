import React, { useState } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { questionTypes } from '../../utils/data';

const StudentFeedback = () => {
  const { feedbackForms, courses, instructors, submitFeedbackResponse } = useFeedback();
  const [selectedForm, setSelectedForm] = useState(null);
  const [formResponses, setFormResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const activeForms = feedbackForms.filter(form => form.isActive);

  const handleResponseChange = (questionId, value) => {
    setFormResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmitForm = async () => {
    if (!selectedForm) return;

    // Validate required questions
    const missingRequired = selectedForm.questions
      .filter(q => q.required)
      .some(q => !formResponses[q.id] || formResponses[q.id] === '');

    if (missingRequired) {
      alert('Please answer all required questions before submitting.');
      return;
    }

    setSubmitting(true);
    
    try {
      const responseData = {
        formId: selectedForm.id,
        answers: formResponses,
        studentId: 'anonymous', // In a real app, this would be the logged-in student's ID
      };

      submitFeedbackResponse(responseData);
      alert('Thank you! Your feedback has been submitted successfully.');
      setSelectedForm(null);
      setFormResponses({});
    } catch (error) {
      alert('Error submitting feedback. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question, index) => {
    const value = formResponses[question.id] || '';

    return (
      <div key={question.id} className="question-container">
        <div className="question-header">
          <h4>
            {index + 1}. {question.question}
            {question.required && <span className="required">*</span>}
          </h4>
        </div>

        <div className="question-input">
          {question.type === questionTypes.RATING && (
            <div className="rating-input">
              <div className="rating-scale">
                {question.scale.labels.map((label, idx) => {
                  const ratingValue = idx + question.scale.min;
                  return (
                    <label key={ratingValue} className="rating-option">
                      <input
                        type="radio"
                        name={`rating-${question.id}`}
                        value={ratingValue}
                        checked={value == ratingValue}
                        onChange={(e) => handleResponseChange(question.id, parseInt(e.target.value))}
                      />
                      <span className="rating-label">{ratingValue}</span>
                      <span className="rating-text">{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {question.type === questionTypes.YES_NO && (
            <div className="yes-no-input">
              <label className="option">
                <input
                  type="radio"
                  name={`yesno-${question.id}`}
                  value="Yes"
                  checked={value === 'Yes'}
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                />
                Yes
              </label>
              <label className="option">
                <input
                  type="radio"
                  name={`yesno-${question.id}`}
                  value="No"
                  checked={value === 'No'}
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                />
                No
              </label>
            </div>
          )}

          {question.type === questionTypes.MULTIPLE_CHOICE && (
            <div className="multiple-choice-input">
              {question.options && question.options.map((option, idx) => (
                <label key={idx} className="option">
                  <input
                    type="radio"
                    name={`mc-${question.id}`}
                    value={option}
                    checked={value === option}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}

          {question.type === questionTypes.TEXT && (
            <div className="text-input">
              <textarea
                value={value}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                placeholder="Enter your response..."
                rows={4}
                maxLength={1000}
              />
              <div className="character-count">{value.length}/1000</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (selectedForm) {
    const targetInfo = selectedForm.targetType === 'course' 
      ? courses.find(c => c.id === selectedForm.targetId)
      : selectedForm.targetType === 'instructor'
      ? instructors.find(i => i.id === selectedForm.targetId)
      : null;

    return (
      <div className="student-feedback">
        <div className="feedback-header">
          <button onClick={() => setSelectedForm(null)} className="btn-secondary">
            ← Back to Forms
          </button>
          <div className="form-info">
            <h2>{selectedForm.title}</h2>
            {selectedForm.description && <p>{selectedForm.description}</p>}
            {targetInfo && (
              <div className="target-info">
                <strong>
                  {selectedForm.targetType === 'course' ? 'Course: ' : 'Instructor: '}
                  {targetInfo.name}
                </strong>
                {selectedForm.targetType === 'course' && targetInfo.instructor && (
                  <span> - {targetInfo.instructor}</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="feedback-form">
          <div className="questions-list">
            {selectedForm.questions.map((question, index) => 
              renderQuestion(question, index)
            )}
          </div>

          <div className="form-actions">
            <button 
              onClick={handleSubmitForm}
              disabled={submitting}
              className="btn-primary submit-btn"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
            <button onClick={() => setSelectedForm(null)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-feedback">
      <div className="page-header">
        <h2>Give Feedback</h2>
        <p>Share your thoughts and help improve the educational experience</p>
      </div>

      {activeForms.length === 0 ? (
        <div className="empty-state">
          <h3>No feedback forms available</h3>
          <p>There are currently no active feedback forms. Please check back later.</p>
        </div>
      ) : (
        <div className="forms-grid">
          {activeForms.map(form => {
            const targetInfo = form.targetType === 'course' 
              ? courses.find(c => c.id === form.targetId)
              : form.targetType === 'instructor'
              ? instructors.find(i => i.id === form.targetId)
              : null;

            return (
              <div key={form.id} className="feedback-form-card">
                <div className="form-card-header">
                  <h3>{form.title}</h3>
                  <span className="form-type">{form.targetType}</span>
                </div>
                
                <div className="form-card-body">
                  {form.description && <p className="form-description">{form.description}</p>}
                  
                  {targetInfo && (
                    <div className="target-info">
                      <strong>
                        {form.targetType === 'course' ? 'Course: ' : 'Instructor: '}
                        {targetInfo.name}
                      </strong>
                      {form.targetType === 'course' && targetInfo.instructor && (
                        <div className="instructor-name">Instructor: {targetInfo.instructor}</div>
                      )}
                      {form.targetType === 'course' && targetInfo.department && (
                        <div className="department">Department: {targetInfo.department}</div>
                      )}
                    </div>
                  )}

                  <div className="form-meta">
                    <span className="question-count">
                      {form.questions.length} question{form.questions.length !== 1 ? 's' : ''}
                    </span>
                    <span className="estimated-time">
                      ~{Math.ceil(form.questions.length * 0.5)} min
                    </span>
                  </div>
                </div>

                <div className="form-card-actions">
                  <button 
                    onClick={() => setSelectedForm(form)}
                    className="btn-primary"
                  >
                    Start Feedback
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

export default StudentFeedback;