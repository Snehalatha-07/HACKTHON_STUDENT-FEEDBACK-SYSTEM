import React from 'react';
import { Link } from 'react-router-dom';
import { useFeedback } from '../context/FeedbackContext';

const Home = () => {
  const { user } = useFeedback();

  if (user) {
    // If user is logged in, show a dashboard-style home page
    return (
      <div className="home-container">
        <div className="hero-section">
          <h1>Welcome to Student Feedback System</h1>
          <p className="hero-subtitle">
            {user.role === 'admin' 
              ? 'Manage feedback forms and analyze student responses' 
              : 'Provide feedback and view aggregated results'
            }
          </p>
          
          <div className="quick-actions">
            {user.role === 'admin' ? (
              <>
                <Link to="/admin/forms" className="action-card">
                  <h3>📝 Manage Forms</h3>
                  <p>Create and edit feedback forms</p>
                </Link>
                <Link to="/admin/analytics" className="action-card">
                  <h3>📊 View Analytics</h3>
                  <p>Analyze feedback data and insights</p>
                </Link>
                <Link to="/admin/courses" className="action-card">
                  <h3>🎓 Manage Courses</h3>
                  <p>Add and manage courses and instructors</p>
                </Link>
              </>
            ) : (
              <>
                <Link to="/student/feedback" className="action-card">
                  <h3>📝 Give Feedback</h3>
                  <p>Provide feedback on your courses</p>
                </Link>
                <Link to="/student/results" className="action-card">
                  <h3>📊 View Results</h3>
                  <p>See aggregated feedback results</p>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If user is not logged in, show welcome page
  return (
    <div className="home-container">
      <div className="hero-section hero-animated">
        <h1>Student Feedback & Evaluation System</h1>
        <p className="hero-subtitle">
          Collect and analyze student feedback to improve educational experiences
        </p>
        
        <div className="features-grid">
          <div className="feature-card">
            <h3>🎓 For Students</h3>
            <p>Provide feedback on courses, instructors, and institutional services</p>
            <ul>
              <li>Easy-to-use feedback forms</li>
              <li>Anonymous submissions</li>
              <li>View aggregated results</li>
            </ul>
          </div>
          
          <div className="feature-card">
            <h3>👨‍🏫 For Administrators</h3>
            <p>Create feedback forms and analyze data to improve education</p>
            <ul>
              <li>Create custom feedback forms</li>
              <li>Real-time analytics and insights</li>
              <li>Export data for further analysis</li>
            </ul>
          </div>
          
          <div className="feature-card">
            <h3>📊 Advanced Analytics</h3>
            <p>Gain insights from student feedback data</p>
            <ul>
              <li>Rating averages and distributions</li>
              <li>Text response analysis</li>
              <li>Trend tracking over time</li>
            </ul>
          </div>
        </div>
        
        <div className="cta-section">
          <Link to="/login" className="cta-button">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;