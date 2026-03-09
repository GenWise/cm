# M3 Video Slide Templates — Layout Reference

Source: Figma Make export (Testimonial Card Component, Mar 2026)
Component: `src/app/components/collateral/VideoSlideTemplates.tsx`

---

## Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| crimson | `#A01E21` | Ei ASSET brand, accents, CTA |
| blue | `#1848A0` | GenWise brand, headings |
| yellow | `#FFB700` | Accents, highlights, M3 badge |
| cream | `#FFF8ED` | Light backgrounds |
| darkGray | `#2C2C2C` | Body text |
| orange | `#FF8C00` → `#FF6B00` | GenWise gradient panels |

Font: **Poppins** (all weights)

---

## Aspect Ratios

| Ratio | Dimensions | Platform |
|-------|-----------|----------|
| 16:9 | 1920×1080 (rendered via aspect-[16/9]) | YouTube, LinkedIn |
| 9:16 | portrait (rendered via aspect-[9/16]) | WhatsApp, Instagram Stories |

`isPortrait = aspectRatio === '9:16'`

---

## Slide Types

### 1. Intro Slide (`type: 'intro'`)

**Data fields:** `title`, `subtitle`, `assetPoints[]`, `genWisePoints[]`, `tagline`

**Variants:** `default` | `cinematic`

#### Default — Landscape (16:9)
- Background: cream→white gradient (135deg)
- Header logos: EiAsset h=48, GenWise h=48, top-12 left-16 right-16
- M3 Badge: h=120, blue theme, mb-10, centered
- Title: `text-7xl font-black text-blue`, centered
- Subtitle: `text-3xl`, centered, max-w-3xl
- Feature grid: 2-col, gap-10, max-w-5xl
  - Ei ASSET panel: crimson→red-800 gradient, rounded-3xl, p-10, title text-4xl
  - GenWise panel: orange gradient (#FF8C00→#FF6B00), rounded-3xl, p-10, title text-4xl
  - Bullet dots: w-2 h-2 yellow/white rounded-full, text-lg
- Tagline: `text-3xl font-bold text-blue`, mt-16, centered
- Decorative: blue+crimson blur circles (opacity-5) top-right/bottom-left

#### Default — Portrait (9:16)
- Same structure but stacked (not 2-col grid)
- Header logos: h=36, top-8 left-8 right-8
- M3 Badge: h=100, mb-8
- Title: `text-5xl font-black text-blue`
- Subtitle: `text-xl`
- Panels: space-y-6 (stacked), p-6, title text-2xl, bullet text-sm
- Tagline: `text-lg font-bold text-blue`, mt-10

#### Cinematic — Both orientations
- Background: crimson→blue→orange gradient (135deg)
- Animated blur circles (pulse) top-left + bottom-right
- M3 Badge: h=140 landscape / h=100 portrait, white theme
- Title: `text-8xl` landscape / `text-5xl` portrait, white, font-black
- Subtitle: `text-4xl` landscape / `text-xl` portrait, white, opacity-95
- Tagline: pill shape bg-white/15, border-2 border-white/30, `text-3xl`/`text-xl`
- Bottom logos: EiAsset h=44/h=32, GenWise h=44/h=32 white variant, bottom-10 left-16 right-16

---

### 2. Trust / Social Proof Slide (`type: 'trust'`)

**Data fields:** `title`, `subtitle`, `schoolLogos[]` (URLs), `stats[]` ({label, value})

**Variant:** `default` only

#### Landscape (16:9)
- Background: white, overflow-hidden
- Decorative: blue/5 blur circle top-right
- Header: EiAsset h=52, GenWise h=52, px-16 py-10
- Title: `text-6xl font-black text-blue`, centered, mb-4
- Subtitle: `text-2xl`, centered, mb-16
- Accent banner: blue→crimson gradient (135deg), `text-3xl font-bold`, py-6, rounded-2xl, mb-12
- **School logo grid: 3×3, gap-8, items-center**
  - Each cell: `w-full h-36` (h=144px), bg-cream, rounded-2xl, p-6, border-2 border-gray-100, shadow-md
  - Logo img: `w-full h-full object-contain`
  - Animation: slideInLeft, staggered delay 0.15s per logo
- Stats: 3-col grid, gap-10, max-w-4xl, mt-12
  - Value: `text-6xl font-black text-crimson`
  - Label: `text-lg text-darkGray font-semibold`
  - Animation: scaleIn, staggered from 1.35s + 0.1s

#### Portrait (9:16)
- Header: EiAsset h=32, GenWise h=32, px-8 py-6, border-b
- Title: `text-4xl font-black text-blue`, centered, mb-3
- Subtitle: `text-base`, centered, mb-8
- Accent banner: same gradient, `text-xl font-bold`, py-4, rounded-xl, mb-8
- **School logo grid: 3×3, gap-3**
  - Each cell: `h-20` (h=80px), bg-cream, rounded-xl, p-3, border border-gray-200
  - Animation: fadeInUp, staggered 0.1s per logo
- Stats: 3-col grid, gap-3, mt-8
  - Value: `text-3xl font-black text-crimson`
  - Label: `text-xs font-semibold`
  - Animation: fadeInUp, from 0.9s + 0.1s

---

### 3. Transition Slide (`type: 'transition'`)

**Data fields:** `title`, `description`

**Variant:** `default` only (same component for both orientations)

- Background: blue→crimson gradient (135deg)
- Decorative: yellow/20 + white/10 blur circles
- Logos: EiAsset + GenWise white, absolute top (portrait: top-6 left-6 / landscape: top-10 left-16)
  - Portrait: h=32; Landscape: h=44
- Title: portrait `text-5xl` / landscape `text-7xl`, font-black, white, mb-8
- Description: portrait `text-xl` / landscape `text-3xl`, white, opacity-95
- Content area: portrait `px-8 max-w-md` / landscape `px-16 max-w-4xl`

---

### 4. Contact Slide (`type: 'contact'`)

**Data fields:** `title`, `websiteUrl`, `contacts[]` ({name, email, phone})

**Variant:** `cinematic` (only variant implemented)

#### Landscape (16:9)
- Background: crimson→blue gradient (135deg)
- Decorative: yellow/20 blur circle top-right
- M3 Badge: h=120, white theme, pt-16 pb-8, centered, z-10
- Title ("Get in Touch"): `text-7xl font-black`, white, centered
- Subtitle (program name): `text-3xl`, white/90, centered
- Website URL: `text-2xl`, white/80, mb-14
- Contact cards: flex gap-10, max-w-5xl
  - Each: flex-1, bg-white/15 backdrop-blur, rounded-3xl, p-12
  - Name: `text-4xl font-black white`, mb-6
  - Email/Phone: `text-xl white/90`
- Bottom logos: EiAsset h=48, GenWise h=48 white, centered gap-20, pb-10

#### Portrait (9:16)
- M3 Badge: h=90, white theme, pt-12 pb-6
- Title: `text-5xl font-black`, mb-4
- Subtitle: `text-xl`, mb-3
- Website: `text-base`, mb-10
- Contact cards: space-y-4 (stacked)
  - Each: p-6, rounded-2xl
  - Name: `text-2xl font-black`, mb-3
  - Email/Phone: `text-base`
- Bottom logos: h=36, gap-16, pb-8

---

### 5. Testimonial Profile Slide (`type: 'testimonialProfile'`)

**Data fields:** `teacherName`, `teacherRole`, `schoolName`, `thumbnailImage` (URL), `title`

**No variants** — same component, responsive to isPortrait

- Background: full-bleed thumbnail image (`object-cover`) or gray gradient fallback
- Dark overlay: `bg-gradient-to-b from-black/30 via-black/20 to-black/70`
- Top logos: absolute, z-20
  - Portrait: h=40, top-6 left-6 right-6
  - Landscape: h=56, top-10 left-12 right-12
- Bottom text overlay: absolute bottom-0, z-10, white text, centered
  - Title: portrait `text-2xl` / landscape `text-3xl`, font-bold, mb-4
  - Teacher name: portrait `text-4xl` / landscape `text-5xl`, font-black, color `#FF8C00`, mb-2
  - Role: portrait `text-lg` / landscape `text-2xl`, font-semibold, mb-1
  - School: portrait `text-base` / landscape `text-xl`
  - Padding: portrait `px-8 pb-12` / landscape `px-16 pb-16`

---

## Testimonial Cards (Social Media)

Component: `TestimonialCardImproved.tsx`

| Size | Width | Height | Quote px | Name px | Role px | School px | Padding | Photo |
|------|-------|--------|----------|---------|---------|-----------|---------|-------|
| square | 1080 | 1080 | 42 | 32 | 22 | 28 | 70 | 90 |
| landscape | 1200 | 628 | 36 | 28 | 20 | 24 | 60 | 80 |
| story | 1080 | 1920 | 48 | 36 | 24 | 32 | 80 | 100 |
| compact | 600 | 400 | 24 | 18 | 14 | 16 | 40 | 60 |

Logo heights derived from padding: EiAsset = padding×0.70, M3 badge = padding×1.20, GenWise = padding×0.75
Quote max chars: story=220, landscape=140, others=180
Export: html2canvas scale=2 (2× retina)

**Themes:** crimson (`#A01E21` bg), blue (`#1848A0` bg), white (`#FFFFFF` bg), gradient (crimson→blue 135deg)

---

## Animations (CSS keyframes, injected via `<style>`)

| Class | Keyframe | Duration |
|-------|----------|----------|
| `.animate-fadeInUp` | opacity 0→1, translateY 20px→0 | 0.6s ease-out |
| `.animate-slideInLeft` | opacity 0→1, translateX -40px→0 | 0.8s ease-out |
| `.animate-scaleIn` | opacity 0→1, scale 0.8→1 | 0.6s ease-out |

All use `animationFillMode: 'backwards'` + staggered delay per item.

---

## Browser Preview Scaling

In the SlideTemplateBrowser, slides are rendered at natural size inside `aspect-[16/9]` or `aspect-[9/16]` containers — no manual transform scaling needed (Tailwind handles via aspect ratio classes).

For testimonial cards, the hub grid preview uses:
```
transform: scale(0.38); transformOrigin: 'top left'; width: '263%'; height: '263%'
```
(i.e., rendered at full pixel size then scaled down 62%)
