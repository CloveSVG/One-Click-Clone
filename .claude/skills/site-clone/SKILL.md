---
name: site-clone
description: "Reverse-engineer and replicate any website into a pixel-perfect Next.js codebase. Extracts design tokens, assets, interactions, and content, then dispatches parallel builder agents to reconstruct each section. Supports multiple URLs."
argument-hint: "<url1> [<url2> ...]"
user-invocable: true
---

# Site Clone

You are about to reverse-engineer and rebuild **$ARGUMENTS** as pixel-perfect replicas inside this Next.js codebase.

When given multiple URLs, isolate each site's extraction artifacts in `docs/research/<hostname>/` and process them in parallel where possible.

You are not working in two discrete phases. You are a **construction foreman** — as you inspect each section, you draft a detailed blueprint, then hand it to a specialist builder with everything they need. Extraction and construction overlap, but extraction is meticulous and produces auditable artifacts.

## Scope Defaults

Clone exactly what is visible at the given URL. Unless the user says otherwise:

- **Fidelity:** Pixel-perfect — exact colors, spacing, typography, animations
- **Included:** Visual layout, component structure, interactions, responsive behavior, mock data
- **Excluded:** Real backend, authentication, real-time features, SEO audit, accessibility audit
- **Customization:** None — pure emulation first

Honor any additional user instructions over these defaults.

## Pre-Flight

1. **Browser automation is mandatory.** Check for Chrome MCP, Playwright MCP, Browserbase MCP, Puppeteer MCP, or similar. If none are available, ask the user. This skill cannot run without browser control.
2. Parse `$ARGUMENTS` as one or more URLs. Validate each — if invalid, ask the user. Navigate to each and confirm it loads.
3. Verify the base scaffold builds: `npm run build`. The Next.js + shadcn/ui + Tailwind v4 foundation must be in place.
4. Create output directories if missing: `docs/research/`, `docs/research/components/`, `docs/design-references/`, `scripts/`.

---

## Core Principles

These principles govern every decision. Internalize them.

### 1. Exhaustive Extraction Over Fast Shipping

Every builder agent must receive **everything** it needs. If a builder has to guess a color, a padding value, or an animation timing — you have failed at extraction. Spend the extra minute extracting one more property rather than shipping an incomplete brief.

### 2. Granular Tasks Produce Precision

A builder given "build the entire features section" will approximate spacing, guess font sizes, and produce something close but clearly wrong. A builder given a single focused component with exact CSS values nails it every time. If a section has 3+ distinct sub-components, break it up.

**Complexity budget:** If a builder prompt exceeds ~150 lines of spec content, the section is too complex for one agent. Split it.

### 3. Authentic Content Only

Extract actual text, images, videos, and SVGs from the live site. This is a clone, not a mockup. Use `element.textContent`, download every `<img>` and `<video>`, extract inline `<svg>` as React components. The only exception: content that is clearly server-generated and unique per session.

**Layered assets matter.** A section that looks like one image is often multiple layers — a background gradient, a foreground mockup PNG, an overlay icon. Inspect each container's full DOM tree and enumerate ALL images within it, including absolutely-positioned overlays.

### 4. Global Foundation Before Any Component

Nothing can be built until the foundation exists: global CSS with design tokens, TypeScript types, global assets (fonts, favicons). This is sequential and non-negotiable. Everything after this can be parallel.

### 5. Capture Motion, Not Just Appearance

A website is not a screenshot. Elements move, change, appear, and disappear in response to scrolling, hovering, clicking, resizing, and time. For every element, extract its **appearance** (exact computed CSS) AND its **behavior** (what changes, what triggers the change, how the transition happens).

Not "it looks like 16px" — extract the actual computed value. Not "the nav changes on scroll" — document the trigger, the before/after CSS values, and the transition.

### 6. Determine Interaction Driver First

This is the single most expensive mistake in cloning: building click-driven tabs when the original is scroll-driven, or vice versa. Before writing any builder prompt for an interactive section, definitively answer: **Is this section driven by clicks, scrolls, hovers, time, or some combination?**

How to determine this:
1. **Don't click first.** Scroll through the section slowly and observe if things change on their own.
2. If they do — it's scroll-driven. Extract the mechanism.
3. If nothing changes on scroll — click and hover to test.
4. Document the interaction model explicitly in the blueprint.

