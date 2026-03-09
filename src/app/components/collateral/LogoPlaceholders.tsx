import React from 'react';

export const EiAssetLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="40" rx="4" fill="#A01E21"/>
    <text x="10" y="26" fill="white" fontSize="18" fontWeight="bold" fontFamily="Poppins">
      Ei ASSET
    </text>
  </svg>
);

export const GenWiseLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="40" rx="4" fill="#1848A0"/>
    <text x="10" y="26" fill="white" fontSize="18" fontWeight="bold" fontFamily="Poppins">
      GenWise
    </text>
  </svg>
);

export const SchoolLogoPlaceholder: React.FC<{ className?: string; schoolName?: string }> = ({ 
  className, 
  schoolName = "SCHOOL" 
}) => (
  <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="38" fill="#FFB700" stroke="#A01E21" strokeWidth="2"/>
    <text 
      x="40" 
      y="45" 
      fill="#A01E21" 
      fontSize="16" 
      fontWeight="bold" 
      fontFamily="Poppins"
      textAnchor="middle"
    >
      {schoolName}
    </text>
  </svg>
);
