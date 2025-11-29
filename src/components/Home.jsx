import React from 'react';
import { Link } from 'react-router-dom';
import { useFeedback } from '../context/FeedbackContext';
import HeroIllustration from './HeroIllustration';

const Home = () => {
  const { user } = useFeedback();

  if (user) {
    return (
      <div className="home-container">
        <section className="playful-hero playful-hero-logged">
          <div className="playful-inner">
            <div className="playful-left">
              <h1>Welcome back, {user.name || 'Friend'} ✨</h1>
              <p className="muted">Jump right into your dashboard or create a new form.</p>
              <div className="intro-buttons">
                {user.role === 'admin' ? (
                  <>
                    <Link to="/admin/forms" className="btn btn-primary">Create Form</Link>
                    <Link to="/admin/analytics" className="btn btn-outline">View Analytics</Link>
                  </>
                ) : (
                  <>
                    <Link to="/student/feedback" className="btn btn-primary">Give Feedback</Link>
                    <Link to="/student/results" className="btn btn-outline">See Results</Link>
                  </>
                )}
              </div>
            </div>
            <div className="playful-right">
              <HeroIllustration />
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="home-container">
      <section className="playful-hero">
        <div className="blobs">
          <span className="blob b1" />
          <span className="blob b2" />
          <span className="blob b3" />
        </div>

        <div className="playful-inner">
          <div className="playful-left">
            <h1 className="playful-title">Make feedback fun. Make it matter.</h1>
            <p className="playful-sub">Collect honest student feedback with delightful forms, beautiful analytics, and anonymity when needed.</p>

            <div className="playful-ctas">
              <Link to="/reg" className="btn btn-primary large">Sign Up — It's free</Link>
              <Link to="/login" className="btn btn-outline large">Try Demo</Link>
            </div>

            <div className="feature-tiles">
              <div className="tile">🎯 Easy forms</div>
              <div className="tile">🔒 Anonymous</div>
              <div className="tile">📈 Live analytics</div>
            </div>
          </div>

          <div className="playful-right">
            <HeroIllustration />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;