# GenWise Content Management (CM) - Specification

## Overview

A unified content library for GenWise marketing collateral - tracking videos, clips, assets, transcripts, and social media posting workflow across programs (M3, GSP, TNP365, GenAI, etc.).

## Problem Statement

GenWise creates testimonials, promos, and educational content across multiple programs. Currently:
- Raw videos scattered across Google Drive (personal + shared)
- No central tracking of what's been edited, posted, or where
- Can't easily find clips by theme/topic
- No visibility into clip reuse potential
- Manual tracking of posting history
- No workflow for planning posts (idea → draft → published)

## Solution

A React + Vite app backed by Supabase (PostgreSQL) that provides:

### Module 1: Content Library
- **Video tracking** - raw, edited, final versions with Drive links
- **Clip-level tagging** - timestamp segments with searchable tags
- **Cross-video search** - find clips by theme across all sources
- **Asset management** - thumbnails, captions, transcripts

### Module 2: Content Calendar
- **Post planning** - capture ideas, draft content, schedule
- **Workflow tracking** - idea → draft → ready → scheduled → posted
- **Multi-platform** - YouTube, LinkedIn, WhatsApp, Instagram, Twitter
- **Engagement tracking** - views, likes, shares after posting

---

## Data Model (PostgreSQL/Supabase)

### Programs
```sql
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,             -- "M3", "GSP", "TNP365", "GenAI"
  full_name TEXT,                 -- "My Misconception Mentor"
  description TEXT,
  color TEXT,                     -- Hex color for UI badges
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Videos (Source/Raw)
```sql
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id),
  title TEXT NOT NULL,

  -- Subject/Speaker
  subject_name TEXT,              -- "Pushkala Parasuraman"
  subject_role TEXT,              -- "Principal"
  subject_org TEXT,               -- "Sri Kumaran Children's Home - CBSE"

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
  tags JSONB DEFAULT '[]',        -- ["tag1", "tag2"]

  -- Full-text search vector
  search_vector TSVECTOR,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full-text search index on videos
CREATE INDEX videos_search_idx ON videos USING GIN(search_vector);

-- Auto-update search vector
CREATE OR REPLACE FUNCTION videos_search_update() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.title, '') || ' ' ||
    COALESCE(NEW.subject_name, '') || ' ' ||
    COALESCE(NEW.subject_org, '') || ' ' ||
    COALESCE(NEW.transcript_text, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER videos_search_trigger
  BEFORE INSERT OR UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION videos_search_update();
```

### Clips (Timestamped Segments)
```sql
CREATE TABLE clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,

  -- Timing
  start_time TEXT NOT NULL,       -- "00:45" or "1:37"
  end_time TEXT NOT NULL,
  start_seconds INTEGER,
  end_seconds INTEGER,
  duration_seconds INTEGER,

  -- Content
  title TEXT,                     -- Short title for the clip
  description TEXT NOT NULL,      -- "Asking 'why' instead of 'wrong'"
  transcript_snippet TEXT,
  tags JSONB NOT NULL DEFAULT '[]', -- ["questioning", "mental-models"]

  -- Extracted clip (optional)
  extracted_clip_url TEXT,

  -- Full-text search vector
  search_vector TSVECTOR,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full-text search index on clips
CREATE INDEX clips_search_idx ON clips USING GIN(search_vector);

-- Auto-update search vector
CREATE OR REPLACE FUNCTION clips_search_update() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english',
    COALESCE(NEW.title, '') || ' ' ||
    COALESCE(NEW.description, '') || ' ' ||
    COALESCE(NEW.transcript_snippet, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clips_search_trigger
  BEFORE INSERT OR UPDATE ON clips
  FOR EACH ROW EXECUTE FUNCTION clips_search_update();
```

### Content Posts (Planning + Publishing Workflow)
```sql
CREATE TABLE content_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Source content (at least one required)
  video_id UUID REFERENCES videos(id),
  clip_id UUID REFERENCES clips(id),
  custom_asset_url TEXT,          -- For images, carousels, etc.

  -- Platform & format
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'linkedin', 'whatsapp', 'instagram', 'twitter')),
  post_type TEXT CHECK (post_type IN ('video', 'reel', 'story', 'carousel', 'text', 'link')),

  -- Content
  title TEXT,                     -- Post title (YouTube, LinkedIn)
  caption TEXT,                   -- The actual post copy
  hashtags JSONB DEFAULT '[]',    -- ["#M3", "#TeacherTestimonial"]

  -- Workflow
  status TEXT DEFAULT 'idea' CHECK (status IN ('idea', 'draft', 'ready', 'scheduled', 'posted', 'failed')),
  assigned_to TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

  -- Dates
  idea_date DATE,                 -- When idea was captured
  target_date DATE,               -- When we want to post
  scheduled_date TIMESTAMPTZ,     -- Confirmed schedule
  posted_at TIMESTAMPTZ,          -- Actual post time

  -- After posting
  platform_url TEXT,              -- Direct link to live post
  platform_id TEXT,               -- Platform-specific ID

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

