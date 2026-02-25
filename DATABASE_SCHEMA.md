# Database Schema - Platform Video Versions

## Overview

This document outlines the database schema for tracking platform-specific video versions in GenWise.

## New Table: platform_video_versions

### Purpose
Track optimized video versions for each social media platform (LinkedIn, Facebook, Instagram, etc.) to maximize reach and engagement.

### Schema

```sql
CREATE TABLE platform_video_versions (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign Keys
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  
  -- Platform Information
  platform VARCHAR(50) NOT NULL,
    -- Valid values: 'linkedin', 'facebook', 'instagram', 'instagram_reels', 
    --               'twitter', 'tiktok', 'youtube', 'whatsapp'
  
  -- Video File Information
  video_url TEXT NOT NULL,
    -- Google Drive URL or direct file URL
  drive_file_id VARCHAR(255),
    -- Extracted Google Drive file ID for quick access
  
  -- Video Metadata
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  file_size BIGINT,
    -- File size in bytes
  duration_seconds INTEGER,
    -- Video duration in seconds
  aspect_ratio VARCHAR(10),
    -- e.g., '1:1', '16:9', '9:16', '4:5'
  resolution VARCHAR(20),
    -- e.g., '1080p', '720p', '4K'
  format VARCHAR(10),
    -- e.g., 'MP4', 'MOV'
  
  -- Additional Information
  notes TEXT,
    -- Optional notes about this version
  performance_metrics JSONB,
    -- Store engagement data: views, likes, shares, etc.
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_video_platform UNIQUE (video_id, platform),
  CONSTRAINT valid_platform CHECK (
    platform IN (
      'linkedin', 'facebook', 'instagram', 'instagram_reels',
      'twitter', 'tiktok', 'youtube', 'whatsapp'
    )
  )
);

-- Indexes for performance
CREATE INDEX idx_platform_video_versions_video_id 
  ON platform_video_versions(video_id);

CREATE INDEX idx_platform_video_versions_platform 
  ON platform_video_versions(platform);

CREATE INDEX idx_platform_video_versions_uploaded_at 
  ON platform_video_versions(uploaded_at DESC);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_platform_video_versions_updated_at
  BEFORE UPDATE ON platform_video_versions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Usage Examples

### Insert a New Platform Version

```sql
INSERT INTO platform_video_versions (
  video_id,
  platform,
  video_url,
  drive_file_id,
  aspect_ratio,
  resolution,
  duration_seconds,
  file_size,
  format
) VALUES (
  '123e4567-e89b-12d3-a456-426614174000',
  'linkedin',
  'https://drive.google.com/file/d/abc123xyz/view',
  'abc123xyz',
  '1:1',
  '1080p',
  65,
  15728640, -- ~15 MB
  'MP4'
);
```

### Get All Platform Versions for a Video

```sql
SELECT 
  pvv.*,
  v.title as video_title
FROM platform_video_versions pvv
JOIN videos v ON v.id = pvv.video_id
WHERE pvv.video_id = '123e4567-e89b-12d3-a456-426614174000'
ORDER BY pvv.platform;
```

### Check Platform Coverage for All Videos

```sql
SELECT 
  v.id,
  v.title,
  COUNT(pvv.id) as versions_count,
  ARRAY_AGG(pvv.platform) as platforms_ready
FROM videos v
LEFT JOIN platform_video_versions pvv ON pvv.video_id = v.id
GROUP BY v.id, v.title
ORDER BY versions_count DESC;
```

### Find Videos Missing Critical Platform Versions

```sql
WITH critical_platforms AS (
  SELECT unnest(ARRAY['linkedin', 'facebook', 'instagram']) as platform
)
SELECT 
  v.id,
  v.title,
  cp.platform as missing_platform
FROM videos v
CROSS JOIN critical_platforms cp
LEFT JOIN platform_video_versions pvv 
  ON pvv.video_id = v.id AND pvv.platform = cp.platform
WHERE pvv.id IS NULL
  AND v.status = 'published'
