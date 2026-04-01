# Extraction Playbook

A systematic methodology for reverse-engineering any website into a reproducible set of design tokens, component blueprints, layout maps, and technical profiles. Follow these phases in order — each one builds on the artifacts from the previous.

---

## Phase 1: Visual Capture

The goal is a complete photographic record of every visual state the site can be in. This becomes the reference material that all subsequent phases draw from.

### Page-Level Screenshots

Capture every distinct page at three canonical widths:

| Viewport | Width | Represents |
|----------|-------|------------|
| Desktop | 1440px | Large monitors, default browsing |
| Tablet | 768px | iPad portrait, small laptops |
| Mobile | 390px | iPhone 14/15 standard width |

For each page, capture both the full-page scroll (stitched screenshot) and the above-the-fold initial view.

### Mode Variants

- **Light mode** — the default or light appearance
- **Dark mode** — if the site supports a dark theme, capture every page in both modes
- If the site has additional themes (high contrast, branded variants), capture those too

### Interaction States

These are the states that only appear in response to user action:

- **Hover states** — buttons, links, cards, navigation items, interactive icons
- **Active/pressed states** — buttons during click, toggle switches mid-transition
- **Expanded menus** — dropdown navigation, hamburger menus, mega-menus fully open
- **Open modals and dialogs** — every modal the site uses, including confirmation dialogs
- **Open drawers and sheets** — slide-out panels, bottom sheets on mobile
- **Focused inputs** — text fields, search bars, textareas with the focus ring visible
- **Filled form states** — forms with validation errors, success messages, inline hints
- **Tooltip and popover states** — hover-triggered or click-triggered info overlays

### Edge-Case States

- **Loading/skeleton states** — how the page looks before content loads (throttle network to capture these)
- **Empty states** — pages or sections with no data (search with no results, empty cart, blank feed)
- **Error states** — 404 pages, failed API calls, network errors, form validation failures
- **Pagination boundaries** — first page, middle page, last page (if applicable)

Save all screenshots to `docs/design-references/` with a clear naming convention: `{page}-{viewport}-{variant}-{state}.png`.

---

## Phase 2: Design Token Extraction

Extract every visual primitive into a structured token set. Use computed styles from Chrome DevTools, not inferred values.

### Colors

| Token Category | What to Extract |
|----------------|-----------------|
| Backgrounds | Page bg, card bg, sidebar bg, modal bg, input bg, hover bg, selected bg |
| Text | Primary text, secondary text, muted/placeholder text, inverse text (on dark bg) |
| Accent | Primary brand color, secondary accent, link color, link hover color |
| Borders | Default border, subtle border, focus ring, divider lines |
| Semantic | Error/destructive red, success green, warning amber, info blue |
| Interactive | Button primary bg/text/hover, button secondary bg/text/hover, ghost hover bg |
| Overlay | Modal backdrop, tooltip bg, popover bg, dropdown bg |

Record every color as both its oklch value and hex fallback. Note which colors change between light and dark mode.

### Typography

| Property | What to Capture |
|----------|-----------------|
| Font families | Primary (headings), secondary (body), monospace (code). Note the exact font name and weight files used. |
| Size scale | h1 through h6, body large, body default, body small, caption, label, overline. Record in px and rem. |
| Font weights | Every weight actually used (300, 400, 500, 600, 700, etc.) |
| Line heights | Corresponding line height for each size in the scale |
| Letter spacing | Especially for headings, uppercase labels, and small text |
| Font features | Tabular numbers, ligatures, or other OpenType features in use |

### Spacing

Identify the spacing scale the site uses. Most well-designed sites follow a consistent rhythm:

```
4px → 8px → 12px → 16px → 20px → 24px → 32px → 40px → 48px → 64px → 80px → 96px → 128px
```

Document padding and margin patterns for: page containers, section spacing, card internal padding, form field gaps, navigation item spacing, grid gutters.

### Border Radius

| Element | Typical Values to Capture |
|---------|---------------------------|
| Buttons | Small, default, large, pill/full |
| Cards | Outer radius and any inner element radius |
| Avatars | Usually full circle or slightly rounded square |
| Inputs | Text fields, selects, textareas |
| Modals/dialogs | Outer container radius |
| Badges and chips | Usually pill-shaped |
| Images | Rounded corners on thumbnails or hero images |

### Shadows and Elevation

