# GenWise Content Management (CM) - Specification

## Overview

A unified content library for GenWise marketing collateral - tracking videos, clips, assets, transcripts, and social media posting history across programs (M3, GSP, TNP365, GenAI, etc.).

## Problem Statement

GenWise creates testimonials, promos, and educational content across multiple programs. Currently:
- Raw videos scattered across Google Drive (personal + shared)
- No central tracking of what's been edited, posted, or where
- Can't easily find clips by theme/topic
- No visibility into clip reuse potential
- Manual tracking of posting history

## Solution

A React + Vite app backed by Supabase that provides:
1. **Video tracking** - raw, edited, final versions with Drive links
2. **Clip-level tagging** - timestamp segments with searchable tags
3. **Cross-video search** - find clips by theme across all sources
4. **Posting history** - track where content was published
5. **Asset management** - thumbnails, captions, transcripts

## Data Model (SQLite/Turso)

### Programs
```sql
CREATE TABLE programs (
  id TEXT PRIMARY KEY,          -- nanoid or uuid string
  name TEXT NOT NULL,           -- "M3", "GSP", "TNP365", "GenAI"
  full_name TEXT,               -- "My Misconception Mentor"
  description TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
```

### Videos (Source/Raw)
```sql
CREATE TABLE videos (
  id TEXT PRIMARY KEY,
  program_id TEXT REFERENCES programs(id),
  title TEXT NOT NULL,

  -- Subject/Speaker
  subject_name TEXT,            -- "Pushkala Parasuraman"
  subject_role TEXT,            -- "Principal"
  subject_org TEXT,             -- "Sri Kumaran Children's Home - CBSE"

  -- Files (Google Drive links)
  raw_video_url TEXT,           -- Drive link to raw
  raw_video_drive_id TEXT,      -- Drive file ID
  edited_video_url TEXT,        -- Drive link to edited
  final_video_url TEXT,         -- Drive link to final

  -- Assets
  thumbnail_url TEXT,
  transcript_text TEXT,         -- Full transcript
  captions_srt_url TEXT,        -- SRT file link

  -- Metadata
  duration_seconds INTEGER,
  recorded_date TEXT,
  status TEXT DEFAULT 'draft',  -- draft, editing, review, published
  tags TEXT,                    -- JSON array: '["tag1", "tag2"]'

  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

### Clips (Timestamped Segments)
```sql
CREATE TABLE clips (
  id TEXT PRIMARY KEY,
  video_id TEXT REFERENCES videos(id) ON DELETE CASCADE,

  -- Timing
  start_time TEXT NOT NULL,     -- "00:45" or "1:37"
  end_time TEXT NOT NULL,
  start_seconds INTEGER,        -- Computed for sorting
  end_seconds INTEGER,
  duration_seconds INTEGER,

  -- Content
  description TEXT NOT NULL,    -- "Asking 'why' instead of 'wrong'"
  transcript_snippet TEXT,      -- Transcript for this segment
  tags TEXT NOT NULL,           -- JSON: '["questioning", "mental-models"]'

  -- Extracted clip (optional)
  extracted_clip_url TEXT,      -- Pre-cut clip file

  created_at TEXT DEFAULT (datetime('now'))
);

