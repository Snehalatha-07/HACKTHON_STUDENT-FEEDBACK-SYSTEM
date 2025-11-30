import React, { useState } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { questionTypes } from '../../utils/data';
import Toast from '../Toast';

// Inline quick feedback form (keeps file self-contained)
const QuickFeedbackForm = ({ courses = [], onSubmit }) => {
  const [courseId, setCourseId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [anonymous, setAnonymous] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!courseId) return; // button is disabled anyway
    onSubmit({ courseId, rating, comment, anonymous });
    setComment('');
    setRating(5);
    setAnonymous(false);
  };

  return (
    <form className="quick-feedback-form" onSubmit={handleSubmit} aria-label="Quick feedback form">
      <div className="form-row">
        <label>Course</label>
        <select value={courseId} onChange={e => setCourseId(e.target.value)}>
          <option value="">Select a course</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="form-row">
        <label>Rating</label>
        <div className="rating-choices">
          {[1,2,3,4,5].map(n => (
            <button key={n} type="button" className={`rating-btn ${rating===n? 'active':''}`} onClick={() => setRating(n)} aria-pressed={rating===n}>{n}</button>
          ))}
        </div>
      </div>

      <div className="form-row">
        <label>Comment</label>
        <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Optional comment" rows={3} />
      </div>

      <div className="form-row form-row-inline">
        <label className="inline-label"><input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} /> Submit anonymously</label>
        <button type="submit" className="btn btn-primary" disabled={!courseId}>Submit</button>
      </div>
    </form>
  );
};

const StudentFeedback = () => {
  const { feedbackForms, courses, instructors, feedbackResponses, submitFeedbackResponse, user } = useFeedback();
  const [selectedForm, setSelectedForm] = useState(null);
  const [formResponses, setFormResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

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
      setToast('Thank you! Your feedback has been submitted successfully.');
      setSelectedForm(null);
      setFormResponses({});
    } catch (error) {
      setToast('Error submitting feedback. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question, index) => {
    const value = formResponses[question.id] || '';
    // Defensive defaults to avoid runtime errors when question shape is incomplete
    const scale = question.scale || { min: 1, max: 5, labels: ['1','2','3','4','5'] };
    const labels = Array.isArray(scale.labels) && scale.labels.length ? scale.labels : Array.from({ length: Math.max(1, (scale.max || 5) - (scale.min || 1) + 1) }, (_, i) => String(i + (scale.min || 1)));

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
                {labels.map((label, idx) => {
                  const ratingValue = idx + (scale.min || 1);
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
          <button type="button" onClick={() => setSelectedForm(null)} className="btn btn-secondary">
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
              type="button"
              onClick={handleSubmitForm}
              disabled={submitting}
              className="btn btn-primary submit-btn"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
            <button type="button" onClick={() => setSelectedForm(null)} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // aggregated stats: average rating per course from feedbackResponses
  const computeCourseStats = () => {
    const stats = {};
    feedbackResponses.forEach(r => {
      if (!r.courseId || typeof r.rating === 'undefined') return;
      if (!stats[r.courseId]) stats[r.courseId] = { total: 0, count: 0 };
      stats[r.courseId].total += Number(r.rating) || 0;
      stats[r.courseId].count += 1;
    });
    return Object.keys(stats).map(cid => ({ courseId: cid, avg: stats[cid].total / stats[cid].count, count: stats[cid].count }));
  };

  const stats = computeCourseStats();

  return (
    <div className="student-feedback">
      <div className="page-header">
        <h2>Give Feedback</h2>
        <p>Share your thoughts and help improve the educational experience</p>
      </div>

      {/* Quick feedback card */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="quick-feedback-card">
        <h3>Quick Feedback</h3>
        <p>Submit a short rating and comment for a course.</p>
        <QuickFeedbackForm courses={courses} onSubmit={(data) => {
          // wrap into response shape and submit
          const response = {
            formId: data.formId || null,
            courseId: data.courseId || null,
            rating: data.rating,
            comment: data.comment,
            anonymous: !!data.anonymous,
            studentId: data.anonymous ? 'anonymous' : (user && user.id) || 'guest'
          };
          submitFeedbackResponse(response);
          // user-visible toast
          setToast('Thank you — your quick feedback was submitted');
        }} />
      </div>

      {activeForms.length === 0 ? (
        <div className="empty-state">
          <h3>No feedback forms available</h3>
          <p>There are currently no active feedback forms. Please check back later.</p>
        </div>
      ) : (
        <>
        <div className="course-stats">
          <h3>Recent Ratings</h3>
          {stats.length === 0 ? <p className="muted">No ratings yet</p> : (
            <div className="stats-grid">
              {stats.map(s => {
                const course = courses.find(c => c.id === s.courseId) || { name: 'Unknown' };
                return (
                  <div key={s.courseId} className="stat-card">
                    <div className="stat-title">{course.name}</div>
                    <div className="stat-value">{s.avg.toFixed(1)} / 5</div>
                    <div className="stat-count">{s.count} response{s.count !== 1 ? 's' : ''}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

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
                    type="button"
                    onClick={() => setSelectedForm(form)}
                    className="btn btn-primary"
                  >
                    Start Feedback
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        </>
      )}
    </div>
  );
};

export default StudentFeedback;