-- Index for filtering by status (kanban columns)
CREATE INDEX content_posts_status_idx ON content_posts(status);
CREATE INDEX content_posts_platform_idx ON content_posts(platform);
```

### Campaigns/Batches (Optional Grouping)
```sql
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,             -- "Sri Kumaran M3 Feb 2026"
  program_id UUID REFERENCES programs(id),
  description TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table for campaign contents
CREATE TABLE campaign_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('video', 'clip', 'post')),
  item_id UUID NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, item_type, item_id)
);
```

### Supabase Configuration

**Project:** Content_Management (kkkcjcqvngyohzhqoanb)
**Organization:** Experiments

```bash
# Environment variables (in ~/.env)
SUPABASE_CM_URL="https://kkkcjcqvngyohzhqoanb.supabase.co"
SUPABASE_CM_ANON_KEY="sb_publishable_..."
SUPABASE_CM_SERVICE_KEY="sb_secret_..."
```

**Row Level Security (RLS):** Disabled for MVP (single user). Enable when adding team access.

---

## UI Specification (Figma-Ready)

### Global Layout

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                      │
│  ┌──────┐  GenWise CM    [Search...]    [+ New ▼]  [Avatar] │
│  │ Logo │                                                    │
│  └──────┘                                                    │
├─────────────┬───────────────────────────────────────────────┤
│  SIDEBAR    │  MAIN CONTENT                                  │
│             │                                                │
│  Dashboard  │                                                │
│  ─────────  │                                                │
│  Library    │                                                │
│    Videos   │                                                │
│    Clips    │                                                │
│  ─────────  │                                                │
│  Calendar   │                                                │
│    Posts    │                                                │
│    Ideas    │                                                │
│  ─────────  │                                                │
│  Settings   │                                                │
│             │                                                │
└─────────────┴───────────────────────────────────────────────┘
```

**Responsive behavior:**
- Desktop (≥1024px): Sidebar visible, 240px width
- Tablet (768-1023px): Sidebar collapsible, icon-only when collapsed
- Mobile (<768px): Sidebar hidden, hamburger menu in header

---

### Screen 1: Dashboard

**Purpose:** Quick overview and entry points to common actions

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard                                        [This Week]│
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐│
│  │   24        │ │   156       │ │   12        │ │   8     ││
│  │   Videos    │ │   Clips     │ │   Posts     │ │   Ideas ││
│  │   ↑3 new    │ │   ↑12 new   │ │   this week │ │  pending││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘│
│                                                              │
│  Upcoming Posts                              [View Calendar] │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ ○ Tomorrow   LinkedIn   "M3 Teacher testimonial..."      ││
│  │ ○ Feb 21     YouTube    "Pushkala interview"             ││
│  │ ○ Feb 22     WhatsApp   "Quick tip: questioning..."      ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  Recent Activity                                             │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ • Video added: "Shyamala Devi M - M3"          2 hrs ago ││
│  │ • Clip tagged: "Why not wrong" +questioning    3 hrs ago ││
│  │ • Posted to YouTube: "Binu CK testimonial"    yesterday  ││
│  │ • Post idea: "Compile questioning clips"      yesterday  ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  Quick Actions                                               │
│  [+ Add Video]  [+ New Post Idea]  [Search Clips]           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Components:**