| Level | Usage |
|-------|-------|
| Subtle | Cards at rest, input fields |
| Medium | Dropdown menus, popovers |
| Heavy | Modals, floating action buttons |
| Focus ring | Keyboard focus indicators (usually an outline or ring shadow) |
| Inset | Pressed button states, recessed inputs |

Record the full `box-shadow` value including color, offset, blur, and spread.

### Breakpoints

Open the responsive inspector and slowly drag the viewport width. Document every width where the layout shifts:

- Navigation collapse point (hamburger menu appears)
- Sidebar hide/show point
- Grid column count changes (3 → 2 → 1, etc.)
- Font size scale changes
- Content reflow points (horizontal → stacked)

### Icons

- Identify the icon library: Lucide, Heroicons, Phosphor, Feather, Material Symbols, Font Awesome, or custom SVGs
- Note icon sizes used (typically 16px, 20px, 24px, 32px)
- For custom SVGs, extract the raw SVG markup from the DOM
- Document stroke width if the icons are stroke-based

### Motion Tokens

| Property | What to Record |
|----------|----------------|
| Transition durations | Typically 100ms, 150ms, 200ms, 300ms, 500ms |
| Easing functions | `ease`, `ease-in-out`, cubic-bezier values |
| Animation keyframes | Entrance (fade-in, slide-up), exit (fade-out, slide-down), loading (pulse, spin) |
| Reduced motion | Does the site respect `prefers-reduced-motion`? |

---

## Phase 3: Component Catalog

Systematically inventory every reusable UI element on the site. For each component, document:

### Per-Component Record

1. **Name** — A clear, semantic name (e.g., "PricingCard" not "Card2")
2. **Structure** — The DOM hierarchy. What HTML elements are used? What child components does it contain? Is it a composite of simpler primitives?
3. **Variants** — Visual variations: size (sm/md/lg), color (primary/secondary/ghost/destructive), density (compact/comfortable)
4. **States** — Every visual state the component can be in:
   - Default (at rest)
   - Hover (mouse over)
   - Active/pressed (during click)
   - Focused (keyboard navigation)
   - Disabled (non-interactive)
   - Loading (spinner or skeleton replacement)
   - Error (validation failure, destructive state)
   - Empty (no content to display)
   - Selected/active (in a group, this one is chosen)
5. **Responsive behavior** — Does the component change layout, size, or visibility at different breakpoints? Does it get replaced by a different component on mobile?
6. **Interactions** — Click handlers, hover effects, focus traps, keyboard shortcuts, drag-and-drop, long press
7. **Animations** — Entrance/exit transitions, micro-interactions (button press scale, checkbox check animation), scroll-triggered reveals

### Component Checklist

Work through this list and check off every component the target site uses:

**Navigation**
- [ ] Top navigation bar (logo, links, actions)
- [ ] Mobile navigation drawer / hamburger menu
- [ ] Sidebar navigation (if applicable)
- [ ] Breadcrumb trail
- [ ] Footer navigation
- [ ] Pagination controls

**Content Containers**
- [ ] Content cards (blog post, product, feature highlight)
- [ ] Pricing cards or tier comparison
- [ ] Testimonial cards or quote blocks
- [ ] Feature cards with icons
- [ ] Stat/metric cards
- [ ] Image gallery or media grid

**Actions**
- [ ] Primary button (filled, prominent)
- [ ] Secondary button (outlined or muted)
- [ ] Ghost/text button (minimal, link-like)
- [ ] Icon-only button (close, menu, settings)
- [ ] Destructive/danger button
- [ ] Call-to-action blocks (hero CTA, inline CTA, sticky CTA)
- [ ] Link styles (inline text links, standalone links)

**Forms and Inputs**
- [ ] Text input (single line)
- [ ] Textarea (multi-line)
- [ ] Select / dropdown
- [ ] Checkbox and checkbox groups
- [ ] Radio button groups
- [ ] Toggle / switch
- [ ] Slider / range input
- [ ] File upload area
- [ ] Search input (with icon, clear button)
- [ ] Date picker (if present)
- [ ] Form validation messages (inline errors, success indicators)

**Overlays and Surfaces**
- [ ] Modal dialog (centered overlay)
- [ ] Sheet / drawer (slide from edge)
- [ ] Dropdown menu
- [ ] Popover (click-triggered floating content)
- [ ] Context menu (right-click)
- [ ] Command palette / search modal

