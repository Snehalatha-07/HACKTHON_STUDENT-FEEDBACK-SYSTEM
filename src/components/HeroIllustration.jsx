import React from 'react';

const HeroIllustration = () => {
  return (
    <div className="hero-illustration" aria-hidden="true">
      <svg width="360" height="220" viewBox="0 0 360 220" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true" role="img">
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0ea5a4" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <g className="float-group">
          <ellipse cx="60" cy="60" rx="60" ry="40" fill="url(#g1)" className="blob blob-1" />
          <ellipse cx="200" cy="40" rx="50" ry="30" fill="#7c3aed" className="blob blob-2" opacity="0.9" />
          <ellipse cx="280" cy="120" rx="70" ry="45" fill="#06b6d4" className="blob blob-3" opacity="0.85" />
          <circle cx="140" cy="140" r="18" fill="#f97316" className="dot dot-1" />
          <circle cx="230" cy="70" r="10" fill="#84cc16" className="dot dot-2" />
        </g>
      </svg>
    </div>
  );
};

export default HeroIllustration;