| Component | Type | Behavior |
|-----------|------|----------|
| Stat Card | Card | Click → navigates to respective list |
| Upcoming Posts | List | Shows next 3-5 scheduled posts, click → post detail |
| Activity Feed | List | Last 10 activities, click → relevant item |
| Quick Actions | Button Group | Primary actions with icons |
| Date Filter | Dropdown | This Week / This Month / All Time |

**States:**
- Loading: Skeleton placeholders for all cards
- Empty: "Welcome! Add your first video to get started" + CTA
- Populated: As shown above

---

### Screen 2: Videos List

**Purpose:** Browse and filter all source videos

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Videos                                         [+ Add Video]│
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │ [Search videos...]                                       ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  Filters: [All Programs ▼] [All Status ▼] [Date Range ▼]   │
│                                                              │
│  Showing 24 videos                          [Grid] [List]   │
│                                                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │ ┌─────────┐ │ │ ┌─────────┐ │ │ ┌─────────┐ │            │
│  │ │Thumbnail│ │ │ │Thumbnail│ │ │ │Thumbnail│ │            │
│  │ │  4:32   │ │ │ │  6:15   │ │ │ │  3:48   │ │            │
│  │ └─────────┘ │ │ └─────────┘ │ │ └─────────┘ │            │
│  │ Shyamala M  │ │ Pushkala P  │ │ Binu CK     │            │
│  │ M3 Teacher  │ │ Principal   │ │ Math Teacher│            │
│  │ ┌───┐       │ │ ┌───┐       │ │ ┌───┐       │            │
│  │ │M3 │ Draft │ │ │M3 │ Publi.│ │ │M3 │ Review│            │
│  │ └───┘       │ │ └───┘       │ │ └───┘       │            │
│  │ 3 clips     │ │ 5 clips     │ │ 2 clips     │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
│                                                              │
│  [Load More]                                                 │
└─────────────────────────────────────────────────────────────┘
```

**Components:**

| Component | Specification |
|-----------|---------------|
| Search Input | Icon left, placeholder "Search videos...", debounce 300ms |
| Filter Dropdowns | Multi-select for Programs, single-select for Status |
| View Toggle | Icon buttons: grid (default) / list |
| Video Card | Thumbnail (16:9), duration badge, title, subtitle, program badge, status badge, clip count |

**Video Card States:**
- Default: As shown
- Hover: Subtle shadow lift, "View" button appears over thumbnail
- Selected (bulk mode): Checkbox visible, blue border

**Empty State:**
```
┌─────────────────────────────────────────────────────────────┐
│                         📹                                   │
│                   No videos yet                              │
│         Add your first video to start building              │
│              your content library                            │
│                                                              │
│                   [+ Add Video]                              │
└─────────────────────────────────────────────────────────────┘
```

**Filter Empty State:**
"No videos match your filters" + [Clear Filters] button

---

### Screen 3: Video Detail

**Purpose:** View video info, manage clips, see posting history

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Videos                              [Edit] [···] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────┐  Video Info                 │
│  │                            │  ─────────────────────────  │
│  │                            │  Title: Shyamala Devi M -   │
│  │      Video Player          │         M3 Testimonial      │
│  │      (Drive Embed)         │                             │
│  │                            │  Subject: Shyamala Devi M   │
│  │                            │  Role: Primary Math Teacher │
│  │           4:32             │  Org: Sri Kumaran CBSE      │
│  └────────────────────────────┘                             │
│                                 Program: [M3]               │
│                                 Status: [Published] ●       │
│                                 Recorded: Feb 15, 2026      │
│                                 Duration: 4:32              │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  Clips (3)                                      [+ Add Clip] │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ ▶ 00:45 - 1:37  Asking 'why' instead of 'wrong'         ││
│  │                 #questioning #mental-models              ││
│  ├──────────────────────────────────────────────────────────┤│
│  │ ▶ 02:21 - 2:45  "How to make 7" multiple approaches     ││
│  │                 #multiple-approaches #addition           ││
│  ├──────────────────────────────────────────────────────────┤│
│  │ ▶ 11:12 - 11:47 "_=3+1 vs 3+1=_" misconception          ││
│  │                 #equation-format #misconceptions         ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  Posts (2)                                [+ Create Post]    │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ YouTube   Posted Feb 17   "M3 Teacher shares..."  ↗     ││
│  │           👁 234  ❤ 12  💬 3                              ││
│  ├──────────────────────────────────────────────────────────┤│
│  │ WhatsApp  Posted Feb 17   Sales & Marketing group        ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  Assets                                                      │
│  [📄 Transcript]  [📝 Captions (SRT)]  [🖼 Thumbnail]        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Components:**

| Component | Specification |
|-----------|---------------|
| Video Player | Embedded Google Drive player or YouTube embed, 16:9 aspect ratio |
| Clip Row | Play button, timestamp range, description, tag chips, click to seek video |
| Post Row | Platform icon, date, title/notes, engagement metrics, external link icon |
| Asset Buttons | Icon + label, click to open/download |
| Edit Menu (···) | Delete video, Duplicate, Export data |

**Clip Row Interactions:**
- Click play icon → Seek video to start_time
- Click row → Expand to show transcript snippet
- Hover → Show edit/delete icons on right

---

### Screen 4: Clips Search

**Purpose:** Find clips across all videos by tag or text search

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Clips                                                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 🔍 Search clips by description, transcript, or tags...  ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  Popular Tags:                                               │
│  [questioning] [mental-models] [misconceptions]             │
│  [multiple-approaches] [student-thinking] [assessment]      │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  156 clips                    Sort: [Most Recent ▼]         │
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ ☐  Asking 'why' instead of 'wrong'                      ││
│  │    Shyamala Devi M - M3 Testimonial  •  00:45 - 1:37    ││
│  │    [questioning] [mental-models]                         ││
│  │    "Instead of telling student they're wrong, I now..." ││
│  │                                          [▶ Play] [+ Post]││
│  ├──────────────────────────────────────────────────────────┤│
│  │ ☐  Why understanding matters more than answers          ││
│  │    Pushkala P - M3 Testimonial  •  02:15 - 3:02         ││
│  │    [questioning] [understanding]                         ││
│  │    "The biggest shift was realizing that getting..."    ││
│  │                                          [▶ Play] [+ Post]││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│  Selected: 2 clips              [Create Compilation Post]   │
└─────────────────────────────────────────────────────────────┘
```