-- Full-text search on clips
CREATE VIRTUAL TABLE clips_fts USING fts5(
  description,
  transcript_snippet,
  tags,
  content='clips',
  content_rowid='rowid'
);
```

### Final Videos (Published Content)
```sql
CREATE TABLE final_videos (
  id TEXT PRIMARY KEY,
  video_id TEXT REFERENCES videos(id),  -- Primary source

  title TEXT NOT NULL,
  description TEXT,

  -- Composed from clips (optional - for compilations)
  clip_ids TEXT,                -- JSON array of clip IDs

  -- File
  file_url TEXT,                -- Drive link
  duration_seconds INTEGER,

  created_at TEXT DEFAULT (datetime('now'))
);
```

### Postings (Social Media History)
```sql
CREATE TABLE postings (
  id TEXT PRIMARY KEY,
  final_video_id TEXT REFERENCES final_videos(id),

  platform TEXT NOT NULL,       -- "youtube", "whatsapp", "linkedin", "twitter", "instagram"
  platform_url TEXT,            -- Direct link to post
  platform_id TEXT,             -- Platform-specific ID (YouTube video ID, etc.)

  posted_at TEXT NOT NULL,
  posted_by TEXT,               -- Who posted it

  -- Engagement (optional)
  views INTEGER,
  likes INTEGER,
  shares INTEGER,

  notes TEXT,                   -- "Sent to Sales & Marketing group"

  created_at TEXT DEFAULT (datetime('now'))
);
```

### Campaigns/Batches (Optional Grouping)
```sql
CREATE TABLE campaigns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,           -- "Sri Kumaran M3 Feb 2026"
  program_id TEXT REFERENCES programs(id),
  description TEXT,
  video_ids TEXT,               -- JSON array of video IDs
  created_at TEXT DEFAULT (datetime('now'))
);
```

## UI Screens

### 1. Dashboard
- Quick stats: total videos, clips, posts this month
- Recent activity feed
- Quick search bar

### 2. Videos List
- Filter by: program, status, date range
- Search by: title, subject name, tags
- Card view showing thumbnail, title, subject, status
- Click → Video detail page

### 3. Video Detail
- Video player (embedded from Drive or YouTube)
- Metadata: subject, program, dates
- Timeline showing clips with tags
- Assets: transcript, captions, thumbnail
- Posting history
- Edit button

### 4. Clips Search
- Full-text search across all clip descriptions and tags
- Tag cloud / filter chips
- Results show: clip description, source video, timestamp, tags
- Click → Jump to video at timestamp
- Bulk select for compilation

### 5. Add/Edit Video
- Form for video metadata
- Timestamp input for clips (paste from notes)
- Auto-parse: "00:45-1:37 Description here" → clip record
- Tag suggestions based on existing tags

### 6. Add Posting
- Select video/clip
- Choose platform
- Add URL and date
- Optional engagement metrics

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Turso (SQLite edge database - free tier)
- **ORM**: Drizzle ORM (works great with Turso)
- **Hosting**: GitHub Pages or Vercel
- **Search**: SQLite FTS5 (full-text search)

## API Integrations (Future)

- **Google Drive**: Auto-fetch file metadata, generate thumbnails
- **YouTube**: Pull video stats, sync posting data
- **WhatsApp**: Log sends automatically (via existing MCP)

## MVP Scope (Phase 1)

1. Programs CRUD
2. Videos CRUD with Drive links
3. Clips with timestamps and tags
4. Basic search (tags, text)
5. Posting history logging
6. Simple responsive UI

## Phase 2

1. Clip extraction (auto-cut clips from source)
2. Compilation builder (stitch clips by tag)
3. Google Drive integration (browse/pick files)
4. YouTube stats sync
5. Team access (simple auth or Google OAuth)

## File Structure

```
CM/
├── README.md
├── SPEC.md
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── .env.example
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── ui/              # shadcn components
│   │   ├── VideoCard.tsx
│   │   ├── ClipTimeline.tsx
│   │   ├── SearchBar.tsx
│   │   └── PostingHistory.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Videos.tsx
│   │   ├── VideoDetail.tsx
│   │   ├── Clips.tsx
│   │   └── AddVideo.tsx
│   ├── lib/
│   │   ├── db.ts             # Turso client
│   │   ├── types.ts
│   │   └── utils.ts
│   └── hooks/
│       ├── useVideos.ts
│       └── useClips.ts
├── drizzle/
│   ├── schema.ts             # Drizzle schema
│   └── migrations/
└── public/
```

## Initial Data (Seed)

From this session's M3 videos:

**Program**: M3 (My Misconception Mentor)

**Videos**:
1. Binu C K - Primary School Math Teacher
2. Pushkala Parasuraman - Principal
3. Ramya MS - Primary School Math Coordinator
4. Shyamala Devi M - Primary School Math Teacher

**Sample Clips** (from Shyamala):
- 00:45-1:37 | "Asking 'why' instead of 'wrong'" | tags: questioning, mental-models
- 02:21-2:45 | "How to make 7" multiple approaches | tags: multiple-approaches, addition
- 11:12-11:47 | "_=3+1 vs 3+1=_ misconception" | tags: equation-format, misconceptions

**Postings**:
- YouTube playlist: https://youtube.com/playlist?list=PLZAShHZhLhx4BgAjNX53ap599em6t8VUv
- WhatsApp: GenWise Sales & Marketing group (2026-02-17)

## Links

- GenWise: https://genwise.in
- Ei ASSET: https://ei.study
- M3 Program: https://genwise.in/my-misconception-mentor
- Turso: https://turso.tech (credentials in ~/.env as TURSO_*)
