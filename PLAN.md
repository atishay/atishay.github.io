# Colorful Theme — Revised Plan v2

## What went wrong last time

1. **Fraunces variable font was removed** — it didn't render well at scale, looked wrong at small sizes, distracting. Stick to system fonts.
2. **Font-size changes broke layouts** — 17px/15px didn't fit the tight CSS grid on cards, timelines, etc. Keep 14px base.
3. **Not colorful enough** — glass panels were too transparent (0.5-0.7), blobs too faint (0.08-0.10), gradients barely visible. Need bolder colors.
4. **SCSS mangling** — sed commands broke the file structure. Avoid complex sed; write files cleanly.
5. **Blank page** — the body `max-height: 100vh` from global.scss was fighting scroll-snap. Need to override cleanly.

## Architecture

- **Single SCSS file**: `themes/eclectic/assets/scss/colorful.scss`
- **Import**: at end of `main.scss`
- **Scope**: all styles under `html.colorful { }` — zero impact on legacy
- **No font changes**: keep system fonts, keep 14px body
- **No HTML changes**: CSS-only. The toggle checkbox in header is the only HTML addition.
- **No new Hugo pipeline**: uses existing SCSS compilation

## What we KEEP from the original site (no changes)

- All 14 homepage sections and their existing type classes
- Complete typography hierarchy (font-family, sizes, weights, line-heights)
- All card layouts, grid structures, flexbox arrangements
- The book open animation (Authoring section)
- The scroll indicator bar
- Color picker and dark mode toggle
- Video popups, pagination, search, breadcrumbs
- All images, icons, SVGs
- All existing @keyframes (bounceInLeft, fade-up-item, etc.)
- Footer, header structure

## Color System

JS on page load computes HSL from the current theme color and stores:
```
--theme-h, --theme-s, --theme-l
--hue-analogous-1 (h+25), --hue-analogous-2 (h-20)
--hue-complement (h+180)
--hue-split-1 (h+150), --hue-split-2 (h-150)
--hue-triadic-1 (h+120), --hue-triadic-2 (h-120)
```

All colors derived from these via `hsl(var(--theme-h), ...)` in CSS — no JS needed for derivatives.

**Universal palette variables** (set once in html.colorful, used everywhere):
```css
--c-surface:    hsl(var(--theme-h), 35%, 97%);     /* very light tint */
--c-subtle:     hsl(var(--theme-h), 40%, 90%);     /* soft background */
--c-muted:      hsl(var(--theme-h), 42%, 72%);     /* medium accent */
--c-bold:       hsl(var(--theme-h), var(--theme-s), var(--theme-l));  /* the theme color */
--c-strong:     hsl(var(--theme-h), var(--theme-s), calc(var(--theme-l) * 0.6));
--c-deep:       hsl(var(--theme-h), 70%, 28%);
--c-analogous:  hsl(var(--hue-analogous-1), 85%, 52%);
--c-complement: hsl(var(--hue-complement), 82%, 50%);
--c-triadic-1:  hsl(var(--hue-triadic-1), 82%, 48%);
--c-triadic-2:  hsl(var(--hue-triadic-2), 82%, 48%);
```

**Gradient variables:**
```css
--g-accent:    linear-gradient(135deg, var(--c-bold), var(--c-analogous));
--g-contrast:  linear-gradient(135deg, var(--c-bold), var(--c-complement));
--g-split:     linear-gradient(135deg, var(--c-triadic-1), var(--c-triadic-2));
--g-surface:   linear-gradient(135deg, var(--c-surface), var(--c-subtle));
--g-cool:      linear-gradient(135deg, #667eea, #764ba2);
--g-warm:      linear-gradient(135deg, #f093fb, #f5576c);
--g-sunset:    linear-gradient(135deg, #fa709a, #fee140);
--g-ocean:     linear-gradient(135deg, #4facfe, #00f2fe);
```

## Section Backgrounds — The Foundation of "Colorful"

Every `.meta` on the homepage gets a **distinct background treatment**:

| Section (by nth-child) | Background | Accent |
|---|---|---|
| 1 (About) | `--g-accent` gradient mesh + dot-grid overlay | Mesh hero with `gradient-wander` animation |
| 2 (Authoring) | `--c-surface` solid | Diagonal stripe divider from prev |
| 3 (Speaking) | `--c-subtle` solid + dot-grid | `skewY` divider |
| 4 (Experience) | White | `--g-surface` gradient lightly layered |
| 5 (Internships) | `--c-surface` + dot-grid | `skewY` divider |
| 6 (Patents) | White | None |
| 7 (Publications) | `--c-subtle` + dot-grid | `skewY` divider |
| 8 (Education) | White | None |
| 9 (Awards) | `--c-surface` + dot-grid | `skewY` divider |
| 10 (Projects) | White | Filter bar is sticky with glass |
| 11 (Blog) | `--c-subtle` + dot-grid | None |
| 12 (Proficiency) | White | None |
| 13 (Testimonial) | `--c-surface` + dot-grid | None |
| 14 (Contact) | Full-bleed photo with gradient overlay | Glass CTA |

