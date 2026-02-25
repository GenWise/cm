# GenWise Content Management System

> 📚 **[Complete Documentation Index](./DOCUMENTATION_INDEX.md)** | **[Platform Video Strategy Guide](./PLATFORM_VIDEO_STRATEGY.md)** | **[Database Schema](./DATABASE_SCHEMA.md)**

## 📋 Overview

GenWise is a unified content management system designed for tracking videos, clips, assets, transcripts, and social media posting workflow across multiple programs (M3, GSP, TNP365, GenAI, etc.).

**Key Problem Solved:** Scattered raw videos across Google Drive with no central tracking of what's been edited, posted, or where content lives. No easy way to find clips by theme/topic or track posting history across platforms.

## 🎯 Core Features

### 1. **Video Production Pipeline**
Track videos through their entire lifecycle:
- **Raw Videos**: Unedited source footage (typically in Google Drive)
- **Edited Videos**: Work-in-progress versions under review
- **Final Videos**: Production-ready, published versions

### 2. **Platform-Specific Video Versions** ⭐ NEW
Manage multiple video formats optimized for different social media platforms:
- **The Problem**: Facebook, LinkedIn, and Instagram penalize posts with YouTube links (5-10x less reach)
- **The Solution**: Track native video uploads for each platform with optimal specs
- **Coverage**: LinkedIn, Facebook, Instagram, Reels, Twitter, TikTok, YouTube, WhatsApp

### 3. **Clips Management**
Create and track video clips with:
- Start/end timestamps
- Descriptions and tags
- Theme-based organization
- Easy search and discovery

### 4. **Content Posts Workflow**
Kanban board for managing posts through stages:
- 💡 Idea → 📝 Draft → ✅ Ready → 🚀 Posted

### 5. **Google Drive Integration**
Seamless workflow with existing Drive storage:
- Parse Drive URLs and file IDs
- Embedded video players
- "Open in Drive" buttons throughout UI
- Visual badges for Drive-hosted content
- Google Drive Picker integration

### 6. **Hybrid Tagging System**
- **Predefined Tags**: Consistent categorization (testimonials, technical, customer_story, etc.)
- **Custom Tags**: Flexible user-defined labels
- Full-text search across all content

### 7. **Programs Management**
Organize content by program:
- M3, GSP, TNP365, GenAI, etc.
- Color-coded badges
- Program-specific filtering

## 🎬 Platform Video Versions - Deep Dive

### Why Multiple Versions?

Social media platforms **penalize external video links** to keep users on their platform:

| Platform | YouTube Link Penalty | Recommended Format | Max Duration |
|----------|---------------------|-------------------|--------------|
| Facebook 👥 | 10x less reach | 1:1 square or 9:16 vertical | 4 hours |
| LinkedIn 💼 | 5x less reach | 1:1 square | 10 minutes |
| Instagram 📷 | No external links | 4:5 vertical or 1:1 square | 60 seconds |
| Instagram Reels 🎬 | No external links | 9:16 vertical only | 90 seconds |
| Twitter 🐦 | Reduced reach | 1:1 square or 16:9 | 2:20 |
| TikTok 🎵 | Native only | 9:16 vertical only | 10 minutes |
| YouTube ▶️ | No penalty | 16:9 (or any) | 12 hours |
| WhatsApp 💬 | No penalty | Any (9:16 for status) | 3 minutes |

### Recommended Workflow

```
1. Edit Master Video (1920x1080, 16:9)
   └─ Upload to YouTube/Website

2. Create Platform Versions:
   ├─ Square 1:1 (1080x1080) → LinkedIn, Facebook, Twitter
   ├─ Vertical 4:5 (1080x1350) → Instagram Feed
   ├─ Vertical 9:16 (1080x1920) → Instagram Reels, TikTok
   └─ Short 9:16 (<30s) → WhatsApp Status

3. Organize in Google Drive:
   📁 [Program]_[Subject]_[Date]/
      ├─ raw_footage.mp4
      ├─ master_16x9.mp4
      ├─ square_1x1.mp4
      ├─ vertical_4x5.mp4
      └─ reels_9x16.mp4

4. Track in GenWise:
   └─ Link each version to its platform in Platform Versions Matrix

5. Post Natively:
   └─ Upload videos directly to each platform (never paste YouTube links)
```

### Platform Specifications

Each platform has specific requirements tracked in the system:

- **Aspect Ratios**: 16:9, 1:1, 9:16, 4:5
- **Duration Limits**: Min/max video length
- **File Size Limits**: Platform-specific caps
- **Formats**: Supported codecs (MP4, MOV, etc.)
- **Resolution**: 720p, 1080p, 4K requirements
- **Best Practices**: Captions, hooks, optimal length

### Using the Platform Versions Feature

**On Video Detail Page:**
1. Scroll to "Platform Coverage" section
2. See visual matrix of all platforms with status:
   - ✅ Green = Version uploaded
   - ⚠️ Orange = Native upload needed
   - ⭕ Gray = Optional
3. Click any platform to:
   - View specs and best practices
   - Upload new version
   - Open existing version in Drive
4. Progress bar shows completion (e.g., "5 of 8 platforms ready")

**Platform-Specific Notes:**
- Platforms marked "Native Upload" penalize YouTube links
- Hover/expand each platform for detailed specs
- Upload buttons integrate with Google Drive
- System tracks upload date for each version

## 📊 Data Model

### Core Tables

**programs**
- `id`, `name`, `code`, `description`, `color`, `status`

**videos**
- Core: `id`, `title`, `description`, `program_id`
- Subject: `subject_name`, `subject_role`, `subject_org`
- Metadata: `recorded_date`, `duration_seconds`, `status`
- Files:
  - `raw_video_url` - Unedited source footage (Google Drive)
  - `edited_video_url` - Work-in-progress version
  - `final_video_url` - Published version
  - `raw_video_drive_id` - Drive file ID for raw video
  - `transcript_url`, `thumbnail_url`

**clips**
- `id`, `video_id`, `title`, `description`
- `start_time`, `end_time` (seconds)
- `clip_url`, `drive_file_id`
- Tags via junction table

**content_posts**
- `id`, `video_id`, `clip_id`, `platform`, `status`
- `title`, `caption`, `scheduled_date`, `posted_date`
- `platform_url`, `engagement_metrics`

**Tags System**
- `predefined_tags`: System-defined categories
- `custom_tags`: User-defined labels
- Junction tables: `video_predefined_tags`, `video_custom_tags`, etc.

### Future: Platform Video Versions Table

```sql
CREATE TABLE platform_video_versions (
  id UUID PRIMARY KEY,
  video_id UUID REFERENCES videos(id),
  platform VARCHAR(50), -- 'linkedin', 'facebook', 'instagram', etc.
  video_url TEXT,
  drive_file_id VARCHAR(255),
  uploaded_at TIMESTAMP,
  file_size BIGINT,
  duration_seconds INTEGER,
  aspect_ratio VARCHAR(10), -- '1:1', '16:9', '9:16', '4:5'
  resolution VARCHAR(20), -- '1080p', '720p', etc.
  notes TEXT
);
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Google Drive (for video storage)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# Create .env file with:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Run development server
npm run dev
```

### Initial Setup

1. **Create Programs**
   - Navigate to Programs page
   - Add your programs (M3, GSP, TNP365, etc.)
   - Assign colors and codes

2. **Upload Videos to Google Drive**
   - Organize in folders by program/date
   - Use consistent naming: `[Program]_[Subject]_[Date]_raw.mp4`

3. **Add Videos to GenWise**
   - Click "Add Video"
   - Link to Google Drive URLs
   - Add subject information and tags
   - Track through pipeline: Raw → Edited → Final

4. **Create Platform Versions**
   - Export videos in multiple formats
   - Upload to Google Drive
   - Link in Platform Versions Matrix

5. **Create Clips**
   - Review final videos
   - Mark key moments with timestamps
   - Tag clips for easy discovery

6. **Manage Posts**
   - Use Kanban board for workflow
   - Track posts across platforms
   - Link to published URLs

## 🎨 User Interface

### Key Pages

- **Dashboard**: Overview of recent activity
- **Programs**: Manage content programs
- **Videos**: Browse/search all videos with filters
- **Video Detail**: Complete video info with:
  - Raw Video Pipeline Sidebar
  - Video player
  - Clips list
  - Posts created
  - Platform Versions Matrix
  - Metadata and tags
- **Clips**: Searchable clip library
- **Posts**: Kanban board for post workflow
- **Content Library**: Unified search across all content

### Design System

Built with:
- **React** + **TypeScript**
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Lucide React** for icons
- **React Query** for data fetching
- **React Router** for navigation

## 🔍 Search & Discovery

### Full-Text Search (FTS5)
Search across:
- Video titles and descriptions
- Clip descriptions
- Tags (both predefined and custom)
- Subject names and organizations
- Post captions