ORDER BY v.title, cp.platform;
```

### Get Platform Version with Performance Metrics

```sql
SELECT 
  v.title,
  pvv.platform,
  pvv.aspect_ratio,
  pvv.duration_seconds,
  pvv.uploaded_at,
  pvv.performance_metrics->>'views' as views,
  pvv.performance_metrics->>'engagement_rate' as engagement_rate
FROM platform_video_versions pvv
JOIN videos v ON v.id = pvv.video_id
WHERE pvv.platform = 'linkedin'
ORDER BY (pvv.performance_metrics->>'views')::INTEGER DESC
LIMIT 10;
```

## Row Level Security (RLS)

If you're using Supabase with RLS:

```sql
-- Enable RLS
ALTER TABLE platform_video_versions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all platform versions
CREATE POLICY "Allow read access to all users"
  ON platform_video_versions
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can insert platform versions
CREATE POLICY "Allow authenticated users to insert"
  ON platform_video_versions
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Authenticated users can update their own versions
CREATE POLICY "Allow authenticated users to update"
  ON platform_video_versions
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: Authenticated users can delete platform versions
CREATE POLICY "Allow authenticated users to delete"
  ON platform_video_versions
  FOR DELETE
  USING (auth.role() = 'authenticated');
```

## TypeScript Types

```typescript
export interface PlatformVideoVersion {
  id: string;
  video_id: string;
  platform: 
    | 'linkedin'
    | 'facebook'
    | 'instagram'
    | 'instagram_reels'
    | 'twitter'
    | 'tiktok'
    | 'youtube'
    | 'whatsapp';
  video_url: string;
  drive_file_id?: string;
  uploaded_at: string;
  file_size?: number;
  duration_seconds?: number;
  aspect_ratio?: '1:1' | '16:9' | '9:16' | '4:5';
  resolution?: string;
  format?: 'MP4' | 'MOV' | 'AVI' | 'WMV';
  notes?: string;
  performance_metrics?: {
    views?: number;
    likes?: number;
    shares?: number;
    comments?: number;
    engagement_rate?: number;
    reach?: number;
    impressions?: number;
  };
  created_at: string;
  updated_at: string;
}

export interface PlatformVideoVersionWithVideo extends PlatformVideoVersion {
  video: {
    id: string;
    title: string;
    program_id: string;
  };
}
```

## API Functions

Example API functions for the backend:

```typescript
// Get all platform versions for a video
export async function getPlatformVersions(videoId: string) {
  const { data, error } = await supabase
    .from('platform_video_versions')
    .select('*')
    .eq('video_id', videoId)
    .order('platform');
  
  return { data, error };
}

// Create a new platform version
export async function createPlatformVersion(
  version: Omit<PlatformVideoVersion, 'id' | 'created_at' | 'updated_at'>
) {
  const { data, error } = await supabase
    .from('platform_video_versions')
    .insert([version])
    .select()
    .single();
  
  return { data, error };
}