### 7. Every State Matters — Extract All Of Them

Many components have multiple visual states. A tab bar shows different content per tab. A header looks different at scroll 0 vs scroll 100. A card has hover effects. You must extract ALL states.

For tabbed/stateful content:
- Click each tab/button via browser MCP
- Extract the content, images, and data for EACH state
- Record which content belongs to which state
- Note the transition animation between states

For scroll-dependent elements:
- Capture computed styles at scroll 0 and after the trigger
- Diff the two to identify which properties change
- Record the transition CSS and trigger threshold

### 8. Blueprints Are Contracts

Every component gets a blueprint file in `docs/research/components/` BEFORE any builder is dispatched. The blueprint is the contract between extraction and building. The builder receives it inline — never "go read the file."

### 9. Continuous Compilation

Every builder must verify `npx tsc --noEmit` passes. After merging worktrees, run `npm run build`. A broken build is never acceptable.

---

## Stage 1: Survey

Navigate to the target URL with browser MCP.

### Screenshots

- Full-page screenshots at **1440px** (desktop) and **390px** (mobile)
- Save to `docs/design-references/` with descriptive names

### Global Token Extraction

Extract these from the page before anything else:

**Fonts** — Inspect `<link>` tags for Google Fonts or self-hosted fonts. Check computed `font-family` on headings, body, code, labels. Document every family, weight, and style. Configure in `layout.tsx` using `next/font/google` or `next/font/local`.

**Colors** — Extract the site's color palette from computed styles. Update `globals.css` with the target's actual colors. Map to shadcn token names where they fit. Add custom properties for extras.

**Favicons & Meta** — Download favicons, apple-touch-icons, OG images, webmanifest to `public/seo/`. Update `layout.tsx` metadata.

**Global UI patterns** — Identify site-wide CSS/JS: custom scrollbar hiding, scroll-snap, global keyframe animations, backdrop filters, smooth scroll libraries (Lenis, Locomotive Scroll — check for `.lenis`, `.locomotive-scroll` classes). Add to `globals.css`.

### Mandatory Interaction Sweep

This is a dedicated pass AFTER screenshots and BEFORE component work. Its purpose is to discover every behavior on the page.

#### Scroll Sweep

Scroll the page slowly from top to bottom via browser MCP. At each section, pause and observe:
- Does the header change appearance? Record the scroll position threshold.
- Do elements animate into view? Record which ones and the animation type.
- Does a sidebar or tab indicator auto-switch as you scroll?
- Are there scroll-snap points?
- Is there a smooth scroll library active?

#### Interactive Element Deep Extraction

This is critical. Systematically discover and document every interactive element on the page:

**Button Audit:**
- Find every `<button>`, `<a>`, `[role="button"]`, and clickable element
- For each: record its text, href/target, visual style at rest
- Click it via browser MCP and record what happens: navigation? modal? state change? animation?
- Record hover effect: color change, scale, shadow, underline, opacity shift
- Record the transition CSS (duration, easing)

**Tab/Pill/Segmented Control Audit:**
- Find every tab group, pill selector, or segmented control
- Click EACH tab/pill one by one
- For each state: screenshot the visible content, extract all text and images
- Record the active indicator style (underline, background fill, font weight change)
- Record the content transition animation (fade, slide, instant swap)
- Map: { tabLabel → contentHTML, images[], cardData[] }

**Carousel/Slider Audit:**
- Find every carousel, slider, or horizontally scrollable container
- Scroll/swipe through ALL slides
- For each slide: screenshot, extract content, images, text
- Record: total slide count, auto-play behavior, transition type (slide, fade, scale)
- Record navigation controls: dots, arrows, swipe gestures
- Map: { slideIndex → content }

**Dropdown/Menu Audit:**
- Find every dropdown trigger (nav items, select-like elements, "more" buttons)
- Click each one to open
- Screenshot the expanded state
- Extract all menu items: text, icons, href, sub-menus
- Record open/close animation

**Accordion/Expandable Audit:**
- Find every accordion, FAQ section, or collapsible element
- Click each to expand
- Extract the revealed content (text, images, code blocks)
- Record expand/collapse animation (height transition, rotation of chevron icon)
- Check: can multiple be open simultaneously, or is it exclusive?

