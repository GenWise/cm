import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { M3Logo } from './M3Logo';
import { EiAssetLogo, GenWiseLogo } from './LogoAssets';

export type CardSize = 'square' | 'landscape' | 'story' | 'compact';
export type CardTheme = 'crimson' | 'white' | 'blue' | 'gradient';

export interface TestimonialCardProps {
  quote: string;
  teacherName?: string;
  role?: string;
  subject?: string;
  schoolName?: string;
  teacherPhoto?: string;
  schoolLogo?: string;
  eiAssetLogo?: string;
  genwiseLogo?: string;
  size?: CardSize;
  theme?: CardTheme;
  showPhoto?: boolean;
  showSchoolLogo?: boolean;
}

const sizeConfig = {
  square: { width: 1080, height: 1080, quoteFontSize: 42, nameFontSize: 32, roleFontSize: 22, schoolFontSize: 28, padding: 70, photoSize: 90 },
  landscape: { width: 1200, height: 628, quoteFontSize: 36, nameFontSize: 28, roleFontSize: 20, schoolFontSize: 24, padding: 60, photoSize: 80 },
  story: { width: 1080, height: 1920, quoteFontSize: 48, nameFontSize: 36, roleFontSize: 24, schoolFontSize: 32, padding: 80, photoSize: 100 },
  compact: { width: 600, height: 400, quoteFontSize: 24, nameFontSize: 18, roleFontSize: 14, schoolFontSize: 16, padding: 40, photoSize: 60 },
};

const themeConfig = {
  crimson: {
    background: '#A01E21',
    text: '#FFFFFF',
    accent: '#FFB700',
    secondary: '#E5E5E5',
  },
  white: {
    background: '#FFFFFF',
    text: '#1F2937',
    accent: '#A01E21',
    secondary: '#6B7280',
  },
  blue: {
    background: '#1848A0',
    text: '#FFFFFF',
    accent: '#FFB700',
    secondary: '#E5E5E5',
  },
  gradient: {
    background: 'linear-gradient(135deg, #A01E21 0%, #1848A0 100%)',
    text: '#FFFFFF',
    accent: '#FFB700',
    secondary: '#E5E5E5',
  },
};

// Smart quote truncation - finds natural break point
const truncateQuote = (text: string, maxLength: number = 180): string => {
  if (text.length <= maxLength) return text;
  
  // Try to break at sentence end
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  if (sentences) {
    let truncated = '';
    for (const sentence of sentences) {
      if ((truncated + sentence).length <= maxLength) {
        truncated += sentence;
      } else {
        break;
      }
    }
    if (truncated) return truncated.trim();
  }
  
  // Fall back to word boundary
  const words = text.slice(0, maxLength).split(' ');
  words.pop(); // Remove last potentially cut-off word
  return words.join(' ') + '...';
};

export const TestimonialCardImproved = React.forwardRef<HTMLDivElement, TestimonialCardProps>(
({
  quote,
  teacherName,
  role,
  subject,
  schoolName,
  teacherPhoto,
  schoolLogo,
  eiAssetLogo,
  genwiseLogo,
  size = 'square',
  theme = 'crimson',
  showPhoto = true,
  showSchoolLogo = true,
}, ref) => {
  const config = sizeConfig[size];
  const colors = themeConfig[theme];
  
  // Smart truncation for static exports
  const displayQuote = truncateQuote(quote, size === 'story' ? 220 : size === 'landscape' ? 140 : 180);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative overflow-hidden"
      style={{
        width: `${config.width}px`,
        height: `${config.height}px`,
        background: colors.background,
        fontFamily: 'Poppins, sans-serif',
        color: colors.text,
      }}
    >
      {/* Header with logos and M3 badge */}
      <div 
        className="flex items-center justify-between relative z-10"
        style={{ padding: `${config.padding}px ${config.padding}px ${config.padding * 0.5}px` }}
      >
        {/* Ei ASSET Logo - Always original (has its own background) */}
        <EiAssetLogo 
          height={config.padding * 0.7}
        />
        
        {/* M3 Logo Badge - Professional circular badge */}
        <M3Logo 
          variant="badge"
          theme={theme === 'white' ? 'crimson' : 'yellow'}
          height={config.padding * 1.2}
        />
        
        {/* GenWise Logo - White variant on dark backgrounds, slightly larger to match visual weight */}
        <GenWiseLogo 
          variant={theme === 'white' ? 'default' : 'white'}
          height={config.padding * 0.75}
        />
      </div>

      {/* Quote Section - clean, no decorative quotes */}
      <div 
        className="relative z-10"
        style={{ 
          padding: `${config.padding * 0.8}px ${config.padding}px ${config.padding * 0.6}px`,
        }}
      >
        <div 
          style={{ 
            fontSize: `${config.quoteFontSize}px`,
            fontWeight: 400,
            lineHeight: 1.45,
            letterSpacing: '-0.01em',
          }}
        >
          {displayQuote}
        </div>
      </div>

      {/* Divider */}
      <div 
        className="mx-auto"
        style={{ 
          width: `${config.width - config.padding * 2}px`,
          height: '3px',
          backgroundColor: theme === 'white' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.25)',
          marginBottom: `${config.padding * 0.6}px`,
        }}
      />

      {/* Attribution Section - Much more prominent */}
      <div 
        className="relative z-10"
        style={{ 
          padding: `0 ${config.padding}px ${config.padding}px`,
        }}
      >
        <div className="flex items-center gap-5">
          {/* Teacher Photo - Larger */}
          {showPhoto && teacherPhoto && (
            <img
              src={teacherPhoto}
              alt={teacherName || 'Teacher'}
              className="rounded-full object-cover flex-shrink-0"
              style={{ 
                width: `${config.photoSize}px`,
                height: `${config.photoSize}px`,
                border: `4px solid ${colors.accent}`,
              }}
            />
          )}
          
          {/* Teacher Info - Larger, better hierarchy */}
          <div className="flex-1">
            {teacherName && (
              <div 
                style={{ 
                  fontSize: `${config.nameFontSize}px`,
                  fontWeight: 800, // Black weight for prominence
                  marginBottom: `${config.padding * 0.12}px`,
                  lineHeight: 1.2,
                }}
              >
                {teacherName}
              </div>
            )}
            
            {(role || subject) && (
              <div 
                style={{ 
                  fontSize: `${config.roleFontSize}px`,
                  color: colors.secondary,
                  fontWeight: 400,
                  marginBottom: `${config.padding * 0.15}px`,
                  lineHeight: 1.3,
                }}
              >
                {role}{role && subject && ' • '}{subject}
              </div>
            )}
            
            {schoolName && (
              <div 
                style={{ 
                  fontSize: `${config.schoolFontSize}px`,
                  fontWeight: 700, // Bold for school name
                  color: theme === 'white' ? '#A01E21' : colors.accent,
                  lineHeight: 1.3,
                }}
              >
                {schoolName}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* School Logo - Bottom right, subtle */}
      {showSchoolLogo && schoolLogo && (
        <div 
          className="absolute z-20"
          style={{
            bottom: `${config.padding * 0.7}px`,
            right: `${config.padding}px`,
          }}
        >
          <img
            src={schoolLogo}
            alt="School Logo"
            style={{ height: `${config.padding * 0.7}px` }}
            className="object-contain opacity-60"
          />
        </div>
      )}
    </motion.div>
  );
});

TestimonialCardImproved.displayName = 'TestimonialCardImproved';