# Figma Prompt: M3 Testimonial Card Component

## Overview
Create a reusable testimonial card component for teacher feedback from the My Misconception Mentor (M3) program. Cards will be used across social media (Instagram, LinkedIn, WhatsApp Stories).

## Brand Guidelines (Ei)
- **Primary**: Crimson #A01E21
- **Secondary**: Blue #1848A0
- **Accent**: Yellow #FFB700
- **Font**: Poppins (Headlines: Bold/Black, Body: Regular)
- **Style**: Professional, warm, education-focused

## Card Structure

### Layout
```
┌─────────────────────────────────┐
│  [Ei Logo]           [M3 Badge] │
│                                 │
│  ❝                              │
│  [Quote text - 2-3 lines]       │
│  [Show more →] (if truncated)   │
│  ❞                              │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  [Photo]  [Name]                │
│           [Role] • [Subject]    │
│           [School]              │
│                                 │
│  [School Logo] (optional)       │
└─────────────────────────────────┘
```

### Components

1. **Quote Block**
   - Large opening quote mark (❝) in Yellow #FFB700
   - Quote text: Poppins Regular, 18-24px
   - Max 3 lines visible, then "Show more →" link
   - Closing quote mark (❞)

2. **Attribution**
   - Teacher name: Poppins SemiBold
   - Role + Subject: Poppins Regular, smaller, gray
   - School name: Poppins Medium, Crimson #A01E21

3. **Optional Elements**
   - Teacher photo (circular, 48px)
   - School logo (bottom corner, 40px height)
   - M3 program badge (top right)

## Variants (Component Properties)

### Size Variants
| Name | Dimensions | Use Case |
|------|------------|----------|
| Square | 1080×1080 | Instagram feed |
| Landscape | 1200×628 | LinkedIn, Twitter |
| Story | 1080×1920 | IG/WA Stories |
| Compact | 600×400 | Website embed |

### Style Variants
- **With Photo**: Includes teacher headshot
- **Without Photo**: Text only, larger quote
- **With School Logo**: School logo in corner
- **Without School Logo**: Clean, minimal
- **Dark Mode**: Dark background, light text
- **Light Mode**: White/cream background

### State Variants
- **Default**: Quote truncated to 3 lines
- **Expanded**: Full quote visible (for interactive)

## Color Themes
1. **Crimson** (default): #A01E21 background, white text
2. **White**: White background, dark text, crimson accents
3. **Blue**: #1848A0 background, white text
4. **Gradient**: Crimson to Blue diagonal

## Interactive Element (Show More)
For web/app use:
- "Show more →" link appears if quote > 150 chars
- Click expands card height smoothly
- Changes to "Show less ←" when expanded

For static exports (social):
- Long quotes split into carousel slides
- Or use compact version of quote

## Export Specifications
- PNG: 2x resolution for retina
- SVG: For web use
- Naming: `m3_testimonial_{school}_{size}_{theme}.png`

## Sample Content for Testing
```
Quote: "I have started enjoying the wrong answers given by our students as they help us identify misconceptions and immediately remediate them."
Name: Math Teacher
School: PSBB
Subject: Middle School Math
```

## Figma Organization
```
📁 M3 Testimonials
  📁 Components
    - Card/Base
    - Card/WithPhoto
    - Card/WithLogo
  📁 Variants
    - Size/Square
    - Size/Landscape
    - Size/Story
  📁 Exports
    - Instagram
    - LinkedIn
    - WhatsApp
```
