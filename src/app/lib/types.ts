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
  edited_video_url?: string;
  final_video_url?: string;
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

export interface ContentPost {
  id: string;
  video_id?: string;
  clip_id?: string;
  custom_asset_url?: string;
  platform: 'youtube' | 'linkedin' | 'whatsapp' | 'instagram' | 'twitter';
  post_type?: string;
  title?: string;
  caption?: string;
  hashtags?: string; // JSON array as string
  mentions?: string; // JSON array of @handles to tag, e.g. ["@GenWise_", "@M3Program"]
  status?: 'idea' | 'draft' | 'ready' | 'scheduled' | 'posted' | 'failed';
  assigned_to?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  idea_date?: string;
  target_date?: string;
  scheduled_date?: string;
  posted_at?: string;
  platform_url?: string;
  platform_id?: string;
  // Thread support (for putting URLs in replies to avoid Twitter penalties)
  parent_post_id?: string; // If set, this is a reply/continuation
  thread_position?: number; // 0=original, 1+=replies
  views?: number;
  likes?: number;
  shares?: number;
  comments?: number;
  saves?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
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
  posts?: ContentPost[];
}

export interface ClipWithVideo extends Clip {
  video?: Video;
}

export interface PostWithRelations extends ContentPost {
  video?: Video;
  clip?: Clip;
}