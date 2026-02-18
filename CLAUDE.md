# GenWise Content Management (CM)

## What is this?
A unified content library for GenWise marketing collateral - videos, clips, assets, transcripts, and posting history.

## Tech Stack
- **Frontend**: React + Vite + TypeScript + Tailwind + shadcn/ui
- **Database**: Turso (SQLite edge) + Drizzle ORM
- **Search**: SQLite FTS5
- **Hosting**: GitHub Pages (static) or Vercel

## Key Entities
- **Programs**: M3, GSP, TNP365, GenAI
- **Videos**: Raw/edited/final with Drive links
- **Clips**: Timestamped segments with tags (searchable)
- **Postings**: Where content was published (YouTube, WhatsApp, LinkedIn, etc.)

## Turso Setup
```bash
# Credentials in ~/.env
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...

# Create database
turso db create genwise-cm
turso db tokens create genwise-cm
```

## Development
```bash
npm install
npm run dev          # Start Vite dev server
npm run db:push      # Push schema to Turso
npm run db:studio    # Open Drizzle Studio
```

## MVP Scope
1. Programs CRUD
2. Videos CRUD with Drive links
3. Clips with timestamps and tags
4. Basic search (tags, text via FTS5)
5. Posting history logging
6. Simple responsive UI

## Sample Data
From M3 testimonial session (Feb 2026):
- 4 videos: Binu, Pushkala, Ramya, Shyamala
- ~15 clips with tags
- Posted to YouTube playlist + WhatsApp

## Reference
- Full spec: SPEC.md
- Video editing workflow: ~/code/video-editing/PROCESS_FLOW.md