**Feedback and Status**
- [ ] Toast notification (success, error, info, warning)
- [ ] Alert / banner (persistent, dismissible)
- [ ] Tooltip (hover-triggered text hint)
- [ ] Badge / pill (counts, status labels)
- [ ] Progress bar (determinate, indeterminate)
- [ ] Step indicator / stepper
- [ ] Loading spinner
- [ ] Skeleton placeholder

**Data Display**
- [ ] Data table (sortable, filterable)
- [ ] List items (simple, with actions, with avatars)
- [ ] Accordion / collapsible sections
- [ ] Tabs / segmented control
- [ ] Carousel / slider
- [ ] Avatar (image, initials, fallback)
- [ ] Status indicator (online/offline dot, activity ring)
- [ ] Tag / chip (removable, selectable)
- [ ] Code block (syntax highlighted)
- [ ] Key-value pairs / definition list

---

## Phase 4: Layout Deconstruction

Understand how the page is spatially organized at every breakpoint.

### Grid System

Determine the primary layout strategy:

- **CSS Grid** — Look for `display: grid` on containers. Document `grid-template-columns`, `grid-template-rows`, `gap` values, and any named grid areas.
- **Flexbox** — Look for `display: flex` on containers. Document `flex-direction`, `gap`, `justify-content`, `align-items` patterns.
- **Hybrid** — Many sites use Grid for the page shell and Flexbox for component internals. Document both layers.

### Column Structure Per Breakpoint

| Breakpoint | Columns | Gutter | Container Max-Width | Side Padding |
|------------|---------|--------|---------------------|--------------|
| Mobile (< 640px) | ? | ? | ? | ? |
| Tablet (640-1024px) | ? | ? | ? | ? |
| Desktop (1024-1280px) | ? | ? | ? | ? |
| Wide (> 1280px) | ? | ? | ? | ? |

### Sticky and Fixed Elements

Identify every element that doesn't scroll with the page:

- **Fixed header** — Does it shrink on scroll? Does it hide on scroll-down and reappear on scroll-up?
- **Sticky sidebar** — Does it scroll to a point and then stick?
- **Floating action button** — Fixed position in a corner, usually mobile
- **Scroll-to-top button** — Appears after scrolling past a threshold
- **Cookie consent banner** — Fixed to bottom, dismissible
- **Announcement bar** — Fixed to top, above the main header

### Z-Index Architecture

Map the stacking layers from bottom to top:

```
z-0   — Base content (paragraphs, images, cards)
z-10  — Raised content (sticky sidebar sections, floating labels)
z-20  — Sticky header / navigation bar
z-30  — Dropdown menus, popovers, tooltips
z-40  — Drawer / sheet overlays
z-50  — Modal backdrop and dialog
z-60  — Toast notifications
z-70  — Command palette / global search overlay
```

Adjust the specific values based on what the target site actually uses.

### Scroll Mechanics

- **Native scroll** — Default browser scrolling with no custom behavior
- **Smooth scroll** — `scroll-behavior: smooth` on the document or a scroll library
- **Scroll snapping** — `scroll-snap-type` on carousels or full-page sections
- **Scroll libraries** — Lenis, Locomotive Scroll, or custom smooth-scroll implementations
- **Virtual scrolling** — For long lists, check for windowing libraries (TanStack Virtual, react-window)
- **Parallax** — Elements that scroll at different rates than the page
- **Scroll-triggered animations** — Intersection Observer, scroll-timeline, or GSAP ScrollTrigger

---

## Phase 5: Technical Fingerprinting

Determine what technologies the target site is built with. This informs our implementation strategy.

### Framework Detection

Check for telltale markers in the DOM and global scope:

| Framework | How to Detect |
|-----------|---------------|
| Next.js | `__NEXT_DATA__` script tag, `/_next/` asset paths |
| Nuxt | `__NUXT__` global, `/_nuxt/` asset paths |
| Angular | `ng-version` attribute on root element |
| Svelte | `__svelte` markers in the DOM, `.svelte` in source maps |
| Remix | `__remix` context, `data-remix` attributes |
| Astro | `astro-island` custom elements |
| Gatsby | `___gatsby` root div, `/static/` asset pattern |
| WordPress | `wp-content/` in asset paths, `wp-json` REST API |
| Plain React | `_reactRootContainer` on the root div, no framework-specific patterns |

### CSS Strategy

