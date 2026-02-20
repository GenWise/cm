/**
 * Platform video specifications and requirements
 */

export interface PlatformSpec {
  name: string;
  key: string;
  icon: string;
  color: string;
  videoSpecs: {
    aspectRatio: string[];
    maxDuration: number; // in seconds
    minDuration?: number;
    maxFileSize: string;
    formats: string[];
    resolution: string[];
  };
  notes: string[];
  penalizesYouTube: boolean;
}

export const PLATFORM_SPECS: Record<string, PlatformSpec> = {
  youtube: {
    name: 'YouTube',
    key: 'youtube',
    icon: '▶️',
    color: '#FF0000',
    videoSpecs: {
      aspectRatio: ['16:9', '9:16', '1:1', '4:5'],
      maxDuration: 43200, // 12 hours for verified
      maxFileSize: '256 GB',
      formats: ['MP4', 'MOV', 'AVI', 'WMV'],
      resolution: ['1080p', '4K', '8K'],
    },
    notes: [
      'Best for long-form content',
      'Supports highest quality',
      'Ideal for tutorials and webinars',
    ],
    penalizesYouTube: false,
  },
  linkedin: {
    name: 'LinkedIn',
    key: 'linkedin',
    icon: '💼',
    color: '#0A66C2',
    videoSpecs: {
      aspectRatio: ['16:9', '1:1', '9:16', '4:5'],
      maxDuration: 600, // 10 minutes
      minDuration: 3,
      maxFileSize: '5 GB',
      formats: ['MP4', 'MOV'],
      resolution: ['720p', '1080p'],
    },
    notes: [
      'Native videos get 5x more engagement',
      'Penalizes YouTube links',
      'Square (1:1) performs best',
      'Add captions - 85% watch without sound',
    ],
    penalizesYouTube: true,
  },
  facebook: {
    name: 'Facebook',
    key: 'facebook',
    icon: '👥',
    color: '#1877F2',
    videoSpecs: {
      aspectRatio: ['16:9', '1:1', '9:16', '4:5'],
      maxDuration: 240, // 4 hours
      minDuration: 1,
      maxFileSize: '10 GB',
      formats: ['MP4', 'MOV'],
      resolution: ['720p', '1080p'],
    },
    notes: [
      'Native videos get 10x more reach',
      'Strongly penalizes YouTube links',
      'Square (1:1) or vertical (9:16) preferred',
      'Captions increase view time by 12%',
    ],
    penalizesYouTube: true,
  },
  instagram: {
    name: 'Instagram',
    key: 'instagram',
    icon: '📷',
    color: '#E4405F',
    videoSpecs: {
      aspectRatio: ['1:1', '4:5', '9:16'],
      maxDuration: 60, // Feed: 60s, Reels: 90s
      minDuration: 3,
      maxFileSize: '4 GB',
      formats: ['MP4', 'MOV'],
      resolution: ['1080p'],
    },
    notes: [
      'Reels: 9:16 vertical, up to 90s',
      'Feed posts: 1:1 or 4:5, up to 60s',
      'Stories: 9:16 vertical, up to 60s',
      'No external links in captions',
    ],
    penalizesYouTube: true,
  },
  instagram_reels: {
    name: 'Instagram Reels',
    key: 'instagram_reels',
    icon: '🎬',
    color: '#C13584',
    videoSpecs: {
      aspectRatio: ['9:16'],
      maxDuration: 90,
      minDuration: 3,
      maxFileSize: '4 GB',
      formats: ['MP4', 'MOV'],
      resolution: ['1080x1920'],
    },
    notes: [
      'Must be vertical (9:16)',
      'Trending audio increases reach',
      'Hook viewers in first 3 seconds',
      'Use on-screen text, no captions needed',
    ],
    penalizesYouTube: true,
  },
  twitter: {
    name: 'Twitter/X',
    key: 'twitter',
    icon: '🐦',
    color: '#1DA1F2',
    videoSpecs: {
      aspectRatio: ['16:9', '1:1'],
      maxDuration: 140, // 2:20 for most users
      minDuration: 0.5,
      maxFileSize: '512 MB',
      formats: ['MP4', 'MOV'],
      resolution: ['720p', '1080p'],
    },
    notes: [
      'Keep under 2 minutes for best engagement',
      'Square (1:1) works well in feed',
      'Add captions - autoplay is muted',
      'Twitter Blue: up to 60 minutes',
    ],
    penalizesYouTube: true,
  },
  whatsapp: {
    name: 'WhatsApp',
    key: 'whatsapp',
    icon: '💬',
    color: '#25D366',
    videoSpecs: {
      aspectRatio: ['16:9', '1:1', '9:16'],
      maxDuration: 180, // 3 minutes via status
      minDuration: 1,
      maxFileSize: '16 MB', // Status: 16MB, Chat: 100MB
      formats: ['MP4', '3GP'],
      resolution: ['720p'],
    },
    notes: [
      'Status: Max 16 MB, 30 seconds',
      'Chat: Max 100 MB, 3 minutes',
      'Compress for faster sending',
      'Short clips (under 30s) work best',
    ],
    penalizesYouTube: false,
  },
  tiktok: {
    name: 'TikTok',
    key: 'tiktok',
    icon: '🎵',
    color: '#000000',
    videoSpecs: {
      aspectRatio: ['9:16'],
      maxDuration: 600, // 10 minutes
      minDuration: 3,
      maxFileSize: '4 GB',
      formats: ['MP4', 'MOV'],
      resolution: ['1080x1920'],
    },
    notes: [
      'Must be vertical (9:16)',
      'Optimal: 15-60 seconds',
      'Use trending sounds and hashtags',
      'Hook in first 2 seconds',
    ],
    penalizesYouTube: true,
  },
};

export const PLATFORM_KEYS = Object.keys(PLATFORM_SPECS);

/**
 * Get recommended aspect ratio for a platform
 */
export function getRecommendedAspectRatio(platform: string): string {
  const spec = PLATFORM_SPECS[platform];
  return spec?.videoSpecs.aspectRatio[0] || '16:9';
}

/**
 * Check if platform penalizes YouTube links
 */
export function penalizesYouTube(platform: string): boolean {
  return PLATFORM_SPECS[platform]?.penalizesYouTube || false;
}

/**
 * Get all platforms that need native uploads (penalize YouTube)
 */
export function getNativeUploadPlatforms(): PlatformSpec[] {
  return Object.values(PLATFORM_SPECS).filter(p => p.penalizesYouTube);
}

/**
 * Format duration in seconds to readable string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  return `${Math.floor(seconds / 3600)}h`;
}

/**
 * Check if video specs meet platform requirements
 */
export function checkPlatformCompatibility(
  platform: string,
  duration: number,
  aspectRatio: string,
  fileSize: number
): { compatible: boolean; issues: string[] } {
  const spec = PLATFORM_SPECS[platform];
  if (!spec) return { compatible: false, issues: ['Unknown platform'] };

  const issues: string[] = [];

  // Check duration
  if (duration > spec.videoSpecs.maxDuration) {
    issues.push(`Too long (max ${formatDuration(spec.videoSpecs.maxDuration)})`);
  }
  if (spec.videoSpecs.minDuration && duration < spec.videoSpecs.minDuration) {
    issues.push(`Too short (min ${formatDuration(spec.videoSpecs.minDuration)})`);
  }

  // Check aspect ratio
  if (!spec.videoSpecs.aspectRatio.includes(aspectRatio)) {
    issues.push(`Aspect ratio not supported (use ${spec.videoSpecs.aspectRatio.join(', ')})`);
  }

  return {
    compatible: issues.length === 0,
    issues,
  };
}
