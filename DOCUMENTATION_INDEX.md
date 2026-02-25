# GenWise Documentation Index

Welcome to the GenWise Content Management System documentation!

## 📚 Documentation Files

### 1. [README.md](./README.md) - Main Documentation
Complete overview of the GenWise system including:
- System overview and features
- Platform video versions deep-dive
- Data model and architecture
- Getting started guide
- User interface overview
- Best practices
- Technical architecture

**Start here** for a comprehensive understanding of the system.

---

### 2. [PLATFORM_VIDEO_STRATEGY.md](./PLATFORM_VIDEO_STRATEGY.md) - Quick Reference
Practical guide for content creators and social media managers:
- The YouTube link penalty problem
- Video format cheat sheet (aspect ratios, resolutions)
- Platform-by-platform specifications
- Production workflow
- Pro tips and best practices
- What NOT to do
- Quick checklist before posting

**Use this** when creating and posting videos.

---

### 3. [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Technical Reference
Database schema and migration guide:
- `platform_video_versions` table schema
- SQL migrations and setup
- TypeScript types
- API function examples
- Analytics queries
- Row Level Security (RLS) policies

**Refer to this** when implementing database features or running migrations.

---

## 🚀 Quick Start by Role

### Content Creator / Video Editor
1. Read: [PLATFORM_VIDEO_STRATEGY.md](./PLATFORM_VIDEO_STRATEGY.md)
2. Focus on: Video format cheat sheet, production workflow
3. Use: Platform Versions Matrix in Video Detail page

### Social Media Manager
1. Read: [PLATFORM_VIDEO_STRATEGY.md](./PLATFORM_VIDEO_STRATEGY.md)
2. Focus on: Platform-by-platform guide, posting checklist
3. Use: Posts Kanban board, Platform Coverage tracking

### Developer
1. Read: [README.md](./README.md) - Full overview
2. Read: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Schema details
3. Focus on: Technical architecture, API integration

### Project Manager / Stakeholder
1. Read: [README.md](./README.md) - Overview section
2. Focus on: Core features, use cases, roadmap

---

## 📂 System Components

### Core Features (Implemented ✅)
- **Video Pipeline**: Raw → Edited → Final
- **Platform Versions**: Track optimized videos for 8+ platforms
- **Clips Management**: Create and tag video segments
- **Posts Workflow**: Kanban board (Idea → Draft → Ready → Posted)
- **Google Drive Integration**: Seamless file linking and playback
- **Hybrid Tagging**: Predefined + custom tags
- **Full-Text Search**: Search across all content
- **Programs Management**: Multi-program organization

### Key Technologies
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Storage**: Google Drive integration
- **UI Components**: shadcn/ui
- **State Management**: React Query

---

## 🎯 Key Concepts

### The Platform Video Problem
Social media platforms **penalize external video links** (especially YouTube):
- Facebook: 10x less reach
- LinkedIn: 5x less reach
- Instagram: No external links allowed

**Solution**: Upload native video versions optimized for each platform.

### Video Pipeline Stages
1. **Raw Video**: Unedited source footage (Google Drive)
2. **Edited Video**: Work-in-progress, under review
3. **Final Video**: Production-ready, published version

### Platform Version Strategy
Create multiple versions of each video:
- **16:9** (Master) → YouTube, website
- **1:1** (Square) → LinkedIn, Facebook, Twitter
- **4:5** (Vertical) → Instagram Feed
- **9:16** (Full Vertical) → Instagram Reels, TikTok

Store all versions in Google Drive, track in GenWise.

---

## 🔗 Important Links

### In the App
- **Platform Versions Matrix**: Video Detail page → Platform Coverage section
- **Raw Video Pipeline**: Video Detail page → Left sidebar
- **Posts Kanban**: Posts page → Drag-and-drop workflow
- **Video Library**: Videos page → Search and filter

### External Resources
- Supabase Documentation: https://supabase.com/docs
- Google Drive API: https://developers.google.com/drive
- Tailwind CSS: https://tailwindcss.com
- shadcn/ui: https://ui.shadcn.com

---

## 📊 Platform Specifications Quick Reference

| Platform | Native Required | Aspect Ratio | Max Duration | Max Size |
|----------|----------------|--------------|--------------|----------|
| LinkedIn 💼 | ✅ Yes | 1:1, 16:9 | 10 min | 5 GB |
| Facebook 👥 | ✅ Yes | 1:1, 9:16 | 4 hours | 10 GB |
| Instagram 📷 | ✅ Yes | 4:5, 1:1 | 60 sec | 4 GB |
| IG Reels 🎬 | ✅ Yes | 9:16 only | 90 sec | 4 GB |
| Twitter 🐦 | ✅ Yes | 1:1, 16:9 | 2:20 | 512 MB |
| TikTok 🎵 | ✅ Yes | 9:16 only | 10 min | 4 GB |
| YouTube ▶️ | ❌ No | Any | 12 hours | 256 GB |
| WhatsApp 💬 | ❌ No | Any | 3 min | 100 MB |

**✅ Native Required** = Platform penalizes YouTube links, always upload directly

---

## 🛠️ Common Tasks

### Adding a New Video
1. Upload raw footage to Google Drive
2. Add Video in GenWise
3. Link Google Drive URL
4. Add subject, tags, program
5. Track editing progress (Draft → Editing → Review → Published)

### Creating Platform Versions
1. Edit master video (16:9)
2. Export additional formats (1:1, 4:5, 9:16)
3. Upload all to Google Drive folder
4. Link in Platform Versions Matrix
5. Check completion status

### Creating a Post
1. Navigate to Posts page
2. Create new post
3. Select video/clip
4. Choose platform
5. Move through workflow: Idea → Draft → Ready → Posted
6. Add posted URL when published

### Searching for Content
1. Use search bar (searches titles, descriptions, tags)
2. Apply filters (program, status, date range)
3. Filter by tags (predefined or custom)
4. Browse clips library by topic

---

## 📈 Metrics & Analytics

### Current Tracking
- Videos by program and status
- Clips per video
- Posts by platform and stage
- Platform version completion %
- Tag usage statistics

### Planned Analytics
- Engagement metrics per platform
- Best performing aspect ratios
- Optimal video lengths
- Platform reach comparisons
- Search analytics

---

## 🤝 Support & Contribution

### Questions?
- Check relevant documentation file first
- Review component code for implementation details
- Contact development team for system questions

### Feature Requests
Current roadmap includes:
- [ ] Platform video versions database implementation
- [ ] Upload dialog for platform versions
- [ ] Automated specs validation
- [ ] Performance analytics
- [ ] AI-powered clip suggestions
- [ ] Auto-generated captions

---

## 📝 Version History

**v1.0.0** (2024-02-19) - MVP Complete + Platform Versions
- ✅ Core video/clip management
- ✅ Programs and tagging system
- ✅ Posts Kanban workflow
- ✅ Google Drive integration
- ✅ Full-text search
- ✅ Raw video pipeline sidebar
- ✅ Platform-specific video versions system
- ✅ Comprehensive documentation

---

## 📄 License

Proprietary - GenWise Content Management System

---

**Last Updated**: 2024-02-19  
**Documentation Maintained By**: GenWise Development Team  
**Status**: Production Ready