| Approach | Detection Method |
|----------|------------------|
| Tailwind CSS | Scan class attributes for utility patterns: `flex`, `px-4`, `text-sm`, `bg-blue-500` |
| CSS-in-JS (styled-components) | Classes like `sc-` prefix, `<style>` tags injected in `<head>` |
| CSS-in-JS (Emotion) | Classes with `css-` prefix, `data-emotion` attributes |
| CSS Modules | Classes with hash suffixes like `_component_a1b2c` |
| Vanilla CSS / SCSS | Standard class names, `<link>` to `.css` files |
| UnoCSS / Windi | Similar to Tailwind but with different utility naming |

### State Management

- Open React DevTools and check for Provider components: Redux (`<Provider store=`), React Query (`<QueryClientProvider>`), Zustand stores
- Check the network tab for API call patterns that reveal the data layer
- Look for `__APOLLO_STATE__` (Apollo GraphQL), `__REACT_QUERY_STATE__` (React Query SSR)

### API Layer

| Pattern | Detection |
|---------|-----------|
| REST | Standard HTTP endpoints in network tab (`/api/users`, `/api/posts`) |
| GraphQL | Requests to `/graphql` endpoint with query bodies |
| tRPC | Requests to `/api/trpc/` endpoints |
| WebSocket | `ws://` or `wss://` connections in the network tab |

### Font Loading

- **Google Fonts** — `fonts.googleapis.com` or `fonts.gstatic.com` in network requests
- **Adobe Fonts (Typekit)** — `use.typekit.net` in network requests
- **Self-hosted** — Font files loaded from the same domain, usually WOFF2 format
- **System stack** — No web font loading at all; uses `-apple-system, BlinkMacSystemFont, ...`

Record the exact font names, weights loaded, and display strategy (`font-display: swap`, `optional`, etc.).

### Image Pipeline

- **CDN** — Are images served from a different domain (Cloudinary, Imgix, Vercel Image Optimization)?
- **Lazy loading** — `loading="lazy"` attribute, Intersection Observer, or library-based
- **Responsive images** — `srcset` and `sizes` attributes, `<picture>` elements
- **Modern formats** — WebP, AVIF with fallbacks
- **Blur placeholders** — Base64 blurDataURL, LQIP (Low Quality Image Placeholder), dominant color
- **Next.js Image** — `<Image>` component usage with automatic optimization

### Animation Stack

| Library | Detection |
|---------|-----------|
| Framer Motion | `data-framer-*` attributes, `motion.div` patterns in source |
| GSAP | `gsap` in global scope, ScrollTrigger plugin |
| CSS transitions only | No animation library, just `transition` properties |
| Web Animations API | `element.animate()` calls in source |
| Lottie | `<lottie-player>` elements or `lottie-web` imports |
| Rive | `.riv` file requests, `@rive-app` imports |
| Three.js / WebGL | `<canvas>` elements with WebGL context |

---

## Phase 6: Artifacts Output

After completing all five extraction phases, compile the findings into these structured documents inside `docs/research/`:

### 1. `DESIGN_TOKENS.md`

The complete token set: every color (with oklch and hex), the full typography scale, spacing rhythm, border radii, shadow definitions, and motion tokens. Organized so a developer can translate it directly into Tailwind theme configuration.

### 2. `COMPONENT_CATALOG.md`

Every component from Phase 3, documented with its name, DOM structure sketch, variant list, state inventory, responsive notes, and interaction description. Group components by category (navigation, content, actions, forms, overlays, feedback, data display).

### 3. `LAYOUT_MAP.md`

Page-by-page layout documentation. For each page: the grid structure, column counts at each breakpoint, container widths, section ordering, and any unique layout patterns. Include a section-level wireframe description.

### 4. `BEHAVIORS.md`

All dynamic behavior: CSS transitions with exact durations and easing, JavaScript-driven animations, scroll-triggered effects, hover/focus micro-interactions, page transition animations, and loading state transitions.

### 5. `TOPOLOGY.md`

The spatial architecture of the site: z-index layer map, sticky element inventory, fixed-position elements, scroll behavior configuration, viewport-dependent visibility rules, and the logical section ordering of each page.

### 6. `TECH_FINGERPRINT.md`

Everything from Phase 5: detected framework, CSS strategy, state management approach, API patterns, font loading method, image optimization pipeline, and animation libraries. Include our chosen equivalents for each detected technology (e.g., "Target uses Vue 3 with Pinia → We replicate with React 19 + Zustand").
