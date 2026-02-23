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

## Canva Assets
| Folder | ID | URL |
|--------|-----|-----|
| M3 | FAHB2v2JhZ4 | https://www.canva.com/folder/FAHB2v2JhZ4 |
| M3/logos | FAHB2lMfGoE | https://www.canva.com/folder/FAHB2lMfGoE |

## Google Drive Assets (Company Level/genwise-assets)
Root: https://drive.google.com/drive/folders/1A6wi4Tx_PSsaoHqjKRGw2NZbiSbhFfWR

| Folder | ID |
|--------|-----|
| genwise-assets | 1A6wi4Tx_PSsaoHqjKRGw2NZbiSbhFfWR |
| brand | 1twuCjJyanN8p3GP26i5Uam2AX7N268XK |
| brand/genwise | 19xdwXInRRBHP2XzxD3jPshgH-hv4prX- |
| brand/ei | 1VzO7GCsUM_WPYKacLlwI1qt0hOu3IIm6 |
| people | 1h6qU_-3mENXhAPR1f3_uCCxHKXeSIefv |
| people/mentors | 1EkxUDkeWPEkOfynyI6OBdQIr8U9vSwqs |
| customers | 199nUhz3ASOkNtD8hoGvhSyQIS0ihBd-M |
| customers/m3 | 1mrtBiwHgAJpr4eGcz1KxzlxnJgDVSQSK |
| customers/m3/sri-kumaran | 1ww7m04l03AcQj8wiMy-4IZjqfesPdQjK |
| customers/m3/shiv-nadar | 1szgAObLi4Wi5Dh3TpfLFYOlMe5GXyt-_ |
| customers/m3/gems-modern-academy | 1BLO4ys2zZQLBBDzF0edBuQPnS0K5aLe- |
| customers/m3/millennium-school | 1l7CxPCIS5KyaSkEuc-fTuSqFn3Ga0NQ5 |
| customers/m3/psbb | 19F5HCInxLMYjdYuvZ-91pHZYNb8vBtHP |
| customers/m3/gear | 1dPOcolwkOW7Bk96jJZ5iuPUmSOuOsK57 |
| customers/m3/sobha-academy | 1IhJ0X9UZ86C4WtjXLGZ9bl9FFGBEpM7S |
| customers/m3/pict-model-school | 1jhE6-kwHjzJV5H1Mz_FzmH21WtfiR_Qo |
| customers/m3/tvs-academy | 1W33kZPzrca5ai8EMHpLZYmr5S0Ww3nDS |
| customers/m3/inventure-academy | 1iGcC7-QXMv5luWFo8xBNRkxEVJunJqen |
| customers/m3/sanskriti-the-gurukul | 1dBTImJYo4PmPyq2UNZOWWxMTTT-Xt8Hg |
| customers/m3/doon-girls-school | 1rBMvBjvjP9Tdezl7MBh7upOqfvAiBpC8 |
| customers/genai | 1nV6ZPxq9MGH-f4x-ApigbCQl7iAG5uhr |
| customers/genai/kc-high | 1z_y_vBfbQPgKRdijtJvMEjkDb3-pfRLH |
| customers/genai/fountainhead | 1pfg99ezd3mMnJdQAK7M9J_aLfsgxufSt |
| customers/gsp | 1r-Sj1lW-ySAKWwFsH_cs_wB-DWFOpXhH |
| partners | 1WrxS1qoDBL19Y8FfJHCNJTWp2eXDtJ6E |
| partners/northwestern-ctd | 1ltA3DhbQq4ewTBqjgr-MNv4RM70U3grl |
| partners/godrej-foundation | 1vu-wYCD4n_wQsIRzi03vmA4ct9LAIJPk |
| partners/manipal-academy | 1TsRVEHPkRDsOcSbqWkvQKS4uY-ygxmji |
| partners/iit-madras | 1rA2r5pHB4p20RNcR-vvl-Q5hz1xFvTLX |
| partners/iit-zanzibar | 1_ztjxJ8kgIia_g8PzUZZZBX-fqCdmfpt |

### Legacy folders (to migrate from)
| Folder | ID |
|--------|-----|
| Logo | 16SG5T2cDdyQYsI02H9f_ywSNur5YD0rl |
| Logos | 1RuibrrBnq5DNj5ozvC_y7CxzJyhpa23c |

### Standardized Assets (Feb 2026)
All 30 originals converted to PNG, resized to standard dimensions (512, 256, 128, 64px square with transparent padding).

| Folder | ID |
|--------|-----|
| standardized | 1lUsQk2U4hZQivqzkDfl772-apUJEmu6R |
| standardized/512 | 1pj0dlCRGhEg85UOGT2RPMhYlFgMprr8G |
| standardized/256 | 149_9COmWagKaMk1k6w_qrsZ736aA_MUY |
| standardized/128 | 18ADcBcky6kIFm1e8AmPZK9df4Co1oJ5u |
| standardized/64 | 1dJiFoFxEFJmYOSXXlP30271XyKUl6ZH7 |

**Naming convention**: `{category}_{name}_{size}.png`
- `brand_genwise_logo_2025_512.png`
- `customer_gems_modern_academy_256.png`
- `partner_northwestern_ctd_128.png`

### Key GenWise Logos (transparent bg)
- `genwise_logo_2025.png` - 1Q3gQeNUXQBFcaaI-MuwRCBO540p1nt_t
- `White Logo Transparent Background.png` - 1KA0jouiNUVnmvPKi10EQOIMaT2RImN_N
- `Black Logo Transparent Background.png` - 1KC_Sq8xKJxFL8O-sxmp9SH8b51rGsZYs