**Modal/Dialog Audit:**
- Find elements that trigger modals (buttons with "Sign up", "Learn more", "Watch demo", etc.)
- Click each trigger via browser MCP
- Screenshot the modal content
- Extract all content inside the modal
- Record: overlay style, entrance animation, close mechanism
- IMPORTANT: close each modal before proceeding to the next

**Hover Effect Audit:**
- Hover over every element that might have hover states: buttons, cards, links, images, nav items
- Record what changes: color, scale, shadow, underline, opacity, transform
- Record the transition CSS (property, duration, easing)

**Scroll-Triggered Animation Audit:**
- Scroll slowly and watch for elements that animate into view
- Record: which elements, animation type (fade-up, slide-in, scale-in, stagger), trigger point (viewport intersection ratio), duration
- Check if animations replay on re-scroll or fire only once

#### Responsive Sweep

Test at 3 widths via browser MCP:
- **1440px** (desktop), **768px** (tablet), **390px** (mobile)
- At each width, note layout changes (column → stack, sidebar disappears, hamburger menu appears)
- Note approximately which breakpoint triggers each change

Save ALL interaction findings to `docs/research/BEHAVIORS.md`.

### Page Topology

Map every distinct section top to bottom. Give each a working name. Document:
- Visual order
- Fixed/sticky vs. flow positioning
- Page layout (scroll container, columns, z-layers)
- Section dependencies
- **Interaction model** of each section (static, click-driven, scroll-driven, time-driven, swipe-driven)

Save as `docs/research/TOPOLOGY.md`.

---

## Stage 2: Foundation

Sequential. Do this yourself — not delegated.

1. **Update fonts** in `layout.tsx` to match the target site
2. **Update globals.css** with extracted color tokens, spacing, keyframes, global scroll behaviors
3. **Create TypeScript interfaces** in `src/types/` for observed content structures
4. **Extract SVG icons** — find all inline `<svg>` elements, deduplicate, save as named React components in `src/components/icons.tsx` (e.g., `SearchIcon`, `ArrowRightIcon`, `LogoIcon`)
5. **Trigger all lazy-loaded content** — scroll the entire page slowly via browser MCP to force-load lazy images and scroll-triggered content:

```javascript
// Run via browser MCP to trigger all lazy content
(async function() {
  const totalHeight = document.body.scrollHeight;
  const step = window.innerHeight / 2;
  for (let y = 0; y < totalHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 400));
  }
  window.scrollTo(0, 0);
  await new Promise(r => setTimeout(r, 500));
  // Report lazy-loaded elements found
  const lazySrcs = [...document.querySelectorAll('[data-src],[data-lazy-src],[data-original],[data-srcset],[loading="lazy"]')].map(el => ({
    tag: el.tagName,
    dataSrc: el.dataset?.src || el.dataset?.lazySrc || el.dataset?.original,
    dataSrcset: el.dataset?.srcset,
    currentSrc: el.src || el.currentSrc,
    loaded: el.tagName === 'IMG' ? el.complete : true
  }));
  return JSON.stringify({ lazyElements: lazySrcs.length, lazySrcs });
})();
```

6. **Discover all assets** — run the comprehensive asset discovery script:

```javascript
JSON.stringify({
  images: [...document.querySelectorAll('img')].map(img => ({
    src: img.currentSrc || img.src,
    srcset: img.srcset || null,
    sizes: img.sizes || null,
    alt: img.alt,
    width: img.naturalWidth,
    height: img.naturalHeight,
    loading: img.loading,
    parentTag: img.parentElement?.tagName,
    position: getComputedStyle(img).position,
    zIndex: getComputedStyle(img).zIndex
  })),
  videos: [...document.querySelectorAll('video')].map(v => ({
    src: v.src || v.querySelector('source')?.src,
    type: v.querySelector('source')?.type,
    poster: v.poster,
    autoplay: v.autoplay, loop: v.loop, muted: v.muted, playsInline: v.playsInline
  })),
  backgroundImages: [...document.querySelectorAll('*')].filter(el => {
    const bg = getComputedStyle(el).backgroundImage;
    return bg && bg !== 'none';
  }).map(el => ({
    url: getComputedStyle(el).backgroundImage,
    element: el.tagName + (el.id ? '#' + el.id : '') + (el.className ? '.' + el.className.toString().split(' ')[0] : '')
  })),
  pseudoBackgrounds: (() => {
    const results = [];
    document.querySelectorAll('*').forEach(el => {
      for (const pseudo of ['::before', '::after']) {
        const bg = getComputedStyle(el, pseudo).backgroundImage;
        if (bg && bg !== 'none') {
          results.push({ element: el.tagName + '.' + (el.className?.toString().split(' ')[0] || ''), pseudo, url: bg });
        }
      }
    });
    return results;
  })(),
  svgs: [...document.querySelectorAll('svg')].map((svg, i) => ({
    index: i,
    viewBox: svg.getAttribute('viewBox'),
    width: svg.getAttribute('width'),
    height: svg.getAttribute('height'),
    pathCount: svg.querySelectorAll('path').length,
    label: svg.getAttribute('aria-label') || svg.querySelector('title')?.textContent
  })),
  fonts: (() => {
    const fontFaces = [...document.styleSheets].flatMap(sheet => {
      try { return [...sheet.cssRules].filter(r => r instanceof CSSFontFaceRule).map(r => ({ family: r.style.fontFamily, src: r.style.src, weight: r.style.fontWeight, style: r.style.fontStyle })); }
      catch { return []; }
    });
    const googleFonts = [...document.querySelectorAll('link[href*="fonts.googleapis"]')].map(l => l.href);
    const computed = [...new Set([...document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a,span,button,input,label,code')].map(el => getComputedStyle(el).fontFamily))];
    return { fontFaces, googleFonts, computed };
  })(),
  favicons: [...document.querySelectorAll('link[rel*="icon"],link[rel="apple-touch-icon"],link[rel="manifest"]')].map(l => ({ rel: l.rel, href: l.href, sizes: l.sizes?.toString(), type: l.type })),
  meta: {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content,
    ogImage: document.querySelector('meta[property="og:image"]')?.content,
    themeColor: document.querySelector('meta[name="theme-color"]')?.content
  }
}, null, 2);
```

7. **Write asset manifest** — create `docs/research/asset-manifest.json` from the discovery results, then run: `node scripts/fetch-assets.mjs`
8. **Download ALL media locally** — this is critical. Never reference external CDN URLs in components. Download every image, video, and font to `public/`:
   - Images → `public/images/`
   - Videos → `public/videos/`
   - Fonts → `public/fonts/`
   Use Node.js `fetch` (NOT `curl`, which fails on many CDNs):
   ```javascript
   node -e "
   const fs = require('fs');
   const urls = [
     ['https://cdn.example.com/video.mp4', 'public/videos/video.mp4'],
     ['https://cdn.example.com/image.png', 'public/images/image.png'],
   ];
   Promise.all(urls.map(async ([url, path]) => {
     const res = await fetch(url, { headers: { Referer: 'https://target-site.com/' } });
     if (!res.ok) return path + ': HTTP ' + res.status;
     const buf = Buffer.from(await res.arrayBuffer());
     fs.writeFileSync(path, buf);
     return path + ': ' + (buf.length / 1024 / 1024).toFixed(1) + ' MB';
   })).then(r => console.log(r.join('\n')));
   "
   ```
   Reference local paths in components: `src="/videos/demo.mp4"`, NOT CDN URLs.
9. **Verify asset completeness** — after downloading, check that every `<img>` src and `background-image` URL has a corresponding local file. Re-download any missing items.
10. **Verify:** `npm run build` passes

---

## Stage 3: Blueprint & Build

The core loop. For each section in your topology (top to bottom): **extract → blueprint → dispatch**.

### Step 1: Extract

For each section, use browser MCP to extract everything:

1. **Screenshot** the section in isolation. Save to `docs/design-references/`.

2. **Extract CSS** for every element using the deep extraction script:

```javascript
(function(selector) {
  const el = document.querySelector(selector);
  if (!el) return JSON.stringify({ error: 'Not found: ' + selector });

  const PROPS = [
    'fontSize','fontWeight','fontFamily','lineHeight','letterSpacing','color',
    'textTransform','textDecoration','textAlign','wordSpacing',
    'backgroundColor','background','backgroundImage','backgroundSize','backgroundPosition',
    'padding','paddingTop','paddingRight','paddingBottom','paddingLeft',
    'margin','marginTop','marginRight','marginBottom','marginLeft',
    'width','height','maxWidth','minWidth','maxHeight','minHeight',
    'display','flexDirection','justifyContent','alignItems','alignSelf','flexWrap','flexGrow','flexShrink','gap','rowGap','columnGap',
    'gridTemplateColumns','gridTemplateRows','gridColumn','gridRow','gridAutoFlow',
    'borderRadius','borderTopLeftRadius','borderTopRightRadius','borderBottomLeftRadius','borderBottomRightRadius',
    'border','borderTop','borderBottom','borderLeft','borderRight','borderColor','borderWidth','borderStyle',
    'boxShadow','textShadow',
    'overflow','overflowX','overflowY','overscrollBehavior',
    'position','top','right','bottom','left','zIndex','float',
    'opacity','visibility','transform','transformOrigin',
    'transition','transitionProperty','transitionDuration','transitionTimingFunction','transitionDelay',
    'animation','animationName','animationDuration','animationTimingFunction','animationDelay','animationIterationCount',
    'cursor','pointerEvents','userSelect',
    'objectFit','objectPosition','aspectRatio',
    'mixBlendMode','filter','backdropFilter',
    'whiteSpace','textOverflow','WebkitLineClamp','WebkitBoxOrient',
    'scrollSnapType','scrollSnapAlign','scrollBehavior',
    'clipPath','maskImage','contain','willChange'
  ];

  function grab(element, pseudo) {
    const cs = pseudo ? getComputedStyle(element, pseudo) : getComputedStyle(element);
    const result = {};
    PROPS.forEach(p => {
      const v = cs[p];
      if (v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px' && v !== 'rgba(0, 0, 0, 0)' && v !== 'start') result[p] = v;
    });
    return result;
  }

  function walk(element, depth) {
    if (depth > 5) return null;
    const kids = [...element.children];
    const node = {
      tag: element.tagName.toLowerCase(),
      id: element.id || null,
      classes: element.className?.toString?.().split(' ').filter(Boolean).slice(0, 8) || [],
      text: element.childNodes.length === 1 && element.childNodes[0].nodeType === 3 ? element.textContent.trim().slice(0, 300) : null,
      styles: grab(element),
      href: element.tagName === 'A' ? element.href : null,
      img: element.tagName === 'IMG' ? { src: element.src, srcset: element.srcset, alt: element.alt, naturalWidth: element.naturalWidth, naturalHeight: element.naturalHeight } : null,
      video: element.tagName === 'VIDEO' ? { src: element.src || element.querySelector('source')?.src, poster: element.poster, autoplay: element.autoplay, loop: element.loop, muted: element.muted } : null,
      svg: element.tagName === 'svg' || element.tagName === 'SVG' ? { viewBox: element.getAttribute('viewBox'), innerHTML: element.innerHTML.slice(0, 500) } : null,
      childCount: kids.length,
      children: kids.slice(0, 30).map(c => walk(c, depth + 1)).filter(Boolean)
    };
    // Pseudo-elements
    const beforeBg = getComputedStyle(element, '::before').backgroundImage;
    const afterBg = getComputedStyle(element, '::after').backgroundImage;
    if (beforeBg && beforeBg !== 'none') node['::before'] = grab(element, '::before');
    if (afterBg && afterBg !== 'none') node['::after'] = grab(element, '::after');
    return node;
  }
  return JSON.stringify(walk(el, 0), null, 2);
})('SELECTOR');
```

3. **Extract interactive element states** — for components with tabs, sliders, or state changes:

```javascript
// For a tab group: click each tab and extract its content
(async function(tabSelector, contentSelector) {
  const tabs = [...document.querySelectorAll(tabSelector)];
  const results = [];
  for (const tab of tabs) {
    tab.click();
    await new Promise(r => setTimeout(r, 500)); // wait for transition
    const content = document.querySelector(contentSelector);
    results.push({
      tabText: tab.textContent.trim(),
      tabActive: tab.classList.toString(),
      contentHTML: content?.innerHTML?.slice(0, 2000),
      images: [...(content?.querySelectorAll('img') || [])].map(img => ({ src: img.src, alt: img.alt })),
      text: content?.textContent?.trim().slice(0, 1000)
    });
  }
  return JSON.stringify(results, null, 2);
})('TAB_SELECTOR', 'CONTENT_SELECTOR');
```

