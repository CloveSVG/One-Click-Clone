---
name: showcase
description: "Generate a side-by-side comparison page that renders the original website and its clone on a black background. Perfect for screenshots, social media posts, and visual QA. Provide the original URL and the clone route as arguments."
argument-hint: "<original-url> <clone-route>"
user-invocable: true
---

# Showcase

Generate a visual comparison page that renders **$ARGUMENTS** side by side on a cinematic black background.

Parse `$ARGUMENTS` as two values:
1. **Original URL** — the live website (e.g., `https://kling.ai/dev`)
2. **Clone route** — the local route of the clone (e.g., `/kling-dev`)

If only one argument is provided, assume it's the original URL and look for a matching clone route in `src/app/` by hostname.

## What to Build

Create a page at `src/app/showcase/page.tsx` (overwrite if exists) with:

### Layout
- Full-viewport black background (`#000`)
- Two scaled-down iframes side by side, centered
- Each iframe renders at **1440px native width** then scaled down with `transform: scale()` to fit — NO responsive squishing, the UI stays pixel-perfect at its original proportions
- Scale factor: calculate to fit both frames with a 28px gap within the viewport width, or default to `0.48`

### Header
- Title: "AI Website Clone" in serif font (Georgia), large (~38-42px), white
- Subtitle in italic: "— Side by Side"
- Below: "Original vs AI-generated clone" in muted gray

### Frame Labels
- Centered above each frame
- Plain text, no background color, no badges
- Font: 16px, weight 600, uppercase, letter-spacing 0.14em
- Color: `rgba(255,255,255,0.5)` — neutral for both
- Left: "ORIGINAL"
- Right: "CLONE"

### Frame Styling
- Both frames: identical border (`1px solid rgba(255,255,255,0.1)`), border-radius 12px, subtle shadow
- No colored borders, no glow effects — clean and neutral
- Background: `#111` (visible while iframe loads)

### Footer
- Centered, small pill badge
- Text: "Powered by Clove 深思圈"
- Style: 12px, `rgba(255,255,255,0.25)` text, thin border, rounded pill

### Scaling Implementation

```tsx
const IFRAME_W = 1440;
const IFRAME_H = 1200; // tall enough to show several sections
const SCALE = 0.48;

// Container clips the overflow
<div style={{
  width: IFRAME_W * SCALE,
  height: IFRAME_H * SCALE,
  overflow: "hidden",
  borderRadius: 12,
}}>
  {/* iframe renders at full size then scales down */}
  <iframe
    src={url}
    style={{
      width: IFRAME_W,
      height: IFRAME_H,
      border: "none",
      transform: `scale(${SCALE})`,
      transformOrigin: "top left",
    }}
  />
</div>
```

## Customization Options

If the user provides additional instructions, honor them:
- **Taller/shorter frames**: adjust `IFRAME_H`
- **Different scale**: adjust `SCALE`
- **Custom footer text**: replace "Powered by Clove 深思圈"
- **Custom title**: replace the header text
- **Single frame**: show only the clone for a solo showcase

## After Building

1. Verify `npm run build` passes
2. Tell the user the page is available at `/showcase`
3. Open it in the browser if Chrome MCP is available

## Example Usage

```
/showcase https://kling.ai/dev /kling-dev
/showcase https://stripe.com /stripe-clone
```
