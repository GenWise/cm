import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Quote } from 'lucide-react';

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
  interactive?: boolean;
  maxQuoteLines?: number;
}

const sizeConfig = {
  square: { width: '1080px', height: '1080px', scale: 1 },
  landscape: { width: '1200px', height: '628px', scale: 1 },
  story: { width: '1080px', height: '1920px', scale: 1 },
  compact: { width: '600px', height: '400px', scale: 0.6 },
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

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
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
  interactive = true,
  maxQuoteLines = 3,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sizeStyles = sizeConfig[size];
  const colors = themeConfig[theme];
  
  const shouldTruncate = quote.length > 150;
  const displayQuote = !interactive || isExpanded ? quote : quote.slice(0, 150);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden shadow-2xl"
      style={{
        width: sizeStyles.width,
        minHeight: sizeStyles.height,
        background: colors.background,
        fontFamily: 'Poppins, sans-serif',
        color: colors.text,
      }}
    >
      {/* Header with logos */}
      <div className="flex items-center justify-between p-8 pb-6">
        <div className="flex items-center gap-4">
          {eiAssetLogo && (
            <img src={eiAssetLogo} alt="Ei ASSET" className="h-12 object-contain" />
          )}
        </div>
        
        {/* M3 Badge */}
        <div 
          className="px-6 py-2 rounded-full font-bold text-lg"
          style={{ 
            background: colors.accent,
            color: theme === 'white' ? '#1F2937' : '#1F2937'
          }}
        >
          M3
        </div>
        
        <div>
          {genwiseLogo && (
            <img src={genwiseLogo} alt="GenWise" className="h-12 object-contain" />
          )}
        </div>
      </div>

      {/* Quote Section */}
      <div className="px-8 py-6">
        <div className="relative">
          {/* Opening quote */}
          <Quote 
            className="absolute -top-4 -left-2 opacity-40" 
            size={60} 
            style={{ color: colors.accent, fill: colors.accent }}
          />
          
          <motion.div 
            className="pl-12 pr-4 text-xl leading-relaxed"
            style={{ 
              fontWeight: 400,
              lineHeight: '1.6',
            }}
            animate={{ height: isExpanded ? 'auto' : 'auto' }}
          >
            {displayQuote}
            {shouldTruncate && !isExpanded && interactive && '...'}
          </motion.div>

          {/* Closing quote */}
          <div className="flex justify-end pr-4">
            <Quote 
              className="opacity-40 rotate-180" 
              size={60} 
              style={{ color: colors.accent, fill: colors.accent }}
            />
          </div>
          
          {/* Show more/less button */}
          {interactive && shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 mt-2 pl-12 hover:opacity-80 transition-opacity"
              style={{ color: colors.accent, fontWeight: 500 }}
            >
              {isExpanded ? (
                <>
                  Show less <ChevronLeft size={16} />
                </>
              ) : (
                <>
                  Show more <ChevronRight size={16} />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div 
        className="mx-8 my-6 h-px"
        style={{ backgroundColor: theme === 'white' ? '#E5E7EB' : 'rgba(255, 255, 255, 0.3)' }}
      />

      {/* Attribution Section */}
      <div className="px-8 pb-8">
        <div className="flex items-start gap-4">
          {/* Teacher Photo */}
          {showPhoto && teacherPhoto && (
            <img
              src={teacherPhoto}
              alt={teacherName || 'Teacher'}
              className="w-16 h-16 rounded-full object-cover border-2"
              style={{ borderColor: colors.accent }}
            />
          )}
          
          {/* Teacher Info */}
          <div className="flex-1">
            {teacherName && (
              <div 
                className="text-lg mb-1"
                style={{ fontWeight: 600 }}
              >
                {teacherName}
              </div>
            )}
            
            {(role || subject) && (
              <div 
                className="text-sm mb-2"
                style={{ 
                  color: colors.secondary,
                  fontWeight: 400 
                }}
              >
                {role}{role && subject && ' • '}{subject}
              </div>
            )}
            
            {schoolName && (
              <div 
                className="text-base"
                style={{ 
                  fontWeight: 500,
                  color: theme === 'white' ? '#A01E21' : colors.accent
                }}
              >
                {schoolName}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* School Logo */}
      {showSchoolLogo && schoolLogo && (
        <div className="absolute bottom-6 right-8">
          <img
            src={schoolLogo}
            alt="School Logo"
            className="h-10 object-contain opacity-70"
          />
        </div>
      )}
    </motion.div>
  );
};

// Component for displaying multiple cards in a grid/gallery
export const TestimonialGallery: React.FC<{
  testimonials: TestimonialCardProps[];
  columns?: number;
}> = ({ testimonials, columns = 3 }) => {
  return (
    <div 
      className="grid gap-8 p-8"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {testimonials.map((testimonial, index) => (
        <div key={index} className="transform scale-50 origin-top-left">
          <TestimonialCard {...testimonial} />
        </div>
      ))}
    </div>
  );
};
