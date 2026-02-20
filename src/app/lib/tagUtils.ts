import type { Video, Clip, VideoWithTags } from './types';

/**
 * Parse tags from JSON string to array
 */
export function parseTags(tagsJson?: string): string[] {
  if (!tagsJson) return [];
  try {
    const parsed = JSON.parse(tagsJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Convert tags array to JSON string
 */
export function stringifyTags(tags: string[]): string {
  return JSON.stringify(tags);
}

/**
 * Aggregate tags from clips into a video object
 */
export function aggregateVideoTags(video: Video, clips?: Clip[]): VideoWithTags {
  // Parse manual video tags
  const manual_tags = parseTags(video.tags);
  
  // Aggregate unique tags from all clips
  const clip_tags = clips && clips.length > 0
    ? Array.from(new Set(
        clips.flatMap(clip => parseTags(clip.tags))
      ))
    : [];
  
  // Combine all unique tags
  const all_tags = Array.from(new Set([...manual_tags, ...clip_tags]));
  
  return {
    ...video,
    manual_tags,
    clip_tags,
    all_tags,
  };
}

/**
 * Get tag statistics for a video
 */
export function getTagStats(video: VideoWithTags) {
  return {
    total: video.all_tags.length,
    manual: video.manual_tags.length,
    fromClips: video.clip_tags.length,
  };
}

/**
 * Filter tags by source
 */
export function filterTagsBySource(
  video: VideoWithTags,
  source: 'manual' | 'clips' | 'all'
): string[] {
  switch (source) {
    case 'manual':
      return video.manual_tags;
    case 'clips':
      return video.clip_tags;
    case 'all':
    default:
      return video.all_tags;
  }
}

/**
 * Check if a tag is from clips only, manual only, or both
 */
export function getTagSource(
  tag: string,
  video: VideoWithTags
): 'manual' | 'clips' | 'both' {
  const inManual = video.manual_tags.includes(tag);
  const inClips = video.clip_tags.includes(tag);
  
  if (inManual && inClips) return 'both';
  if (inManual) return 'manual';
  return 'clips';
}
