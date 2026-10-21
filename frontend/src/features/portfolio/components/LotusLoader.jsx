import React, { useEffect, useState } from 'react';

// ── Shared Lotus SVG ──────────────────────────────────────────────────────────
// Exported so it can be used inline (e.g. inside buttons, canvas panels)
// `size` controls diameter in px. `className` forwarded for custom animation override.
export function LotusSpinner({ size = 120, className = 'lotus-loader-spin' }) {
  return (
    <div className={className} style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="lotus-loader-svg"
      >
        {/* Outer petals ring */}
        <g opacity="0.9">
          <path d="M100 100 C85 75 85 40 100 20 C115 40 115 75 100 100Z"       fill="#CF2229" opacity="0.85" />
          <path d="M100 100 C75 85 40 85 20 100 C40 115 75 115 100 100Z"       fill="#CF2229" opacity="0.75" />
          <path d="M100 100 C115 125 115 160 100 180 C85 160 85 125 100 100Z"  fill="#CF2229" opacity="0.85" />
          <path d="M100 100 C125 115 160 115 180 100 C160 85 125 85 100 100Z"  fill="#CF2229" opacity="0.75" />
        </g>
        {/* Diagonal petals (45 deg) */}
        <g opacity="0.7">
          <path d="M100 100 C75 68 65 35 78 15 C100 30 110 65 100 100Z"        fill="#CF2229" opacity="0.6" />
          <path d="M100 100 C132 75 165 65 185 78 C170 100 135 110 100 100Z"   fill="#CF2229" opacity="0.6" />
          <path d="M100 100 C125 132 135 165 122 185 C100 170 90 135 100 100Z" fill="#CF2229" opacity="0.6" />
          <path d="M100 100 C68 125 35 135 15 122 C30 100 65 90 100 100Z"      fill="#CF2229" opacity="0.6" />
        </g>
        {/* Inner accent petals */}
        <g opacity="0.55">
          <path d="M100 100 C92 85 92 65 100 52 C108 65 108 85 100 100Z"       fill="#3D3F47" />
          <path d="M100 100 C85 108 65 108 52 100 C65 92 85 92 100 100Z"       fill="#3D3F47" />
          <path d="M100 100 C108 115 108 135 100 148 C92 135 92 115 100 100Z"  fill="#3D3F47" />
          <path d="M100 100 C115 92 135 92 148 100 C135 108 115 108 100 100Z"  fill="#3D3F47" />
        </g>
        {/* Center circle */}
        <circle cx="100" cy="100" r="14" fill="#CF2229" opacity="0.95" />
        <circle cx="100" cy="100" r="7"  fill="white"   opacity="0.8"  />
        {/* Outer dashed ring trace */}
        <circle cx="100" cy="100" r="90" stroke="#CF2229" strokeWidth="1" strokeDasharray="12 6" opacity="0.2" />
      </svg>
    </div>
  );
}

// ── Full-screen page loader overlay ──────────────────────────────────────────
/**
 * Full-screen lotus spinner shown while portfolio data is fetching.
 * Fades out gracefully once `isLoading` becomes false.
 */
export default function LotusLoader({ isLoading }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => setVisible(false), 700);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div
      className={`lotus-loader-overlay ${isLoading ? 'lotus-loader--in' : 'lotus-loader--out'}`}
      aria-label="Loading portfolio..."
      role="status"
    >
      {/* Ambient glow */}
      <div className="lotus-loader-glow" />

      {/* Spinning lotus */}
      <LotusSpinner size={120} />

      {/* Pulsing ring */}
      <div className="lotus-loader-ring" />

      {/* Label */}
      <p className="lotus-loader-label">Loading...</p>
    </div>
  );
}