### Advanced Filters
- Program
- Status (Draft, Editing, Review, Published)
- Date range
- Tags
- Subject/speaker

### Tag-Based Discovery
- Browse by predefined categories
- Filter by custom tags
- Tag statistics and suggestions
- Hybrid approach: structure + flexibility

## 📱 Google Drive Integration

### Features
- **URL Parsing**: Automatically extract Drive file IDs
- **Embedded Players**: Preview videos without leaving GenWise
- **Direct Links**: "Open in Drive" buttons throughout
- **Visual Indicators**: Drive badges show hosted content
- **Picker Integration**: Select files directly from Drive

### Supported URL Formats
```
https://drive.google.com/file/d/{fileId}/view
https://drive.google.com/open?id={fileId}
https://drive.google.com/uc?id={fileId}
```

### Best Practices
- Keep raw videos in dedicated "Raw Videos" folder
- Use descriptive file names
- Organize by program and date
- Share links with proper permissions
- Store multiple platform versions in same folder

## 🎯 Use Cases

### Video Production Team
1. Upload raw footage to Drive
2. Add to GenWise with metadata
3. Track editing progress
4. Create platform-specific versions
5. Mark as final when approved
6. Create clips for social media

### Social Media Manager
1. Browse video library
2. Find clips by topic/tag
3. Check Platform Versions Matrix
4. See which platforms need native uploads
5. Create posts in Kanban board
6. Track posting schedule
7. Link to published posts

### Content Discovery
1. Search by keyword/tag
2. Filter by program/status
3. Find related content
4. View posting history
5. Identify gaps in platform coverage

## 📈 Analytics & Tracking

### Current Metrics
- Videos by program
- Clips per video
- Posts by platform
- Platform version completion %
- Status distribution

### Future Enhancements
- Engagement metrics per platform
- Best performing aspect ratios
- Optimal video lengths
- Tag performance
- Search analytics

## 🔐 Security & Permissions

- Supabase Row Level Security (RLS)
- Google Drive permissions respected
- Environment variables for sensitive keys
- Backend validation via Supabase Edge Functions

## 🛠️ Technical Architecture

### Frontend
- React with TypeScript
- Tailwind CSS v4
- React Query for server state
- React Router for navigation

### Backend
- Supabase PostgreSQL database
- Supabase Edge Functions (Deno)
- Key-value store for flexible data
- Full-text search with PostgreSQL FTS5

### External Integrations
- Google Drive (storage)
- Social media platforms (posting)

## 📝 Best Practices

### Video Management
1. ✅ Always upload raw footage first
2. ✅ Use consistent naming conventions
3. ✅ Tag videos immediately after upload
4. ✅ Create platform versions before posting
5. ✅ Track posting URLs for reference

### Platform Strategy
1. ✅ Never post YouTube links on Facebook/LinkedIn/Instagram
2. ✅ Upload native videos for 5-10x better reach
3. ✅ Add captions (85% watch without sound)
4. ✅ Hook viewers in first 3 seconds
5. ✅ Keep videos under 60 seconds for best engagement
6. ✅ Use optimal aspect ratio per platform

### Organization
1. ✅ Create program-specific folders in Drive
2. ✅ Store all versions of same video together
3. ✅ Update status as videos progress
4. ✅ Review Platform Versions Matrix before posting
5. ✅ Archive old content periodically

## 🚧 Roadmap

### Completed ✅
- [x] Core video/clip management
- [x] Programs and tagging
- [x] Posts Kanban board
- [x] Google Drive integration
- [x] Full-text search
- [x] Raw video pipeline sidebar
- [x] Platform-specific video versions system
- [x] Platform specs and requirements

### In Progress 🔄
- [ ] Platform video versions database schema
- [ ] Upload dialog for platform versions
- [ ] Bulk export templates

### Planned 📅
- [ ] Automated video specs validation
- [ ] Platform performance analytics
- [ ] AI-powered clip suggestions
- [ ] Auto-generated captions
- [ ] Social media scheduling integration
- [ ] Team collaboration features
- [ ] Video editing integrations

## 🤝 Contributing

This is a production system for GenWise content management. For questions or feature requests, contact the development team.

## 📄 License

Proprietary - GenWise Content Management System

---

**Version**: 1.0.0 (MVP Complete + Platform Versions)  
**Last Updated**: 2026-02-19  
**Status**: Production Ready