// Cropped school logos - whitespace removed for better visibility in slides
// These are tightly cropped versions optimized for the Social Proof slide

// Note: These are placeholder cropped versions. In a real scenario, you would:
// 1. Use the Logo Cropper tool to process the actual logo images
// 2. Export the cropped versions
// 3. Re-import them to Figma
// 4. Update these imports with the new figma:asset URLs

// For now, I'll create CSS-based crops using object-fit and custom containers
// that will effectively "zoom in" on the logos to remove whitespace

export const croppedLogoStyles = {
  gems: {
    // GEMS Modern Academy - horizontal logo with lots of whitespace
    objectFit: 'contain' as const,
    objectPosition: 'center',
    scaleLandscape: 2.5,  // 16:9 landscape
    scalePortrait: 2.5,   // 9:16 portrait (updated per user request)
    padding: '0'
  },
  millennium: {
    // The Millennium School - horizontal with whitespace
    objectFit: 'contain' as const,
    objectPosition: 'center',
    scaleLandscape: 2.5,  // 16:9 landscape
    scalePortrait: 2.5,   // 9:16 portrait (updated per user request)
    padding: '0'
  },
  pict: {
    // PICT Model School - square logo, no scaling needed
    objectFit: 'contain' as const,
    objectPosition: 'center',
    scaleLandscape: 1.0,
    scalePortrait: 1.0,
    padding: '4px'
  },
  psbb: {
    // PSBB Senior Secondary School - square logo, no scaling needed
    objectFit: 'contain' as const,
    objectPosition: 'center',
    scaleLandscape: 1.0,
    scalePortrait: 1.0,
    padding: '4px'
  },
  sanskriti: {
    // Sanskriti The Gurukul - square logo, no scaling needed
    objectFit: 'contain' as const,
    objectPosition: 'center',
    scaleLandscape: 1.0,
    scalePortrait: 1.0,
    padding: '4px'
  },
  shivNadar: {
    // Shiv Nadar School - needs scaling for landscape
    objectFit: 'contain' as const,
    objectPosition: 'center',
    scaleLandscape: 1.8,  // 16:9 landscape (custom per user request)
    scalePortrait: 1.7,   // 9:16 portrait
    padding: '4px'
  },
  gear: {
    // GEAR - horizontal logo with lots of whitespace
    objectFit: 'contain' as const,
    objectPosition: 'center',
    scaleLandscape: 2.0,
    scalePortrait: 2.0,
    padding: '0'
  },
  sriKumaran: {
    // Sri Kumaran Children's Home - horizontal with whitespace
    objectFit: 'contain' as const,
    objectPosition: 'center',
    scaleLandscape: 2.5,  // 16:9 landscape (custom per user request)
    scalePortrait: 2.5,   // 9:16 portrait (updated per user request)
    padding: '0'
  },
  tvs: {
    // TVS Academy - square logo, no scaling needed
    objectFit: 'contain' as const,
    objectPosition: 'center',
    scaleLandscape: 1.0,
    scalePortrait: 1.0,
    padding: '4px'
  }
};

// Helper function to get cropped style for a logo by index and aspect ratio
export const getCroppedLogoStyle = (index: number, isLandscape: boolean = false) => {
  const styles = [
    croppedLogoStyles.gems,
    croppedLogoStyles.millennium,
    croppedLogoStyles.pict,
    croppedLogoStyles.psbb,
    croppedLogoStyles.sanskriti,
    croppedLogoStyles.shivNadar,
    croppedLogoStyles.gear,
    croppedLogoStyles.sriKumaran,
    croppedLogoStyles.tvs,
  ];
  const style = styles[index] || croppedLogoStyles.psbb;
  
  return {
    objectFit: style.objectFit,
    objectPosition: style.objectPosition,
    scale: isLandscape ? style.scaleLandscape : style.scalePortrait,
    padding: style.padding
  };
};