**Components:**

| Component | Specification |
|-----------|---------------|
| Search Input | Full-text search using FTS5, debounce 300ms |
| Tag Chips | Click to filter, multiple selection, show count |
| Clip Card | Checkbox, title, source video, timestamp, tags, transcript preview (2 lines) |
| Bulk Actions | Appears when clips selected, "Create Compilation Post" |
| Sort Dropdown | Most Recent, Oldest, Shortest, Longest, A-Z |

**Search Behavior:**
- Searches: description, transcript_snippet, tags
- Highlights matching terms in results
- Shows "No clips found" + suggestions if empty

---

### Screen 5: Content Calendar (Posts)

**Purpose:** Kanban board for post workflow management

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Content Calendar                              [+ New Post]  │
├─────────────────────────────────────────────────────────────┤
│  View: [Board] [List] [Calendar]     Filter: [All ▼] [All ▼]│
│                                                              │
│  ┌────────────┐┌────────────┐┌────────────┐┌────────────┐   │
│  │   IDEAS    ││   DRAFT    ││   READY    ││  POSTED    │   │
│  │     8      ││     3      ││     2      ││    12      │   │
│  ├────────────┤├────────────┤├────────────┤├────────────┤   │
│  │┌──────────┐││┌──────────┐││┌──────────┐││┌──────────┐│   │
│  ││ LinkedIn │││ YouTube   │││ LinkedIn  │││ YouTube   ││   │
│  ││ ───────  │││ ───────   │││ ───────   │││ ───────   ││   │
│  ││ Compile  │││ Pushkala  │││ M3 quick  │││ Binu CK   ││   │
│  ││ question-│││ interview │││ tip on... │││ interview ││   │
│  ││ ing clips│││           │││           │││           ││   │
│  ││          │││ Feb 21    │││ Tomorrow  │││ ✓ Feb 17  ││   │
│  │└──────────┘││└──────────┘││└──────────┘││ 234 views ││   │
│  │            ││            ││            ││└──────────┘│   │
│  │┌──────────┐││┌──────────┐││┌──────────┐││┌──────────┐│   │
│  ││ WhatsApp │││ Instagram │││ WhatsApp  │││ WhatsApp  ││   │
│  ││ ───────  │││ ───────   │││ ───────   │││ ───────   ││   │
│  ││ Share    │││ Reel from │││ Share to  │││ Sales &   ││   │
│  ││ Ramya... │││ Shyamala..│││ Parents...|││ Marketing ││   │
│  │└──────────┘││└──────────┘││└──────────┘││└──────────┘│   │
│  │            ││            ││            ││            │   │
│  │ [+ Add]   ││            ││            ││            │   │
│  └────────────┘└────────────┘└────────────┘└────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Kanban Columns:**

