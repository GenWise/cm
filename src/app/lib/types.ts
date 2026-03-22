// Database types

export interface Program {
  id: string;
  name: string;
  full_name?: string;
  description?: string;
  color?: string;
  created_at?: string;
}

export interface Video {
  id: string;
  program_id?: string;
  title: string;
  subject_name?: string;
  subject_role?: string;
  subject_org?: string;
  raw_video_url?: string;
  raw_video_drive_id?: string;
  portrait_video_url?: string;
  landscape_video_url?: string;
  thumbnail_url?: string;
  transcript_text?: string;
  captions_srt_url?: string;
  duration_seconds?: number;
  recorded_date?: string;
  status?: 'draft' | 'editing' | 'review' | 'published';
  tags?: string; // JSON array as string - manual video-level tags
  created_at?: string;
  updated_at?: string;
}

// Video with computed tag aggregation
export interface VideoWithTags extends Video {
  manual_tags: string[]; // Tags set directly on video
  clip_tags: string[]; // Unique tags aggregated from all clips
  all_tags: string[]; // Combined unique tags from both sources
}

export interface Clip {
  id: string;
  video_id: string;
  start_time: string;
  end_time: string;
  start_seconds?: number;
  end_seconds?: number;
  duration_seconds?: number;
  title?: string;
  description: string;
  transcript_snippet?: string;
  tags: string; // JSON array as string - granular clip-level tags
  extracted_clip_url?: string;
  created_at?: string;
}

export interface Campaign {
  id: string;
  name: string;
  program_id?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
}

// Extended types with relations
export interface VideoWithProgram extends Video {
  program?: Program;
  clips?: Clip[];
}

export interface ClipWithVideo extends Clip {
  video?: Video;
}

// Raw Sources - tracking content origins
export type RawSourceType =
  | 'feedback_sheet'
  | 'video_recording'
  | 'session_recording'
  | 'whatsapp_message'
  | 'email_thread'
  | 'survey_response'
  | 'social_media'
  | 'other';

export type RawSourceStatus = 'raw' | 'reviewing' | 'curated' | 'published' | 'archived';

export interface RawSource {
  id: string;
  program_id?: string;
  source_type: RawSourceType;
  title: string;
  description?: string;
  source_url?: string;
  source_id?: string;
  date_collected?: string;
  collected_by?: string;
  status: RawSourceStatus;
  testimonial_count: number;
  best_quotes: Array<{
    quote: string;
    author?: string;
    school?: string;
    track?: string;
    rating?: number;
  }>;
  notes?: string;
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

export interface RawSourceWithProgram extends RawSource {
  program?: Program;
}