Implementation: use `body.home .meta:nth-of-type(N) { background: ... }` selectors. Each section is uniquely identifiable by its position.

## Card / Panel Treatments

Every card, item, blog-post gets:

1. **Rounded corners**: `border-radius: 12px`
2. **Gentle shadow**: `box-shadow: 0 1px 8px rgba(0,0,0,0.06)`
3. **Colored border accent**: each card gets a left/top border stripe in a rotating color from the palette
4. **Hover lift**: `transform: translateY(-3px)` + deeper shadow
5. **Glass on select sections**: `backdrop-filter: blur(12px)` with `background: rgba(255,255,255,0.75)` on speaking, blog, testimonials

**Border accent rotation** — different sections use different colors:

| Section | Border color |
|---|---|
| About | `--c-bold` left stripe |
| Experience | `--c-analogous` left stripe |
| Internships | `--c-complement` left stripe |
| Patents | `--c-triadic-1` top stripe |
| Awards | Rotating: each card gets different hue |
| Projects | `--c-complement` pill for active filter |
| Speaking | `--c-analogous` left stripe |
| Blog posts | `--c-bold` bottom stripe |
| Testimonials | none (blob avatar instead) |

## Shapes and Patterns

**Non-rectangular elements:**

1. **Section dividers**: `::before` pseudo-element on `.meta` with `skewY(-2deg)` creating diagonal transition to next section. Alternates direction on even sections.

2. **Hero portrait**: About section photo gets `border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%` — organic blob shape with slow `blob-rotate` animation.

3. **Filter pills**: Project filter buttons become `border-radius: 999px` with gradient fill when active.

4. **Decorative blobs**: Each section gets a large `::after` pseudo-element with asymmetric `border-radius` and gradient background at low opacity (z-index below content). Position alternates — top-right on odd sections, bottom-left on even. Slow `float-slow` animation.

5. **Hero mesh gradient**: About section gets a `::before` or dedicated child element with layered `radial-gradient(ellipse ...)` in complementary hues, animated with `gradient-wander`.

**Background patterns:**
- Dot-grid: `radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px); background-size: 20px 20px;`
- Applied to alternating sections (odd = with dots, even = clean)

## Glassmorphism (where it makes sense)

Apply `backdrop-filter: blur(12-16px)` + semi-transparent background to:

1. **Header** — `background: rgba(255,255,255,0.85); backdrop-filter: blur(16px);`
2. **Blog post aside/sidebar** — `background: rgba(255,255,255,0.7); backdrop-filter: blur(12px);`
3. **Speaking cards** — each talk card gets glass
4. **Blog index cards** — glass with colored border stripe
5. **Testimonial quote panels** — glass with decorative quote mark
6. **Contact CTA button** — glass pill
7. **Filter bar (projects)** — sticky glass bar

## Scroll Behavior

- **Homepage**: `scroll-snap-type: y mandatory` on `body.home`, `scroll-snap-align: start` on `.meta`, `min-height: 100dvh`
- **Override conflict**: global.scss sets `body { max-height: 100vh; ... }`. We override with `max-height: none !important;` inside `html.colorful body.home`
- **Scroll-driven entrance**: `view-timeline` progressive enhancement, IntersectionObserver fallback sets `.visible` class on `.meta` sections

## Animations

**New @keyframes (4 total, minimal):**

```
float-slow: translateY(-8px) rotation 12s    — decorative blobs
blob-rotate: asymmetric border-radius morph 20s — hero portrait, testimonial avatars
gradient-wander: background-position shift 25s  — hero mesh gradient
glow-pulse: opacity+filter-brightness 4s       — accent highlights
```

**Applied to:**
- Hero mesh background → `gradient-wander`
- Hero portrait → `blob-rotate`
- Decorative blobs per section → `blob-rotate` + `float-slow` (staggered delays)
- Testimonial avatars → `blob-rotate`
- Section headers (subtle hovering) → `float-slow` on heading icons
- No element that contains text animates — only decorative/purely-visual elements

## Deep Text — Progressive Disclosure

