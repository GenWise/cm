# Video Processing Workflow

## Overview
End-to-end pipeline for processing raw testimonial videos into branded, captioned content distributed across platforms.

## Pipeline Stages

### 1. Ingest
**Input:** Raw video file or Drive folder URL
**Output:** Entry in `raw_sources` table

- Add to CM raw_sources with source_type='video_recording'
- Store Drive URL, folder ID, metadata
- Set status='raw'

**Tools:** CM API, Google Drive MCP

---

### 2. Transcript
**Input:** Video file
**Output:** Text transcript + SRT file

- Check if Zoom transcript exists (`.vtt` or `.txt` in folder)
- If not, run Whisper: `whisper video.mp4 --model medium --output_format srt`
- Store transcript in CM (video.transcript_text, video.captions_srt_url)

**Tools:** Whisper CLI, Google Drive MCP

---

### 3. Clip Identification
**Input:** Transcript + human review
**Output:** List of clip definitions with timestamps

Human marks segments worth extracting:
```
{
  "clips": [
    {
      "start": "17:07",
      "end": "20:22",
      "title": "Giraffe example - Variation, Selection, Heredity",
      "description": "Learning from M3, taking to internal teacher meeting",
      "tags": ["m3", "biology", "testimonial", "teaching-practice"]
    }
  ]
}
```

**Tools:** Manual (human input), could be LLM-assisted for suggestions

---

### 4. Clip Extraction
**Input:** Video file + clip timestamps
**Output:** Individual clip files

```bash
# Extract clip with re-encoding for clean cuts
ffmpeg -i input.mp4 -ss 00:17:07 -to 00:20:22 -c:v libx264 -c:a aac clip_01.mp4

# Or copy without re-encoding (faster, but may have keyframe issues)
ffmpeg -i input.mp4 -ss 00:17:07 -to 00:20:22 -c copy clip_01.mp4
```

**Tools:** ffmpeg

---

### 5. Assembly
**Input:** Multiple clips
**Output:** Single assembled video

- Concatenate clips in order
- Add transitions (crossfade, fade to black)
- Trim dead air, pauses

```bash
# Concat using file list
ffmpeg -f concat -safe 0 -i clips.txt -c copy assembled.mp4
```

**Tools:** ffmpeg, possibly DaVinci Resolve for complex edits

---

### 6. Branding
**Input:** Assembled video
**Output:** Branded video with intro/outro/lower thirds

Elements to add:
- **Intro**: GenWise/M3 logo animation (3-5 sec)
- **Lower Third**: Speaker name, role, school (appears at start of each speaker)
- **Outro**: Call to action, QR code, contact info (5-10 sec)
- **Watermark**: Small logo in corner (optional)

Assets location: `genwise-assets/brand/`

**Tools:** ffmpeg (overlay), DaVinci Resolve, Canva

---

### 7. Captions
**Input:** Branded video + SRT file
**Output:** Video with captions (burned in or sidecar)

Options:
- **Burned in**: Permanent, works everywhere
- **Sidecar SRT**: Toggleable on YouTube/LinkedIn

```bash
# Burn in captions
ffmpeg -i video.mp4 -vf subtitles=captions.srt output.mp4

# Style captions
ffmpeg -i video.mp4 -vf "subtitles=captions.srt:force_style='FontSize=24,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,Outline=2'" output.mp4
```

**Tools:** ffmpeg, Whisper (for SRT generation)

---

### 8. Export
**Input:** Final branded video
**Output:** Platform-specific versions

| Platform | Dimensions | Duration | Format |
|----------|------------|----------|--------|
| YouTube | 1920x1080 | Any | MP4 H.264 |
| Instagram Feed | 1080x1080 | <60s | MP4 |
| Instagram Reels | 1080x1920 | <90s | MP4 |
| LinkedIn | 1920x1080 | <10min | MP4 |
| WhatsApp Status | 1080x1920 | <30s | MP4 |

```bash
# Square crop for Instagram
ffmpeg -i input.mp4 -vf "crop=ih:ih,scale=1080:1080" -c:a copy instagram.mp4

# Vertical for Stories/Reels
ffmpeg -i input.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920" -c:a copy story.mp4
```

**Tools:** ffmpeg

---

### 9. Upload to YouTube
**Input:** Final video + metadata
**Output:** YouTube video URL

```bash
# Using yt-dlp or youtube-upload CLI
youtube-upload \
  --title "Aditi Ghosh - M3 Biology Testimonial" \
  --description "Teacher testimonial from PICT Model School..." \
  --category Education \
  --tags "M3,testimonial,biology,teacher" \
  --playlist "M3 Testimonials" \
  --privacy unlisted \
  final_video.mp4
```

**Tools:** youtube-upload CLI, YouTube Data API

---

### 10. CM Update
**Input:** YouTube URL, video metadata
**Output:** Updated CM database

- Create/update `videos` entry with youtube_url
- Create `clips` entries with timestamps
- Create `content_posts` entries for each platform
- Update `raw_sources` status to 'published'

**Tools:** CM API (Supabase)

---

### 11. Social Distribution
**Input:** Platform-specific videos + captions
**Output:** Scheduled/posted content

- Schedule posts via CM content_posts workflow
- Post to: YouTube, LinkedIn, Instagram, WhatsApp
- Track engagement metrics

**Tools:** Platform APIs, MCP tools (WhatsApp, Twitter), Buffer/Hootsuite

---

## Automation Opportunities

### Fully Automatable
- Transcript generation (Whisper)
- Clip extraction (ffmpeg)
- Caption burning (ffmpeg)
- Platform exports (ffmpeg)
- CM database updates (API)

### Semi-Automatable (LLM-assisted)
- Clip identification (suggest from transcript)
- Title/description generation
- Tag suggestions
- Caption timing refinement

### Human Required
- Final clip selection approval
- Quality review before publish
- Brand/messaging alignment check

---

## Proposed Skill: `/process-testimonial`

```
/process-testimonial

Input:
- drive_url: Google Drive folder with raw video
- clips: Array of {start, end, title, description, tags}
- speaker: {name, role, school}
- program: M3/GSP/GenAI

Actions:
1. Download video from Drive
2. Generate transcript if missing
3. Extract clips using timestamps
4. Assemble and add branding
5. Generate captions
6. Export for all platforms
7. Upload to YouTube
8. Update CM database
9. Create draft posts for review

Output:
- YouTube URL
- CM video ID
- Draft post IDs for each platform
```

---

## File Locations

| Asset | Location |
|-------|----------|
| Raw videos | Google Drive: M3 Sep/M3 Sep teacher testimonials |
| Processed videos | Google Drive: genwise-assets/videos/ |
| Brand assets | Google Drive: genwise-assets/brand/ |
| Transcripts | CM database (video.transcript_text) |
| SRT files | Google Drive alongside video |