4. **Extract hover states** — capture before/after CSS for interactive elements:

```javascript
// Compare resting vs. hover CSS for an element
(function(selector) {
  const el = document.querySelector(selector);
  if (!el) return '{}';
  const before = {};
  const cs = getComputedStyle(el);
  ['color','backgroundColor','boxShadow','transform','opacity','borderColor','textDecoration','scale'].forEach(p => before[p] = cs[p]);
  return JSON.stringify({ selector, restingStyles: before, transition: cs.transition });
})(SELECTOR);
```

Then hover via browser MCP and re-extract to get the diff.

5. **Extract real content** — all text, alt attributes, aria labels. For tabbed content, click each tab and extract per state.

6. **Identify assets** — which downloaded images/videos map to this section. Check for layered images.

### Step 2: Write the Blueprint

For each section (or sub-component), create a blueprint file.

**Path:** `docs/research/components/<component-name>.blueprint.md`

**Template:**

```markdown
# <ComponentName> Blueprint

## Overview
- **Target file:** `src/components/<ComponentName>.tsx`
- **Screenshot:** `docs/design-references/<name>.png`
- **Interaction model:** <static | click-driven | scroll-driven | time-driven | swipe-driven>

## DOM Structure
<Element hierarchy — what contains what>

## Computed Styles (from getComputedStyle)

### Container
- display: ...
- padding: ...
- (every relevant property with exact values)

### <Child element 1>
- fontSize: ...
- color: ...

## Interactive Elements

### Buttons
| Text | Type | Href | Hover Effect | Click Action |
|------|------|------|-------------|-------------|
| "Learn More →" | link | /docs | opacity 0.8, underline | navigate |

### Tabs / State Switches
| Tab Label | Active Style | Content Summary |
|-----------|-------------|-----------------|
| "Video Generation API" | font-weight: 700, border-bottom: 2px solid white | Video cards with... |
| "Image Generation API" | ... | Image cards with... |

### Carousel / Slider
- Slide count: N
- Auto-play: yes/no, interval: Nms
- Transition: slide/fade, duration: Nms
- Navigation: arrows/dots/swipe
- Slides: [{ content description, images }]

## State Transitions

### <Behavior name>
- **Trigger:** <exact mechanism>
- **State A:** <CSS values>
- **State B:** <CSS values>
- **Transition:** <duration, easing, properties>

### Hover States
- **<Element>:** <property>: <before> → <after>, transition: <value>

## Per-State Content (for tabbed/stateful components)

### State: "<Tab 1 Label>"
- Title: "..."
- Description: "..."
- Cards/Items: [{ title, description, image, link }]

### State: "<Tab 2 Label>"
- ...

## Assets
- Background: `public/images/<file>`
- Images: `public/images/<file1>`, `public/images/<file2>`
- Icons: <ArrowIcon>, <SearchIcon> from icons.tsx

## Text Content (verbatim)
<All text, copy-pasted from live site>

## Responsive Behavior
- **Desktop (1440px):** <layout>
- **Tablet (768px):** <changes>
- **Mobile (390px):** <changes>
- **Breakpoint:** ~<N>px
```

Fill every section. If N/A, write "N/A" — but think twice. Even a footer has hover states on links.

### Step 3: Dispatch Builders

Based on complexity, dispatch builder agents in worktrees:

**Simple section** (1-2 sub-components): One builder.
**Complex section** (3+ sub-components): One agent per sub-component + one for the wrapper.

**Every builder receives:**
- Full blueprint contents inline (not a file reference)
- Path to section screenshot
- Shared imports: `icons.tsx`, `cn()`, shadcn primitives
- Target file path
- Instruction to verify `npx tsc --noEmit`
- Responsive breakpoints and changes

**Don't wait.** Dispatch builders for section N while extracting section N+1. Builders work in parallel via worktrees.

### Step 4: Merge

As builders complete:
- Merge worktree branches into main
- Resolve conflicts intelligently (you have full context)
- After each merge: `npm run build`
- Fix type errors immediately