| Column | Status | Color |
|--------|--------|-------|
| Ideas | idea | Gray |
| Draft | draft | Yellow |
| Ready | ready, scheduled | Blue |
| Posted | posted | Green |
| (Hidden) | failed | Red (shown in filter) |

**Post Card Components:**
- Platform icon (colored)
- Title (truncated 2 lines)
- Target/posted date
- Engagement metrics (if posted)
- Priority indicator (colored dot for high/urgent)

**Interactions:**
- Drag card between columns → Updates status
- Click card → Opens post detail modal
- Hover card → Shows quick actions (edit, delete)

**List View Alternative:**
```
| Platform | Title | Status | Date | Engagement |
|----------|-------|--------|------|------------|
| YouTube  | Pushkala interview | Draft | Feb 21 | - |
```

**Calendar View Alternative:**
Monthly calendar with post cards on their target dates

---

### Screen 6: Post Detail / Edit Modal

**Purpose:** View and edit a single post

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Edit Post                                            [X]   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Status: [idea ▼] ──●────────────────────────────●          │
│          idea    draft    ready    scheduled    posted      │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  Platform *        Post Type                                │
│  [YouTube ▼]       [Video ▼]                                │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  Source Content                                              │
│  ○ From Video  ○ From Clip  ○ Custom Asset                  │
│                                                              │
│  [Select video...                                     ▼]    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Preview: Shyamala Devi M - M3 Testimonial               ││
│  │ Duration: 4:32                                          ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  Title                                                       │
│  [M3 Teacher shares her transformation                    ] │
│                                                              │
│  Caption                                                     │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ "Instead of telling students they're wrong, I now ask  ││
│  │ 'why did you think that?' This simple shift has        ││
│  │ transformed my classroom."                              ││
│  │                                                          ││
│  │ Watch Shyamala share her M3 journey. 🎓                 ││
│  └─────────────────────────────────────────────────────────┘│
│  Characters: 187                                             │
│                                                              │
│  Hashtags                                                    │
│  [#M3] [#TeacherTestimonial] [#MathEducation] [+ Add]       │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  Target Date              Assigned To                        │
│  [Feb 21, 2026]           [Rajesh ▼]                        │
│                                                              │
│  Priority                                                    │
│  ○ Low  ● Normal  ○ High  ○ Urgent                          │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  Notes                                                       │
│  [Internal notes about this post...]                        │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                              [Cancel]  [Save]  [Save & Post]│
└─────────────────────────────────────────────────────────────┘
```

**After Posted - Additional Fields:**
```
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  Post URL                                                    │
│  [https://youtube.com/watch?v=...                        ↗] │
│                                                              │
│  Posted At: Feb 17, 2026 3:45 PM IST                        │
│                                                              │
│  Engagement                        [↻ Refresh]              │
│  👁 Views: 234    ❤ Likes: 12    💬 Comments: 3             │
│  ↗ Shares: 5      📥 Saves: 8                               │
```

**Platform-Specific Fields:**
- YouTube: Title required, description, tags
- LinkedIn: Text post or article
- WhatsApp: Caption + target group name
- Instagram: Caption, hashtags (limit 30)
- Twitter: Caption (280 char limit)

---

### Screen 7: Add Video Form

**Purpose:** Add a new source video with clips

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  ← Videos                                                    │
│                                                              │
│  Add New Video                                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Program *                                                   │
│  [M3 - My Misconception Mentor                          ▼]  │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  Video Title *                                               │
│  [Shyamala Devi M - M3 Testimonial                       ]  │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  Subject / Speaker                                           │
│                                                              │
│  Name                         Role                           │
│  [Shyamala Devi M]           [Primary Math Teacher]         │
│                                                              │
│  Organization                                                │
│  [Sri Kumaran Children's Home - CBSE]                       │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  Video Files (Google Drive)                                  │
│                                                              │
│  Raw Video URL                                               │
│  [https://drive.google.com/file/d/...                    ]  │
│                                                              │
│  Edited Video URL                                            │
│  [                                                        ]  │
│                                                              │
│  Final Video URL                                             │
│  [                                                        ]  │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  Metadata                                                    │
│                                                              │
│  Recorded Date              Duration                         │
│  [Feb 15, 2026]            [00:04:32]                       │
│                                                              │
│  Status                                                      │
│  ○ Draft  ○ Editing  ○ Review  ● Published                  │
│                                                              │
│  Tags                                                        │
│  [testimonial] [teacher] [math] [+ Add]                     │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  Clips                                          [+ Add Clip] │
│                                                              │
│  Quick Add (paste timestamps):                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 00:45-1:37 Asking 'why' instead of 'wrong' #questioning ││
│  │ 02:21-2:45 "How to make 7" multiple approaches #addition││
│  │ 11:12-11:47 "_=3+1 vs 3+1=_" misconception #misconception││
│  └─────────────────────────────────────────────────────────┘│
│  [Parse Clips]                                               │
│                                                              │
│  Parsed Clips:                                               │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ ✓ 00:45-1:37 | Asking 'why' instead of 'wrong'    [Edit]││
│  │              | #questioning                        [X]   ││
│  ├──────────────────────────────────────────────────────────┤│
│  │ ✓ 02:21-2:45 | "How to make 7" multiple approaches[Edit]││
│  │              | #addition                           [X]   ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                    [Cancel]  [Save Video]   │
└─────────────────────────────────────────────────────────────┘
```

**Clip Quick Add Parser:**
- Format: `MM:SS-MM:SS Description #tag1 #tag2`
- Or: `M:SS-M:SS Description #tag`
- Parses each line into clip record
- Shows validation errors inline

---

## Component Library (shadcn/ui)

### Required Components

| Component | Usage |
|-----------|-------|
| Button | Primary, Secondary, Ghost, Destructive variants |
| Input | Text fields, search |
| Textarea | Caption, notes, transcript |
| Select | Dropdowns for program, status, platform |
| Badge | Tags, status indicators |
| Card | Video cards, post cards, stat cards |
| Dialog | Modals for post edit, confirmations |
| Dropdown Menu | Actions menu (...) |
| Tabs | View switchers |
| Table | List views |
| Calendar | Date picker, calendar view |
| Toast | Success/error notifications |
| Skeleton | Loading states |
| Avatar | User avatars |
| Tooltip | Hover hints |

### Custom Components to Build

| Component | Description |
|-----------|-------------|
| VideoCard | Thumbnail + metadata card |
| ClipRow | Expandable clip with timestamp, tags |
| PostCard | Kanban card for content posts |
| TagInput | Multi-tag input with suggestions |
| TimestampInput | MM:SS format with validation |
| PlatformIcon | Colored icons for each platform |
| StatusBadge | Colored badge for workflow status |
| EngagementMetrics | Views/likes/comments display |
| VideoPlayer | Drive/YouTube embed wrapper |

---

## User Flows

### Flow 1: Add Video with Clips
```
Videos List → [+ Add Video] → Fill form → Paste clip timestamps →
[Parse Clips] → Review parsed clips → [Save Video] → Video Detail
```

### Flow 2: Create Post from Clip
```
Clips Search → Find clip → [+ Post] → Select platform →
Write caption → Set target date → [Save] → Kanban board
```

### Flow 3: Publish Post
```
Kanban board → Drag card to "Ready" → Open post → Copy caption →
Post manually on platform → Paste URL → [Mark as Posted] →
Add engagement metrics later
```

### Flow 4: Search and Compile
```
Clips Search → Search by tag → Select multiple clips →
[Create Compilation Post] → Opens post form with clips linked →
Write caption → Save as idea
```

---

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **State**: TanStack Query (React Query) for server state
- **Backend**: Supabase (PostgreSQL)
- **API**: Supabase auto-generated REST API
- **Hosting**: Vercel or GitHub Pages
- **Search**: PostgreSQL full-text search (tsvector/tsquery)
- **Future**: Supabase Auth, Storage, Realtime

---

## API Integrations (Future)

- **Google Drive**: Auto-fetch file metadata, thumbnails
- **YouTube**: Pull video stats, sync posting data
- **WhatsApp**: Log sends automatically (via existing MCP)

---

## MVP Scope (Phase 1)

1. ✅ Programs CRUD
2. ✅ Videos CRUD with Drive links
3. ✅ Clips with timestamps and tags
4. ✅ Basic search (FTS5)
5. ✅ Content Posts with workflow (idea → posted)
6. ✅ Kanban board for post management
7. ✅ Responsive UI

## Phase 2

1. Clip extraction (auto-cut clips from source)
2. Compilation builder (stitch clips by tag)
3. Google Drive integration (browse/pick files)
4. YouTube stats sync
5. Team access (Google OAuth)
6. Scheduled posting reminders

---

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
│   │   ├── ui/                 # shadcn components
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   ├── videos/
│   │   │   ├── VideoCard.tsx
│   │   │   ├── VideoPlayer.tsx
│   │   │   └── VideoForm.tsx
│   │   ├── clips/
│   │   │   ├── ClipRow.tsx
│   │   │   ├── ClipTimeline.tsx
│   │   │   └── TagInput.tsx
│   │   ├── posts/
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostForm.tsx
│   │   │   ├── KanbanBoard.tsx
│   │   │   └── PlatformIcon.tsx
│   │   └── common/
│   │       ├── SearchBar.tsx
│   │       ├── StatusBadge.tsx
│   │       └── EngagementMetrics.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Videos.tsx
│   │   ├── VideoDetail.tsx
│   │   ├── AddVideo.tsx
│   │   ├── Clips.tsx
│   │   ├── Calendar.tsx
│   │   └── Settings.tsx
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client
│   │   ├── types.ts            # TypeScript types (generated from Supabase)
│   │   └── utils.ts
│   └── hooks/
│       ├── useVideos.ts
│       ├── useClips.ts
│       └── usePosts.ts
├── supabase/
│   └── migrations/             # SQL migrations (optional)
└── public/
```

---

## Initial Data (Seed)

**Program**: M3 (My Misconception Mentor)

**Videos**:
1. Binu C K - Primary School Math Teacher
2. Pushkala Parasuraman - Principal
3. Ramya MS - Primary School Math Coordinator
4. Shyamala Devi M - Primary School Math Teacher

**Sample Clips** (from Shyamala):
- 00:45-1:37 | "Asking 'why' instead of 'wrong'" | #questioning #mental-models
- 02:21-2:45 | "How to make 7" multiple approaches | #multiple-approaches #addition
- 11:12-11:47 | "_=3+1 vs 3+1=_ misconception" | #equation-format #misconceptions

**Sample Posts**:
- YouTube (posted): "Binu CK - M3 Teacher Testimonial" | 234 views
- WhatsApp (posted): GenWise Sales & Marketing group
- LinkedIn (idea): Compile questioning technique clips
- Instagram (draft): Reel from Shyamala clip

---

## Links

- GenWise: https://genwise.in
- M3 Program: https://genwise.in/my-misconception-mentor
- Supabase Project: https://supabase.com/dashboard/project/kkkcjcqvngyohzhqoanb