// Update platform version
export async function updatePlatformVersion(
  id: string,
  updates: Partial<PlatformVideoVersion>
) {
  const { data, error } = await supabase
    .from('platform_video_versions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
}

// Delete platform version
export async function deletePlatformVersion(id: string) {
  const { error } = await supabase
    .from('platform_video_versions')
    .delete()
    .eq('id', id);
  
  return { error };
}

// Get platform coverage summary
export async function getPlatformCoverageSummary() {
  const { data, error } = await supabase.rpc('get_platform_coverage');
  return { data, error };
}
```

## Stored Procedure for Coverage Summary

```sql
CREATE OR REPLACE FUNCTION get_platform_coverage()
RETURNS TABLE (
  video_id UUID,
  video_title TEXT,
  program_name TEXT,
  total_platforms INTEGER,
  native_platforms_ready INTEGER,
  native_platforms_needed INTEGER,
  all_platforms_ready TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  WITH platform_counts AS (
    SELECT 
      v.id as video_id,
      v.title as video_title,
      p.name as program_name,
      COUNT(pvv.id) as total_platforms,
      COUNT(pvv.id) FILTER (
        WHERE pvv.platform IN ('linkedin', 'facebook', 'instagram', 'instagram_reels', 'twitter', 'tiktok')
      ) as native_platforms_ready,
      ARRAY_AGG(pvv.platform) as all_platforms_ready
    FROM videos v
    LEFT JOIN programs p ON p.id = v.program_id
    LEFT JOIN platform_video_versions pvv ON pvv.video_id = v.id
    GROUP BY v.id, v.title, p.name
  )
  SELECT 
    pc.video_id,
    pc.video_title,
    pc.program_name,
    COALESCE(pc.total_platforms, 0)::INTEGER,
    COALESCE(pc.native_platforms_ready, 0)::INTEGER,
    (6 - COALESCE(pc.native_platforms_ready, 0))::INTEGER as native_platforms_needed,
    COALESCE(pc.all_platforms_ready, ARRAY[]::TEXT[])
  FROM platform_counts pc
  ORDER BY native_platforms_needed DESC, pc.video_title;
END;
$$ LANGUAGE plpgsql;
```

## Migration Steps

### 1. Backup Current Database
```bash
# Using Supabase CLI
supabase db dump > backup_$(date +%Y%m%d).sql
```

### 2. Run Migration
```sql
-- Run the CREATE TABLE statement above
-- Run the CREATE INDEX statements
-- Run the CREATE TRIGGER statements
-- Run the RLS policies if using Supabase
```

### 3. Verify Migration
```sql
-- Check table exists
SELECT * FROM information_schema.tables 
WHERE table_name = 'platform_video_versions';

-- Check constraints
SELECT * FROM information_schema.table_constraints 
WHERE table_name = 'platform_video_versions';

-- Check indexes
SELECT * FROM pg_indexes 
WHERE tablename = 'platform_video_versions';
```

### 4. Seed Initial Data (Optional)
If you have existing platform versions tracked elsewhere, migrate them:

```sql
-- Example: Migrate from notes or external tracking
INSERT INTO platform_video_versions (video_id, platform, video_url, aspect_ratio)
SELECT 
  id as video_id,
  'youtube' as platform,
  final_video_url as video_url,
  '16:9' as aspect_ratio
FROM videos
WHERE final_video_url IS NOT NULL
  AND final_video_url LIKE '%youtube%'
ON CONFLICT (video_id, platform) DO NOTHING;
```

## Analytics Queries

### Most Complete Videos (Platform Coverage)
```sql
SELECT 
  v.title,
  COUNT(pvv.id) as platforms_covered,
  STRING_AGG(pvv.platform, ', ') as platforms
FROM videos v
LEFT JOIN platform_video_versions pvv ON pvv.video_id = v.id
GROUP BY v.id, v.title
HAVING COUNT(pvv.id) > 0
ORDER BY platforms_covered DESC
LIMIT 10;
```

### Platform-Specific Upload Trends
```sql
SELECT 
  DATE_TRUNC('month', uploaded_at) as month,
  platform,
  COUNT(*) as uploads
FROM platform_video_versions
GROUP BY DATE_TRUNC('month', uploaded_at), platform
ORDER BY month DESC, platform;
```

### Average Video Duration by Platform
```sql
SELECT 
  platform,
  ROUND(AVG(duration_seconds)) as avg_duration_seconds,
  ROUND(AVG(duration_seconds) / 60.0, 1) as avg_duration_minutes
FROM platform_video_versions
WHERE duration_seconds IS NOT NULL
GROUP BY platform
ORDER BY avg_duration_seconds;
```

## Maintenance

### Clean Up Orphaned Records
```sql
-- Remove platform versions for deleted videos (should be handled by CASCADE)
DELETE FROM platform_video_versions
WHERE video_id NOT IN (SELECT id FROM videos);
```

### Update Statistics
```sql
-- Refresh PostgreSQL statistics for query optimization
ANALYZE platform_video_versions;
```

---

**Note**: This schema is designed to work with the existing GenWise video management system. Ensure you have proper backups before running any migrations in production.
