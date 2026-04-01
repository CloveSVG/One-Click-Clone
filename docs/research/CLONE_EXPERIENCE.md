# Clone Experience Log

Accumulated lessons from each clone. Read this before starting a new clone.

---

## 2026-04-02 — kling.ai/dev

### What went well
- Parallel builder agents (5 worktrees) built all sections simultaneously — huge time savings
- Node.js `fetch` for asset downloads bypassed CDN CORS restrictions that blocked `curl`
- Extracting all 3 tab states in Product Features before building prevented rework
- Using `getComputedStyle` for exact CSS values instead of eyeballing

### What went wrong
- **External video URLs in components**: Initially used CDN URLs for `<video>` sources. Videos failed to load due to CORS. Fixed by downloading all 3 demo videos (32MB total) to `public/videos/`.
- **Wrong logo asset**: Downloaded a partner logo banner (2785x214) instead of the actual KlingAI header logo. The header logo was an SVG sprite (`<use>` element) that couldn't be extracted directly. Had to create a text+SVG fallback.
- **Video containers invisible before load**: Video elements are transparent until data loads. Users see an empty gap. Fixed by adding `bg-white/5` background to video containers.
- **`curl` failing on CDN assets**: Kling's CDN rejected `curl` even with referer headers. Node.js `fetch` worked on the same URLs.
- **Font CDN issues**: MiSans font CDN returned error pages. Had to source from GitHub and use a variable font approach.

### New anti-patterns added to SKILL.md
- #21: Always download video/media locally, never reference external CDNs
- #22: Add visible placeholder backgrounds to video containers
- #23: Use Node.js `fetch` instead of `curl` for CDN downloads

### Time-saving techniques
- Compact topology extraction (section classes + heights + headings) before deep extraction saved context
- Running `npm run build` after foundation setup (before any components) caught font issues early
- Using `<source>` tag inside `<video>` with `key` prop forces React to reload video on slide change