For sections with long text (About bio, Experience descriptions, Patent abstracts):

- Wrap long content in `<div class="expandable">` (in the Hugo template or via JS)
- Default: show first ~3 lines via `-webkit-line-clamp: 3`
- Click "… more" → reveals full text
- CSS: `max-height: 0; overflow: hidden; transition: max-height 0.4s` → `max-height: 2000px`
- Uses `transition-behavior: allow-discrete` for smooth open/close

## Files Changed

### 1. `themes/eclectic/assets/scss/colorful.scss` (new, ~350 lines)
Complete CSS file. No font changes. Color-first approach.

### 2. `themes/eclectic/assets/scss/main.scss` (+1 line)
`@import "colorful.scss";`

### 3. `themes/eclectic/layouts/partials/header-raw.html` (+7 lines)
Colorful checkbox toggle inside `#color-picker` dropdown.

### 4. `themes/eclectic/layouts/partials/core/resources.html` (+3 lines)
Early script: restore `colorful` class from localStorage.

### 5. `themes/eclectic/assets/js/main.js` (+80 lines)
HSL converter, MutationObserver for color changes, colorful toggle listener, IntersectionObserver entrance fallback.

## Implementation Strategy

**Phase 1: Foundation (~50 lines)**
- HSL variables, palette, gradients
- Section background tinting
- Dot-grid pattern
- Body layout fixes (max-height, scroll-snap)

**Phase 2: Shapes & Cards (~100 lines)**
- Section dividers (skewY)
- Card treatments (border-radius, shadow, hover lift, border accent)
- Hero portrait blob shape
- Filter pill styling

**Phase 3: Glass & Decorations (~80 lines)**
- Glass panels on sidebar, speaking cards, blog cards, header
- Decorative blobs (::after)
- Hero mesh gradient

**Phase 4: Scroll & Animation (~60 lines)**
- scroll-snap, view-timeline entrance
- @keyframes definitions
- Dark mode overrides
- Reduced motion

**Phase 5: JS & Toggle (~100 lines across 3 files)**
- HSL computation + MutationObserver
- Colorful toggle with localStorage
- IntersectionObserver fallback

**Phase 6: Deep Text & Polish (~60 lines)**
- Expandable mechanism
- Section-specific border accents
- Testimonial quote marks
- Contact CTA

## CSS Features Used

| Feature | Where |
|---|---|
| `hsl()` with custom properties | Entire color system |
| `backdrop-filter: blur()` | Glass panels (header, sidebar, cards) |
| `skewY()` on `::before` | Section dividers |
| `clip-path: polygon()` | Angled card bottoms (blog, projects) |
| `border-radius` asymmetry (40% 60%...) | Blob shapes, portrait, avatars |
| `radial-gradient` patterns | Dot-grid, hero mesh |
| `scroll-snap-type: y mandatory` | Homepage full-window |
| `view-timeline` / `animation-timeline` | Scroll-driven entrance (progressive) |
| `@supports (animation-timeline: view())` | Feature detection |
| `max-height` transition + `line-clamp` | Deep text expand |
| `prefers-reduced-motion` | Accessibility |
| `dvh` units | Viewport sections |

## Responsive Behavior

- Everything in `html.colorful` inherits existing responsive breakpoints
- Scroll-snap happens on all viewports (works on mobile too)
- `min-height: 100dvh` auto-adjusts for mobile address bars (dvh vs vh)
- Cards collapse to single column at their natural breakpoints (existing grid)
- Glass + backdrop-filter works on mobile (iOS Safari 9+, Chrome Android)

## Dark Mode

All glass panels, section backgrounds, gradients get dark variants:
- Light `--c-surface` hsl(... ,97%) → Dark `hsl(... ,10%)`
- Light `--c-subtle` hsl(... ,90%) → Dark `hsl(... ,14%)`
- `backdrop-filter` panels get dark background with lower border opacity
- Dot-grid uses `rgba(255,255,255,0.04)` instead of `rgba(0,0,0,0.05)`

## Success Criteria

After implementation, the `html.colorful` site should:

1. **Be visibly colorful** — each section has a distinct background tint, cards have colored accents, gradients are VISIBLE
2. **Feel roomy** — full-viewport scroll-snap, generous padding, breathing room
3. **Maintain all functionality** — links work, color picker works, dark mode works, search works, book animation works
4. **Zero regressions** — toggling `colorful` off gives exact original site
5. **Build clean** — no SCSS errors, no JS minification errors
6. **Keep original typography** — no font changes, no size changes that break layouts
7. **Use real colors** — hsl-derived, hue-rotated, vibrant, varied across sections
