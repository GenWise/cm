import React from 'react';

export type M3LogoVariant = 'full' | 'badge' | 'stacked' | 'icon';
export type M3LogoTheme = 'crimson' | 'blue' | 'gradient' | 'white' | 'yellow';

interface M3LogoProps {
  variant?: M3LogoVariant;
  theme?: M3LogoTheme;
  height?: number;
  className?: string;
}

const themeColors = {
  crimson: {
    primary: '#A01E21',
    secondary: '#FFB700',
    text: '#FFFFFF',
  },
  blue: {
    primary: '#1848A0',
    secondary: '#FFB700',
    text: '#FFFFFF',
  },
  gradient: {
    primary: '#A01E21',
    secondary: '#1848A0',
    text: '#FFFFFF',
  },
  white: {
    primary: '#FFFFFF',
    secondary: '#A01E21',
    text: '#1F2937',
  },
  yellow: {
    primary: '#FFB700',
    secondary: '#A01E21',
    text: '#1F2937',
  },
};

export const M3Logo: React.FC<M3LogoProps> = ({ 
  variant = 'full', 
  theme = 'crimson',
  height = 60,
  className = '',
}) => {
  const colors = themeColors[theme];

  // Icon only - Lightbulb with M3 (represents clearing misconceptions/gaining clarity)
  if (variant === 'icon') {
    return (
      <svg 
        height={height} 
        viewBox="0 0 100 100" 
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Lightbulb shape */}
        <circle cx="50" cy="40" r="25" fill={colors.primary} opacity="0.2" />
        <path
          d="M 50 15 Q 65 15 65 30 Q 65 40 60 45 L 60 55 Q 60 60 55 60 L 45 60 Q 40 60 40 55 L 40 45 Q 35 40 35 30 Q 35 15 50 15 Z"
          fill={colors.primary}
        />
        {/* Light rays */}
        <line x1="50" y1="5" x2="50" y2="10" stroke={colors.secondary} strokeWidth="3" strokeLinecap="round" />
        <line x1="75" y1="15" x2="71" y2="19" stroke={colors.secondary} strokeWidth="3" strokeLinecap="round" />
        <line x1="85" y1="40" x2="80" y2="40" stroke={colors.secondary} strokeWidth="3" strokeLinecap="round" />
        <line x1="25" y1="15" x2="29" y2="19" stroke={colors.secondary} strokeWidth="3" strokeLinecap="round" />
        <line x1="15" y1="40" x2="20" y2="40" stroke={colors.secondary} strokeWidth="3" strokeLinecap="round" />
        
        {/* Base */}
        <rect x="43" y="60" width="14" height="4" rx="1" fill={colors.primary} />
        <rect x="45" y="64" width="10" height="6" rx="2" fill={colors.primary} />
        
        {/* M3 text overlay */}
        <text
          x="50"
          y="45"
          textAnchor="middle"
          fontSize="20"
          fontWeight="900"
          fill={colors.text}
          fontFamily="Poppins, sans-serif"
        >
          M3
        </text>
      </svg>
    );
  }

  // Badge version - Compact circular badge
  if (variant === 'badge') {
    return (
      <svg 
        height={height} 
        viewBox="0 0 120 120" 
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circular background */}
        <circle cx="60" cy="60" r="55" fill={colors.primary} />
        <circle cx="60" cy="60" r="50" fill={colors.secondary} opacity="0.15" />
        
        {/* Three M's arranged in a pattern */}
        <text
          x="60"
          y="72"
          textAnchor="middle"
          fontSize="48"
          fontWeight="900"
          fill={colors.text}
          fontFamily="Poppins, sans-serif"
          letterSpacing="-2"
        >
          M³
        </text>
        
        {/* Subtle sparkle/clarity indicators */}
        <circle cx="30" cy="30" r="4" fill={colors.secondary} />
        <circle cx="90" cy="30" r="3" fill={colors.secondary} />
        <circle cx="90" cy="90" r="4" fill={colors.secondary} />
      </svg>
    );
  }

  // Stacked version - M3 with tagline
  if (variant === 'stacked') {
    return (
      <svg 
        height={height} 
        viewBox="0 0 280 140" 
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {theme === 'gradient' && (
            <linearGradient id="m3-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A01E21" />
              <stop offset="100%" stopColor="#1848A0" />
            </linearGradient>
          )}
        </defs>
        
        {/* M3 large */}
        <text
          x="140"
          y="60"
          textAnchor="middle"
          fontSize="56"
          fontWeight="900"
          fill={theme === 'gradient' ? 'url(#m3-gradient)' : colors.primary}
          fontFamily="Poppins, sans-serif"
          letterSpacing="-1"
        >
          M³
        </text>
        
        {/* Divider line */}
        <line 
          x1="40" 
          y1="80" 
          x2="240" 
          y2="80" 
          stroke={colors.secondary} 
          strokeWidth="2" 
        />
        
        {/* Tagline */}
        <text
          x="140"
          y="105"
          textAnchor="middle"
          fontSize="16"
          fontWeight="600"
          fill={colors.text}
          fontFamily="Poppins, sans-serif"
          letterSpacing="1"
        >
          MY MISCONCEPTION MENTOR
        </text>
        
        {/* Lightbulb accent */}
        <circle cx="250" cy="35" r="18" fill={colors.secondary} opacity="0.3" />
        <path
          d="M 250 20 Q 258 20 258 28 Q 258 33 255 36 L 255 40 Q 255 42 253 42 L 247 42 Q 245 42 245 40 L 245 36 Q 242 33 242 28 Q 242 20 250 20 Z"
          fill={colors.secondary}
        />
      </svg>
    );
  }

  // Full version - Complete logo with name
  return (
    <svg 
      height={height} 
      viewBox="0 0 400 100" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {theme === 'gradient' && (
          <linearGradient id="m3-full-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A01E21" />
            <stop offset="100%" stopColor="#1848A0" />
          </linearGradient>
        )}
      </defs>
      
      {/* Icon element - lightbulb with cleared misconception symbol */}
      <g transform="translate(10, 20)">
        {/* Lightbulb background glow */}
        <circle cx="30" cy="30" r="25" fill={colors.secondary} opacity="0.2" />
        
        {/* Lightbulb */}
        <path
          d="M 30 10 Q 42 10 42 22 Q 42 30 38 34 L 38 42 Q 38 46 34 46 L 26 46 Q 22 46 22 42 L 22 34 Q 18 30 18 22 Q 18 10 30 10 Z"
          fill={colors.primary}
        />
        
        {/* Base */}
        <rect x="25" y="46" width="10" height="3" rx="1" fill={colors.primary} />
        <rect x="26" y="49" width="8" height="4" rx="1" fill={colors.primary} />
        
        {/* Checkmark (clarity achieved) */}
        <path
          d="M 24 28 L 28 32 L 36 24"
          fill="none"
          stroke={colors.text}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      
      {/* M3 Text - Bold and prominent */}
      <text
        x="85"
        y="58"
        fontSize="48"
        fontWeight="900"
        fill={theme === 'gradient' ? 'url(#m3-full-gradient)' : colors.primary}
        fontFamily="Poppins, sans-serif"
        letterSpacing="-1"
      >
        M³
      </text>
      
      {/* Full name */}
      <text
        x="175"
        y="45"
        fontSize="18"
        fontWeight="700"
        fill={colors.text}
        fontFamily="Poppins, sans-serif"
      >
        My Misconception
      </text>
      <text
        x="175"
        y="68"
        fontSize="18"
        fontWeight="700"
        fill={colors.text}
        fontFamily="Poppins, sans-serif"
      >
        Mentor
      </text>
      
      {/* Accent line */}
      <line 
        x1="175" 
        y1="52" 
        x2="360" 
        y2="52" 
        stroke={colors.secondary} 
        strokeWidth="2" 
      />
    </svg>
  );
};

export default M3Logo;
