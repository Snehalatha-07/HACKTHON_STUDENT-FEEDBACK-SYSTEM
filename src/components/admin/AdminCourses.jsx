import React, { useState } from 'react';
import { useFeedback } from '../../context/FeedbackContext';
import { generateId } from '../../utils/data';

const AdminCourses = () => {
  const { courses, instructors, addCourse, updateCourse, deleteCourse, addInstructor, updateInstructor, deleteInstructor } = useFeedback();
  const [activeTab, setActiveTab] = useState('courses');
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddInstructor, setShowAddInstructor] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingInstructor, setEditingInstructor] = useState(null);
  
  const [courseData, setCourseData] = useState({
    name: '',
    instructor: '',
    department: '',
    description: ''
  });

  const [instructorData, setInstructorData] = useState({
    name: '',
    department: '',
    email: '',
    bio: ''
  });

  const resetCourseForm = () => {
    setCourseData({ name: '', instructor: '', department: '', description: '' });
    setEditingCourse(null);
    setShowAddCourse(false);
  };

  const resetInstructorForm = () => {
    setInstructorData({ name: '', department: '', email: '', bio: '' });
    setEditingInstructor(null);
    setShowAddInstructor(false);
  };

  const handleSaveCourse = () => {
    if (!courseData.name.trim() || !courseData.instructor.trim() || !courseData.department.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingCourse) {
      updateCourse({ ...editingCourse, ...courseData });
    } else {
      addCourse(courseData);
    }
    resetCourseForm();
  };

  const handleSaveInstructor = () => {
    if (!instructorData.name.trim() || !instructorData.department.trim() || !instructorData.email.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingInstructor) {
      updateInstructor({ ...editingInstructor, ...instructorData });
    } else {
      addInstructor(instructorData);
    }
    resetInstructorForm();
  };

  const handleEditCourse = (course) => {
    setCourseData(course);
    setEditingCourse(course);
    setShowAddCourse(true);
  };

  const handleEditInstructor = (instructor) => {
    setInstructorData(instructor);
    setEditingInstructor(instructor);
    setShowAddInstructor(true);
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteCourse(courseId);
    }
  };

  const handleDeleteInstructor = (instructorId) => {
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      deleteInstructor(instructorId);
    }
  };

  return (
    <div className="admin-courses">
      <div className="page-header">
        <h2>Manage Courses & Instructors</h2>
      </div>

      <div className="tabs">
        <button 
          type="button"
          className={`tab ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          Courses ({courses.length})
        </button>
        <button 
          type="button"
          className={`tab ${activeTab === 'instructors' ? 'active' : ''}`}
          onClick={() => setActiveTab('instructors')}
        >
          Instructors ({instructors.length})
        </button>
      </div>

      {activeTab === 'courses' && (
        <div className="courses-section">
          <div className="section-header">
            <h3>Courses</h3>
            <button type="button" onClick={() => setShowAddCourse(true)} className="btn btn-primary">
              Add Course
            </button>
          </div>

          {showAddCourse && (
            <div className="form-modal">
              <div className="form-content">
                <div className="form-header">
                  <h4>{editingCourse ? 'Edit Course' : 'Add New Course'}</h4>
                  <button type="button" onClick={resetCourseForm} className="btn close-btn">×</button>
                </div>
                
                <div className="form-body">
                  <div className="form-group">
                    <label>Course Name *</label>
                    <input
                      type="text"
                      value={courseData.name}
                      onChange={(e) => setCourseData({ ...courseData, name: e.target.value })}
                      placeholder="Enter course name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Instructor *</label>
                    <input
                      type="text"
                      value={courseData.instructor}
                      onChange={(e) => setCourseData({ ...courseData, instructor: e.target.value })}
                      placeholder="Enter instructor name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Department *</label>
                    <input
                      type="text"
                      value={courseData.department}
                      onChange={(e) => setCourseData({ ...courseData, department: e.target.value })}
                      placeholder="Enter department"
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={courseData.description}
                      onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                      placeholder="Enter course description (optional)"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" onClick={handleSaveCourse} className="btn btn-primary">
                    {editingCourse ? 'Update Course' : 'Add Course'}
                  </button>
                  <button type="button" onClick={resetCourseForm} className="btn btn-secondary">Cancel</button>
                </div>
              </div>
            </div>
          )}

          <div className="courses-grid">
            {courses.length === 0 ? (
              <div className="empty-state">
                <h4>No courses added yet</h4>
                <p>Add your first course to start managing the curriculum.</p>
              </div>
            ) : (
              courses.map(course => (
                <div key={course.id} className="course-card">
                  <div className="course-header">
                    <h4>{course.name}</h4>
                    <div className="course-actions">
                      <button type="button" onClick={() => handleEditCourse(course)} className="btn btn-small">Edit</button>
                      <button type="button" onClick={() => handleDeleteCourse(course.id)} className="btn btn-danger-small">Delete</button>
                    </div>
                  </div>
                  <div className="course-details">
                    <p><strong>Instructor:</strong> {course.instructor}</p>
                    <p><strong>Department:</strong> {course.department}</p>
                    {course.description && <p><strong>Description:</strong> {course.description}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'instructors' && (
        <div className="instructors-section">
          <div className="section-header">
            <h3>Instructors</h3>
            <button type="button" onClick={() => setShowAddInstructor(true)} className="btn btn-primary">
              Add Instructor
            </button>
          </div>

          {showAddInstructor && (
            <div className="form-modal">
              <div className="form-content">
                <div className="form-header">
                  <h4>{editingInstructor ? 'Edit Instructor' : 'Add New Instructor'}</h4>
                  <button type="button" onClick={resetInstructorForm} className="btn close-btn">×</button>
                </div>
                
                <div className="form-body">
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      value={instructorData.name}
                      onChange={(e) => setInstructorData({ ...instructorData, name: e.target.value })}
                      placeholder="Enter instructor name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Department *</label>
                    <input
                      type="text"
                      value={instructorData.department}
                      onChange={(e) => setInstructorData({ ...instructorData, department: e.target.value })}
                      placeholder="Enter department"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={instructorData.email}
                      onChange={(e) => setInstructorData({ ...instructorData, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>

                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      value={instructorData.bio}
                      onChange={(e) => setInstructorData({ ...instructorData, bio: e.target.value })}
                      placeholder="Enter instructor bio (optional)"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" onClick={handleSaveInstructor} className="btn btn-primary">
                    {editingInstructor ? 'Update Instructor' : 'Add Instructor'}
                  </button>
                  <button type="button" onClick={resetInstructorForm} className="btn btn-secondary">Cancel</button>
                </div>
              </div>
            </div>
          )}

          <div className="instructors-grid">
            {instructors.length === 0 ? (
              <div className="empty-state">
                <h4>No instructors added yet</h4>
                <p>Add your first instructor to start managing faculty information.</p>
              </div>
            ) : (
              instructors.map(instructor => (
                <div key={instructor.id} className="instructor-card">
                  <div className="instructor-header">
                    <h4>{instructor.name}</h4>
                    <div className="instructor-actions">
                      <button type="button" onClick={() => handleEditInstructor(instructor)} className="btn btn-small">Edit</button>
                      <button type="button" onClick={() => handleDeleteInstructor(instructor.id)} className="btn btn-danger-small">Delete</button>
                    </div>
                  </div>
                  <div className="instructor-details">
                    <p><strong>Department:</strong> {instructor.department}</p>
                    <p><strong>Email:</strong> {instructor.email}</p>
                    {instructor.bio && <p><strong>Bio:</strong> {instructor.bio}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;