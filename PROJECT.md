# One-Click Clone — AI Website Replication Toolkit

Read the relevant guide in `node_modules/next/dist/docs/` before writing any Next.js code. This version may have breaking changes from what you know.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, React 19, TypeScript strict mode) |
| UI primitives | shadcn/ui — built on Radix, styled with Tailwind v4, composed with `cn()` |
| Icons | Lucide React as the starting set; replaced by extracted SVGs during the cloning process |
| Styling | Tailwind CSS v4 with oklch color tokens for perceptually uniform color manipulation |
| Deployment | Vercel (primary), Docker (containerized alternative) |

---

## Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start the local development server with hot reload |
| `npm run build` | Create an optimized production build |
| `npm run lint` | Run ESLint across the entire codebase |
| `npm run typecheck` | Run the TypeScript compiler in strict mode (no emit) |
| `npm run check` | Sequential pipeline: lint, then typecheck, then build |

---

## Code Conventions

**TypeScript discipline.** Strict mode is non-negotiable. Never use `any` — reach for `unknown`, generics, or explicit types instead. If a type is genuinely unknowable at compile time, add a comment explaining why and use a type assertion with a named interface.

**Naming.** Named exports everywhere (no default exports). PascalCase for components and types. camelCase for functions, variables, and hooks. SCREAMING_SNAKE for true constants.

**Styling.** Tailwind utility classes only. No inline `style` attributes. No CSS modules. No global CSS beyond the Tailwind base layer. Use `cn()` from `lib/utils.ts` for conditional class merging — never string concatenation.

**Formatting.** Two-space indentation. Single quotes in all JS/TS files. Trailing commas in multi-line structures. No semicolons only if the project eslint config enforces it; otherwise keep them.

**Responsive approach.** Mobile-first. Start with the smallest viewport and layer on `sm:`, `md:`, `lg:`, `xl:` modifiers. Every layout must be usable at 320px wide.

---

## Project Layout

```
src/
  app/                # Next.js App Router — pages, layouts, loading/error boundaries
  components/         # All React components
    ui/               # shadcn/ui primitives (Button, Dialog, Input, etc.)
    icons.tsx          # SVG icons extracted directly from target sites as React components
  lib/
    utils.ts           # cn() helper and other shared pure utilities
  types/              # TypeScript type definitions and interfaces
  hooks/              # Custom React hooks (useMediaQuery, useScrollLock, etc.)
public/
  images/             # Raster and vector images extracted from target sites
  videos/             # Video assets pulled from target sites
  fonts/              # Self-hosted web fonts (WOFF2 preferred)
  seo/                # Favicons, OG images, apple-touch-icon, webmanifest
docs/
  research/           # Extraction artifacts — tokens, component catalogs, behaviors
  design-references/  # Screenshots and annotated visual references
scripts/              # Build tooling, asset downloaders, platform sync scripts
```

---

## Design Philosophy

**Pixel-perfect replication comes first.** During the cloning phase, the goal is an indistinguishable copy. Match the target's spacing, colors, font sizing, and layout down to the subpixel level. Use computed styles from DevTools as the source of truth, not eyeballing.

**No creative liberty during replication.** Resist the urge to "improve" anything. If the target has a 13px font size that feels odd, replicate the 13px font size. Customization is a separate phase that happens after the clone is verified.

**Real content, always.** Extract actual text, images, and media from the target site. Never use "Lorem ipsum," placeholder images, or generic copy. The clone should be visually identical when placed side-by-side with the original.

**Every pixel matters.** This is a beauty-first operation. If a shadow is 1px off or an animation easing curve doesn't match, it's a bug. Treat visual fidelity with the same rigor as functional correctness.

---

## Agent Coordination

**Isolation via worktrees.** Every builder agent operates in its own git worktree on a dedicated branch. This prevents merge conflicts during parallel work and gives each agent a clean filesystem.

**Orchestrator merges everything.** The coordinating agent has full context — goals, assignments, progress, and desired outcomes. It merges all worktree branches into the target branch, resolving conflicts intelligently rather than mechanically.

**Platform config sync.** After editing this file (`PROJECT.md`), regenerate platform-specific instruction files:

```bash
bash scripts/sync-platforms.sh
```

**Skill definition sync.** After editing `.claude/skills/site-clone/SKILL.md`, regenerate the command definitions for all platforms:

```bash
node scripts/sync-commands.mjs
```

---

## Extraction Reference

For the complete methodology on how to inspect, deconstruct, and document any target website, see:

@docs/research/EXTRACTION_PLAYBOOK.md
