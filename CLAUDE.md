# GenWise Content Management (CM)

## What is this?
A unified content library for GenWise marketing collateral - videos, clips, assets, transcripts, and posting workflow.

## Tech Stack
- **Frontend**: React + Vite + TypeScript + Tailwind + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Search**: PostgreSQL full-text search (tsvector)
- **Hosting**: Vercel or GitHub Pages

## Key Entities
- **Programs**: M3, GSP, TNP365, GenAI
- **Videos**: Raw/edited/final with Drive links
- **Clips**: Timestamped segments with tags (searchable)
- **Content Posts**: Workflow from idea → draft → scheduled → posted

## Supabase Setup
```bash
# Credentials in ~/.env
SUPABASE_CM_URL="https://kkkcjcqvngyohzhqoanb.supabase.co"
SUPABASE_CM_ANON_KEY="sb_publishable_..."
SUPABASE_CM_SERVICE_KEY="sb_secret_..."

# Dashboard
https://supabase.com/dashboard/project/kkkcjcqvngyohzhqoanb
```

## MCP Tools
**supabase-cm** MCP is configured at user level (`~/.claude.json`) for this project's database.
- May show "Needs authentication" on first use - run `/mcp` to authenticate
- Tools: `mcp__supabase-cm__execute_sql`, `mcp__supabase-cm__list_tables`, `mcp__supabase-cm__apply_migration`
- Use for direct DB queries/updates without needing dev server running

## Development
```bash
npm install
npm run dev          # Start Vite dev server
```

## MVP Scope (Phase 1)
1. Programs CRUD
2. Videos CRUD with Drive links
3. Clips with timestamps and tags
4. Basic search (PostgreSQL FTS)
5. Content Posts with workflow (idea → posted)
6. Kanban board for post management
7. Responsive UI

## Sample Data
From M3 testimonial session (Feb 2026):
- 4 videos: Binu, Pushkala, Ramya, Shyamala
- ~15 clips with tags
- Posted to YouTube playlist + WhatsApp

## Reference
- Full spec: SPEC.md
- Video editing workflow: ~/code/video-editing/PROCESS_FLOW.md
