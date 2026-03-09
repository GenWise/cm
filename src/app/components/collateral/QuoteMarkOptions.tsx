import React from 'react';

// Option 1: Classic Typographic Quote (Unicode)
export const TypographicQuote: React.FC<{
  size: number;
  color: string;
  opacity?: number;
  top: number;
  left: number;
}> = ({ size, color, opacity = 0.15, top, left }) => (
  <div
    className="absolute pointer-events-none select-none"
    style={{
      top: `${top}px`,
      left: `${left}px`,
      fontSize: `${size}px`,
      color: color,
      opacity: opacity,
      fontFamily: 'Georgia, serif',
      fontWeight: 700,
      lineHeight: 1,
      zIndex: 5,
    }}
  >
    "
  </div>
);

// Option 2: Modern Minimalist SVG Quote
export const MinimalistQuote: React.FC<{
  size: number;
  color: string;
  opacity?: number;
  top: number;
  left: number;
}> = ({ size, color, opacity = 0.15, top, left }) => (
  <svg
    className="absolute pointer-events-none select-none"
    style={{
      top: `${top}px`,
      left: `${left}px`,
      width: `${size}px`,
      height: `${size}px`,
      opacity: opacity,
      zIndex: 5,
    }}
    viewBox="0 0 120 120"
    fill={color}
  >
    {/* Simple rounded quote marks */}
    <circle cx="30" cy="30" r="15" />
    <circle cx="30" cy="70" r="12" />
    <circle cx="70" cy="30" r="15" />
    <circle cx="70" cy="70" r="12" />
  </svg>
);

// Option 3: Professional Curly Quotes SVG
export const CurlyQuote: React.FC<{
  size: number;
  color: string;
  opacity?: number;
  top: number;
  left: number;
}> = ({ size, color, opacity = 0.15, top, left }) => (
  <svg
    className="absolute pointer-events-none select-none"
    style={{
      top: `${top}px`,
      left: `${left}px`,
      width: `${size}px`,
      height: `${size}px`,
      opacity: opacity,
      zIndex: 5,
    }}
    viewBox="0 0 150 150"
    fill={color}
  >
    {/* Left curly quote */}
    <path d="M 30 80 Q 20 60 30 40 Q 35 35 40 40 Q 35 50 35 60 Q 35 70 40 75 Q 35 80 30 80 Z" />
    {/* Right curly quote */}
    <path d="M 80 80 Q 70 60 80 40 Q 85 35 90 40 Q 85 50 85 60 Q 85 70 90 75 Q 85 80 80 80 Z" />
  </svg>
);

// Option 4: Bold Line Quote
export const BoldLineQuote: React.FC<{
  size: number;
  color: string;
  opacity?: number;
  top: number;
  left: number;
}> = ({ size, color, opacity = 0.2, top, left }) => (
  <svg
    className="absolute pointer-events-none select-none"
    style={{
      top: `${top}px`,
      left: `${left}px`,
      width: `${size}px`,
      height: `${size}px`,
      opacity: opacity,
      zIndex: 5,
    }}
    viewBox="0 0 100 100"
    fill="none"
    stroke={color}
    strokeWidth="8"
    strokeLinecap="round"
  >
    {/* Simple quotation mark made of thick lines */}
    <path d="M 20 50 L 20 20" />
    <path d="M 35 50 L 35 20" />
  </svg>
);

// Option 5: No quote marks (cleanest option)
export const NoQuote: React.FC = () => null;
