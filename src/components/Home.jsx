import React from 'react';
import { Link } from 'react-router-dom';
import { useFeedback } from '../context/FeedbackContext';
import HeroIllustration from './HeroIllustration';

const Home = () => {
  const { user } = useFeedback();

  // If user is logged in, show a compact dashboard header
  if (user) {
    return (
      <div className="home-container">
        <section className="intro-hero intro-hero-logged">
          <div className="intro-content">
            <h1>Welcome back, {user.name || 'User'} 👋</h1>
            <p className="intro-sub">Quick access to your feedback and analytics.</p>
            <div className="intro-buttons">
              {user.role === 'admin' ? (
                <>
                  <Link to="/admin/forms" className="btn btn-primary">Manage Forms</Link>
                  <Link to="/admin/analytics" className="btn btn-outline">Analytics</Link>
                </>
              ) : (
                <>
                  <Link to="/student/feedback" className="btn btn-primary">Give Feedback</Link>
                  <Link to="/student/results" className="btn btn-outline">View Results</Link>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Public landing page
  return (
    <div className="home-container">
      <section className="intro-hero">
        <div className="intro-inner">
          <div className="intro-content">
            <h1 className="intro-title">Student Feedback System</h1>
            <p className="intro-sub">
              Empowering students and educators with clear, actionable feedback —
              beautifully visualized and easy to manage.
            </p>

            <div className="intro-buttons">
              <Link to="/login" className="btn btn-primary">Get Started</Link>
              <Link to="/reg" className="btn btn-outline">Sign Up</Link>
            </div>

            <ul className="intro-features">
              <li>Simple feedback forms</li>
              <li>Anonymous responses</li>
              <li>Real-time analytics</li>
            </ul>
          </div>

          <div className="intro-art">
            <HeroIllustration />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;