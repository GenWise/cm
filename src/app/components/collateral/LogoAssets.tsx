import React from 'react';
import eiAssetLogoDark from '../../../assets/b51fc3783280bd8bd21b98b5f41adca6954f4d27.png';
import genWiseLogoDark from '../../../assets/2346d2ca97c79c94598e3fc96c102fc52b2f7ad3.png';

export type LogoVariant = 'default' | 'white' | 'dark';

interface LogoProps {
  variant?: LogoVariant;
  height?: number;
  className?: string;
}

// Ei ASSET Logo Component
// The logo already has its own background and works on any background color
export const EiAssetLogo: React.FC<LogoProps> = ({ 
  variant = 'default', 
  height = 40,
  className = '' 
}) => {
  return (
    <img 
      src={eiAssetLogoDark} 
      alt="Ei ASSET"
      style={{ height: `${height}px` }}
      className={`object-contain ${className}`}
    />
  );
};

// GenWise Logo Component with variants
// White variant for dark backgrounds - inverts text while preserving the EXACT orange circle
export const GenWiseLogo: React.FC<LogoProps> = ({ 
  variant = 'default', 
  height = 40,
  className = '' 
}) => {
  if (variant === 'white') {
    // White version for dark backgrounds
    // Use SVG filter to selectively invert everything EXCEPT orange/warm colors
    return (
      <div className={`relative ${className}`} style={{ height: `${height}px`, display: 'inline-block' }}>
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <filter id="invert-keep-orange">
              {/* Step 1: Invert all colors */}
              <feColorMatrix
                type="matrix"
                values="-1 0 0 0 1
                        0 -1 0 0 1
                        0 0 -1 0 1
                        0 0 0 1 0"
                result="inverted"
              />
              
              {/* Step 2: Create a mask for orange colors in original */}
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        1 -0.5 -0.5 0 0"
                result="orangeMask"
              />
              
              {/* Step 3: Blend original orange with inverted rest */}
              <feComposite
                in="SourceGraphic"
                in2="orangeMask"
                operator="in"
                result="orangeOnly"
              />
              
              <feComposite
                in="inverted"
                in2="orangeMask"
                operator="out"
                result="invertedNoOrange"
              />
              
              <feBlend
                in="orangeOnly"
                in2="invertedNoOrange"
                mode="normal"
              />
            </filter>
          </defs>
        </svg>
        <img 
          src={genWiseLogoDark} 
          alt="GenWise"
          style={{ 
            height: `${height}px`,
            filter: 'url(#invert-keep-orange)',
          }}
          className="object-contain"
        />
      </div>
    );
  }
  
  // Default variant uses the original logo
  return (
    <img 
      src={genWiseLogoDark} 
      alt="GenWise"
      style={{ height: `${height}px` }}
      className={`object-contain ${className}`}
    />
  );
};

// Combined logo assets for easy import
export const LogoAssets = {
  EiAsset: EiAssetLogo,
  GenWise: GenWiseLogo,
};

// Direct image imports for backward compatibility
export { eiAssetLogoDark, genWiseLogoDark };