---

## Stage 4: Assembly

After all sections are built and merged, wire everything in `src/app/page.tsx`:

- Import all section components
- Implement page-level layout from your topology (scroll containers, columns, sticky positioning, z-layers)
- Connect content to component props
- Implement page-level behaviors: scroll snap, scroll-driven animations, theme transitions, intersection observers, smooth scroll
- Wire interactive element logic: tab state management, carousel auto-play, modal triggers
- Verify: `npm run build` passes

---

## Stage 5: Fidelity Check

Do NOT declare completion without this.

1. Open the original and your clone at the same viewport widths
2. Compare section by section at **1440px** desktop
3. Compare again at **390px** mobile
4. For each discrepancy: check the blueprint — was extraction correct? Fix at the source.
5. **Test every interactive element:**
   - Click every button — does it do the right thing?
   - Click every tab — does the correct content appear with the right transition?
   - Scroll through carousels — are all slides present?
   - Open every dropdown/accordion
   - Hover over all interactive elements — do effects match?
   - Scroll the page — do scroll-triggered animations fire correctly?
   - Test responsive — does the layout adapt at the right breakpoints?
6. **Asset completeness check** — compare every visible image in the original with your clone. Any missing images are bugs.

---

## Pre-Dispatch Checklist

Before dispatching ANY builder, verify:

- [ ] Blueprint file written with ALL sections filled
- [ ] Every CSS value from `getComputedStyle()`, not estimated
- [ ] Interaction model identified (static / click / scroll / time / swipe)
- [ ] For stateful components: every state's content and styles captured
- [ ] For scroll-driven: trigger, before/after styles, transition recorded
- [ ] For hover: before/after values and timing recorded
- [ ] For tabs: every tab clicked, content per tab extracted
- [ ] For carousels: every slide captured with content and images
- [ ] All images in the section identified (including overlays and layers)
- [ ] Responsive behavior documented for desktop, tablet, and mobile
- [ ] Text content verbatim from site
- [ ] Builder prompt under ~150 lines; if over, split the section
- [ ] All interactive elements documented: buttons (text, href, effect), links, form elements
- [ ] Layout verified via DOM inspection (grid vs flex vs block), not assumed from screenshot
- [ ] Footer section included in topology
- [ ] Language/region version confirmed with user
- [ ] Asset URLs preserved with full query strings for CDN auth tokens

---

## Anti-Patterns

Lessons from failed clones — each one costs hours of rework:

1. **Building click-tabs when the original is scroll-driven.** Determine the interaction model FIRST by scrolling before clicking. This requires a complete rewrite, not a CSS tweak.

2. **Extracting only the default state.** If tabs show "Video Generation API" on load, you must also click "Image Generation API" and "Virtual Try-On API" to extract each state's content and cards.

3. **Missing layered/overlay images.** A background gradient + foreground photo + floating badge = 3 separate assets. Check every container's DOM tree for multiple images.

4. **Building HTML mockups for content that's actually video.** Check if a section uses `<video>`, Lottie, or `<canvas>` before building elaborate HTML replicas.

5. **Approximating CSS.** "It looks like `text-lg`" is wrong if the computed value shows `18px` with `24px` line-height but `text-lg` maps to `28px`. Extract exact values.

6. **Skipping interactive element logic.** A "Learn More →" button that goes nowhere breaks the clone's credibility. Extract every button's href, click handler, and destination.

7. **Forgetting carousel content.** A slider with 8 slides but you only captured the 3 visible ones = broken clone. Scroll/click through ALL slides.

8. **Not triggering lazy-loaded images.** Scroll the entire page FIRST to force all lazy images to load, THEN run asset discovery.

9. **Missing hover/focus effects on navigation.** Navigation links almost always have hover effects. Extract them.

10. **Ignoring dropdown menu contents.** A nav item that opens a mega-menu contains valuable structure and links. Click every nav item.

11. **Giving a builder too much scope.** If the prompt is getting long, the section is too complex for one agent. Break it up.

12. **Referencing docs from builder prompts.** Each builder gets the CSS spec inline — never "see DESIGN_TOKENS.md." Zero external doc reads.

