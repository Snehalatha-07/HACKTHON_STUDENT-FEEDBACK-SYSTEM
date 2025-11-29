import React from 'react';

const HeroIllustration = () => {
  return (
    <div className="hero-illustration" aria-hidden="true">
      <svg width="420" height="320" viewBox="0 0 420 320" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true" role="img">
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        <rect x="10" y="20" width="300" height="200" rx="20" fill="url(#g1)" opacity="0.12" />

        <g transform="translate(40,40)">
          <rect x="0" y="0" width="220" height="140" rx="14" fill="#fff" opacity="0.9" />
          <rect x="16" y="18" width="188" height="18" rx="6" fill="#f3f4f6" />
          <rect x="16" y="46" width="140" height="12" rx="6" fill="#eef2ff" />
          <rect x="16" y="66" width="170" height="12" rx="6" fill="#eef2ff" />
          <rect x="16" y="86" width="120" height="12" rx="6" fill="#eef2ff" />

          <g transform="translate(160,98)">
            <circle cx="12" cy="12" r="12" fill="#06b6d4" />
            <rect x="32" y="2" width="40" height="20" rx="10" fill="#34d399" />
          </g>
        </g>

        <g transform="translate(260,20)">
          <circle cx="60" cy="60" r="60" fill="#fff" opacity="0.06" />
          <path d="M20 130 C40 110, 80 110, 100 130" stroke="#fb923c" strokeWidth="6" fill="none" strokeLinecap="round" />
          <circle cx="80" cy="120" r="6" fill="#fb923c" />
        </g>
      </svg>
    </div>
  );
};

export default HeroIllustration;
