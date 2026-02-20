-- GenWise Content Management - Initial Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/kkkcjcqvngyohzhqoanb/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROGRAMS
-- ============================================
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  full_name TEXT,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VIDEOS
-- ============================================
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  title TEXT NOT NULL,

  -- Subject/Speaker
  subject_name TEXT,
  subject_role TEXT,
  subject_org TEXT,

  -- Files (Google Drive links)
  raw_video_url TEXT,
  raw_video_drive_id TEXT,
  edited_video_url TEXT,
  final_video_url TEXT,

  -- Assets
  thumbnail_url TEXT,
  transcript_text TEXT,
  captions_srt_url TEXT,

  -- Metadata
  duration_seconds INTEGER,
  recorded_date DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'editing', 'review', 'published')),
  tags TEXT DEFAULT '[]', -- JSON array as string

  -- Full-text search
  search_vector TSVECTOR,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full-text search index
CREATE INDEX IF NOT EXISTS videos_search_idx ON videos USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS videos_program_idx ON videos(program_id);
CREATE INDEX IF NOT EXISTS videos_status_idx ON videos(status);

-- Auto-update search vector trigger
CREATE OR REPLACE FUNCTION videos_search_update() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.title, '') || ' ' ||
    COALESCE(NEW.subject_name, '') || ' ' ||
    COALESCE(NEW.subject_org, '') || ' ' ||
    COALESCE(NEW.transcript_text, '')
  );
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS videos_search_trigger ON videos;
CREATE TRIGGER videos_search_trigger
  BEFORE INSERT OR UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION videos_search_update();

-- ============================================
-- CLIPS
-- ============================================
CREATE TABLE IF NOT EXISTS clips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,

  -- Timing
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  start_seconds INTEGER,
  end_seconds INTEGER,
  duration_seconds INTEGER,

  -- Content
  title TEXT,
  description TEXT NOT NULL,
  transcript_snippet TEXT,
  tags TEXT NOT NULL DEFAULT '[]', -- JSON array as string

  -- Extracted clip
  extracted_clip_url TEXT,

  -- Full-text search
  search_vector TSVECTOR,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS clips_video_idx ON clips(video_id);
CREATE INDEX IF NOT EXISTS clips_search_idx ON clips USING GIN(search_vector);

-- Auto-update search vector trigger
CREATE OR REPLACE FUNCTION clips_search_update() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.title, '') || ' ' ||
    COALESCE(NEW.description, '') || ' ' ||
    COALESCE(NEW.transcript_snippet, '')
  );
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS clips_search_trigger ON clips;
CREATE TRIGGER clips_search_trigger
  BEFORE INSERT OR UPDATE ON clips
  FOR EACH ROW EXECUTE FUNCTION clips_search_update();

-- ============================================
-- CONTENT POSTS
-- ============================================
CREATE TABLE IF NOT EXISTS content_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Source content
  video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
  clip_id UUID REFERENCES clips(id) ON DELETE SET NULL,
  custom_asset_url TEXT,

  -- Platform & format
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'linkedin', 'whatsapp', 'instagram', 'twitter')),
  post_type TEXT CHECK (post_type IN ('video', 'reel', 'story', 'carousel', 'text', 'link')),

  -- Content
  title TEXT,
  caption TEXT,
  hashtags TEXT DEFAULT '[]', -- JSON array as string

  -- Workflow
  status TEXT DEFAULT 'idea' CHECK (status IN ('idea', 'draft', 'ready', 'scheduled', 'posted', 'failed')),
  assigned_to TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

  -- Dates
  idea_date DATE,
  target_date DATE,
  scheduled_date TIMESTAMPTZ,
  posted_at TIMESTAMPTZ,

  -- After posting
  platform_url TEXT,
  platform_id TEXT,

  -- Engagement metrics
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,

  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS content_posts_status_idx ON content_posts(status);
CREATE INDEX IF NOT EXISTS content_posts_platform_idx ON content_posts(platform);
CREATE INDEX IF NOT EXISTS content_posts_video_idx ON content_posts(video_id);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS content_posts_updated_at ON content_posts;
CREATE TRIGGER content_posts_updated_at
  BEFORE UPDATE ON content_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- CAMPAIGNS
-- ============================================
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CAMPAIGN ITEMS (Junction)
-- ============================================
CREATE TABLE IF NOT EXISTS campaign_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('video', 'clip', 'post')),
  item_id UUID NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, item_type, item_id)
);

-- ============================================
-- PLATFORM VIDEO VERSIONS (for native uploads)
-- ============================================
CREATE TABLE IF NOT EXISTS platform_video_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'facebook', 'instagram', 'instagram_reels', 'twitter', 'tiktok', 'youtube', 'whatsapp')),
  video_url TEXT NOT NULL,
  drive_file_id TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  file_size BIGINT,
  duration_seconds INTEGER,
  aspect_ratio TEXT CHECK (aspect_ratio IN ('1:1', '16:9', '9:16', '4:5')),
  resolution TEXT,
  format TEXT,
  notes TEXT,
  performance_metrics JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(video_id, platform)
);

CREATE INDEX IF NOT EXISTS platform_video_versions_video_idx ON platform_video_versions(video_id);
CREATE INDEX IF NOT EXISTS platform_video_versions_platform_idx ON platform_video_versions(platform);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default programs
INSERT INTO programs (name, full_name, description, color) VALUES
  ('M3', 'My Misconception Mentor', 'Math teacher professional development program', '#ef4444'),
  ('GSP', 'GenWise Summer Program', 'Summer enrichment for gifted students', '#22c55e'),
  ('TNP365', 'The Nurturing Programme 365', 'Year-round parent education program', '#3b82f6'),
  ('GenAI', 'GenAI for Education', 'AI literacy and implementation for schools', '#8b5cf6')
ON CONFLICT DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY (Disabled for MVP)
-- ============================================
-- Enable these when adding authentication:
-- ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE clips ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE content_posts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE platform_video_versions ENABLE ROW LEVEL SECURITY;

-- For now, allow all access (no auth)
-- CREATE POLICY "Allow all" ON programs FOR ALL USING (true);
-- CREATE POLICY "Allow all" ON videos FOR ALL USING (true);
-- etc.