13. **Skipping responsive extraction.** Desktop-only inspection means broken tablet and mobile layouts. Test at 1440, 768, and 390.

14. **Forgetting smooth scroll libraries.** Check for Lenis (`.lenis` class), Locomotive Scroll, or similar. Default browser scrolling feels noticeably different.

15. **Guessing layout from screenshots instead of verifying DOM.** A section that looks like "3 small cards in a row" might actually be "3 full-width stacked cards" or "3 columns with image-on-top." Always extract the DOM hierarchy with `getBoundingClientRect()` and `gridTemplateColumns`/`flexDirection` to confirm the actual layout before building.

16. **Tab extraction with insufficient wait time.** Frameworks like Vue/React use fade transitions (300-500ms). Clicking a tab and extracting after 500ms may capture the old content mid-transition. Wait at least **1200ms** after tab click, and verify the content title changed before extracting. If you see transition classes like `fade-leave-active`, poll until they disappear.

17. **Assuming carousel slides contain images when they contain videos.** Always check for both `<video>` and `<img>` in each slide. A carousel that displays video previews looks like images in a screenshot but requires `<video>` elements with autoplay/loop/muted.

18. **Stripping CDN query params from asset URLs.** Many CDNs (Akamai, CloudFront, custom) embed auth tokens in query strings. Downloading with stripped URLs returns 404. Keep the full URL for downloads; only clean the filename for local storage.

19. **Forgetting the footer.** Always include Footer in the page topology. It typically has multi-column link groups, copyright text, and social icons. Add "Footer extracted" as a mandatory checklist item.

20. **Not confirming language/region version.** International sites often have different layouts per locale (e.g., `klingai.com/dev` in Chinese vs `kling.ai/dev` in English). Check `<html lang="">` and confirm with the user which version to clone before starting.

21. **Relying on external CDN URLs for video/media instead of downloading locally.** External CDN videos often fail due to CORS, auth tokens, or rate limiting. Always download ALL video and media assets to `public/videos/` and `public/images/` using Node.js `fetch` (which bypasses CORS). Reference local paths (`/videos/demo-1.mp4`) in components, not CDN URLs. This ensures the clone works offline and loads reliably. Use this pattern:
    ```javascript
    // Download via Node.js (no CORS restrictions)
    node -e "
    const fs = require('fs');
    fetch(cdnUrl, { headers: { Referer: 'https://target-site.com/' } })
      .then(r => r.arrayBuffer())
      .then(buf => fs.writeFileSync(localPath, Buffer.from(buf)));
    "
    ```

22. **Not adding visible placeholder backgrounds for video containers.** Video elements are invisible until loaded. Add `bg-white/5` or a similar subtle background to video containers so users can see the layout before videos finish loading. A 13MB video takes seconds to buffer — the layout should never look broken during that time.

23. **Using `curl` to download CDN-protected assets.** Many CDNs (Kling, Cloudflare, Akamai) reject `curl` requests even with headers. Always use Node.js `fetch` for asset downloads — it handles redirects, TLS, and encoding more reliably than `curl` for CDN-hosted content.

---

## Experience Accumulation

After completing each clone and receiving user feedback, **update this file** to capture what you learned:

1. **After the fidelity check**, ask the user: "What looks off? What should I prioritize fixing?"
2. **For every piece of feedback**, determine if it reveals a **reusable pattern** (not just a one-off fix). If so, add it to the Anti-Patterns section above or refine an existing stage instruction.
3. **Save the experience** by appending to `docs/research/CLONE_EXPERIENCE.md` with:
   - Date and target URL
   - What went well (keep doing)
   - What went wrong (stop doing)
   - New anti-patterns discovered
   - Time-saving techniques that worked
4. **Before starting the next clone**, read `docs/research/CLONE_EXPERIENCE.md` to avoid repeating past mistakes.

The goal: every clone should be higher quality than the last. Mistakes are inevitable — repeating them is not.

---

## Completion Report

When done, report:
- Total sections built
- Total components created
- Total blueprint files written (should match components)
- Total assets downloaded (images, videos, SVGs, fonts)
- Interactive elements captured (buttons, tabs, carousels, dropdowns, accordions, modals)
- Build status (`npm run build` result)
- Fidelity check results (any remaining discrepancies)
- Known gaps or limitations
