import React, { useState } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { defaultFormTemplates, questionTypes, ratingScales, generateId } from '../../utils/data';

const AdminForms = () => {
  const { feedbackForms, courses, instructors, addFeedbackForm, updateFeedbackForm, deleteFeedbackForm } = useFeedback();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetType: 'course', // 'course' or 'instructor'
    targetId: '',
    questions: []
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      targetType: 'course',
      targetId: '',
      questions: []
    });
    setEditingForm(null);
    setShowCreateForm(false);
  };

  const handleCreateForm = (templateType = null) => {
    if (templateType && defaultFormTemplates[templateType]) {
      setFormData({
        ...formData,
        title: defaultFormTemplates[templateType].title,
        questions: [...defaultFormTemplates[templateType].questions]
      });
    }
    setShowCreateForm(true);
  };

  const handleEditForm = (form) => {
    setFormData(form);
    setEditingForm(form);
    setShowCreateForm(true);
  };

  const handleSaveForm = () => {
    if (!formData.title.trim()) {
      alert('Please enter a form title');
      return;
    }

    if (formData.questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    if (editingForm) {
      updateFeedbackForm(formData);
    } else {
      addFeedbackForm(formData);
    }
    resetForm();
  };

  const handleDeleteForm = (formId) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      deleteFeedbackForm(formId);
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      id: generateId(),
      type: questionTypes.RATING,
      question: '',
      scale: ratingScales.FIVE_STAR,
      required: true,
      options: []
    };
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
  };

  const updateQuestion = (index, updates) => {
    const updatedQuestions = formData.questions.map((q, i) => 
      i === index ? { ...q, ...updates } : q
    );
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  if (showCreateForm) {
    return (
      <div className="admin-forms">
        <div className="form-header">
          <h2>{editingForm ? 'Edit Form' : 'Create New Form'}</h2>
          <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
        </div>

        <div className="form-builder">
          <div className="form-details">
            <div className="form-group">
              <label>Form Title:</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter form title"
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter form description (optional)"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Target Type:</label>
              <select
                value={formData.targetType}
                onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
              >
                <option value="course">Course</option>
                <option value="instructor">Instructor</option>
                <option value="general">General</option>
              </select>
            </div>

            {formData.targetType !== 'general' && (
              <div className="form-group">
                <label>Target:</label>
                <select
                  value={formData.targetId}
                  onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                >
                  <option value="">Select {formData.targetType}</option>
                  {(formData.targetType === 'course' ? courses : instructors).map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="questions-section">
            <div className="questions-header">
              <h3>Questions</h3>
              <button type="button" onClick={addQuestion} className="btn-primary">Add Question</button>
            </div>

            <div className="questions-list">
              {formData.questions.map((question, index) => (
                <div key={question.id} className="question-item">
                  <div className="question-header">
                    <span>Question {index + 1}</span>
                    <button type="button" onClick={() => removeQuestion(index)} className="btn-danger-small">Remove</button>
                  </div>

                  <div className="question-fields">
                    <div className="form-group">
                      <label>Question Text:</label>
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) => updateQuestion(index, { question: e.target.value })}
                        placeholder="Enter question text"
                      />
                    </div>

                    <div className="form-group">
                      <label>Question Type:</label>
                      <select
                        value={question.type}
                        onChange={(e) => updateQuestion(index, { type: e.target.value })}
                      >
                        <option value={questionTypes.RATING}>Rating</option>
                        <option value={questionTypes.MULTIPLE_CHOICE}>Multiple Choice</option>
                        <option value={questionTypes.TEXT}>Text</option>
                        <option value={questionTypes.YES_NO}>Yes/No</option>
                      </select>
                    </div>

                    {question.type === questionTypes.RATING && (
                      <div className="form-group">
                        <label>Rating Scale:</label>
                        <select
                          value={question.scale === ratingScales.FIVE_STAR ? 'five' : 'ten'}
                          onChange={(e) => updateQuestion(index, { 
                            scale: e.target.value === 'five' ? ratingScales.FIVE_STAR : ratingScales.TEN_POINT 
                          })}
                        >
                          <option value="five">1-5 Stars</option>
                          <option value="ten">1-10 Points</option>
                        </select>
                      </div>
                    )}

                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={question.required}
                          onChange={(e) => updateQuestion(index, { required: e.target.checked })}
                        />
                        Required
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleSaveForm} className="btn-primary">
              {editingForm ? 'Update Form' : 'Create Form'}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-forms">
      <div className="page-header">
        <h2>Manage Feedback Forms</h2>
        <div className="header-actions">
          <button type="button" onClick={() => handleCreateForm('course')} className="btn-primary">
            Create Course Form
          </button>
          <button type="button" onClick={() => handleCreateForm('instructor')} className="btn-primary">
            Create Instructor Form
          </button>
          <button type="button" onClick={() => handleCreateForm()} className="btn-secondary">
            Create Custom Form
          </button>
        </div>
      </div>

      <div className="forms-grid">
        {feedbackForms.length === 0 ? (
          <div className="empty-state">
            <h3>No feedback forms created yet</h3>
            <p>Create your first feedback form to start collecting student responses.</p>
          </div>
        ) : (
          feedbackForms.map(form => (
            <div key={form.id} className="form-card">
              <div className="form-card-header">
                <h3>{form.title}</h3>
                <div className="form-actions">
                  <button type="button" onClick={() => handleEditForm(form)} className="btn-small">Edit</button>
                  <button type="button" onClick={() => handleDeleteForm(form.id)} className="btn-danger-small">Delete</button>
                </div>
              </div>
              <div className="form-card-body">
                {form.description && <p>{form.description}</p>}
                <div className="form-meta">
                  <span className="meta-item">Questions: {form.questions.length}</span>
                  <span className="meta-item">Type: {form.targetType}</span>
                  <span className={`status ${form.isActive ? 'active' : 'inactive'}`}>
                    {form.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminForms;