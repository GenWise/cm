# CM TODO

## Active Tasks
- [ ] Add M3 WA Status Flyer video to CM database
- [ ] Set up auto-deploy from GitHub to Cloudflare Pages (currently manual)
- [ ] Build Raw Sources UI in CM app (list/add/edit)
- [ ] Add OOB school logo to Drive (missing from collection)

## Completed
- [x] Add raw_sources table migration - Feb 2026
- [x] Add M3 feedback sheet as first raw_source entry
- [x] Curate 12 best M3 testimonials (assets/M3_BEST_TESTIMONIALS_FEB2026.md)
- [x] Create Figma testimonial card prompt (assets/FIGMA_TESTIMONIAL_CARD_PROMPT.md)
- [x] Fix UUID generation bug (video/clip IDs) - Feb 2026
- [x] Organize Google Drive customer folders by program (m3/genai/gsp)
- [x] Create school subfolders with standardized logos
- [x] Deploy UUID fix to production

## Future Enhancements
- [ ] Google Drive integration (browse/pick files in UI)
- [ ] Auto-import videos from Drive folder
- [ ] WhatsApp posting integration via MCP

---

## Session Notes

### 2026-02-23 (17:21 IST)
**M3 Collateral & Asset Organization**

- Created M3 WA Status Flyer (3 slides) - Canva + programmatic HTML/Playwright
- Generated QR code for genwise.in/m3
- Organized 14 customer school logos into program folders (m3/, genai/)
- Added Sanskriti The Gurukul and Doon Girls School logos (with dark variant)
- Created GenWise Brand Guidelines doc (~/code/GenWise_Brand_Guidelines.docx)
- Fixed UUID bug in AddVideo - was generating `video_1234...` instead of proper UUIDs
- Deployed fix to cm.genwise.in via Cloudflare Pages (manual deploy)
- Uploaded M3 WA Status video to Drive (customers/m3/marketing-collateral/)
