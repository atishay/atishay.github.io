# Site Enhancement Task List

Incremental improvements to the existing site. Remove boring. Add flair.
One small change at a time. No theme toggle — just make the real site better.

---

## FOUNDATION: HSL Color System (Task 1)

Before any color work, compute and expose HSL values from the theme color.

**main.js** — `hexToHsl()` function, called on page load + MutationObserver on `style` attr:
```js
// Sets on :root: --h, --s, --l, --ha1 (h+30), --ha2 (h-25),
// --hc (h+180), --ht1 (h+120), --ht2 (h-120)
```

Now all CSS can use:
```css
color: hsl(var(--h), var(--s), var(--l));
background: hsl(var(--ha1), 60%, 55%);    /* analogous accent */
border-color: hsl(var(--hc), 70%, 50%);   /* complement pop */
```

---

## HERO SECTION (Tasks 2-11) — Make it pop 10x

### Task 2: Full-viewport hero
```css
body.home .meta:first-child {
  min-height: 100dvh;
  display: flex; align-items: center;
}
```
The about section fills the screen on desktop. Photo + text vertically centered.

### Task 3: Animated mesh gradient behind hero
Two large radial-gradient ellipses in complementary hues, slowly breathing:
```css
.meta.left-image {
  position: relative; overflow: hidden;
  &::before {
    content: ""; position: absolute; inset: 0; z-index: -1;
    background:
      radial-gradient(ellipse 80% 60% at 20% 40%, hsl(var(--h), 40%, 92%), transparent),
      radial-gradient(ellipse 60% 80% at 75% 60%, hsl(var(--hc), 30%, 88%), transparent);
    animation: mesh-breathe 20s ease-in-out infinite;
  }
}
@keyframes mesh-breathe {
  0%,100%{opacity:.8;filter:hue-rotate(0deg)}
  50%{opacity:1;filter:hue-rotate(6deg)}
}
```

### Task 4: Blob portrait with morphing border-radius
```css
.meta.left-image img {
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  animation: blob-morph 18s ease-in-out infinite;
}
@keyframes blob-morph {
  0%,100%{border-radius:30% 70% 70% 30%/30% 30% 70% 70%}
  50%{border-radius:60% 40% 40% 60%/50% 60% 30% 70%}
}
```

### Task 5: Gradient name/title — text-fill with animated gradient
```css
.meta.left-image h1 {
  background: linear-gradient(135deg,
    hsl(var(--h),90%,55%),
    hsl(var(--ha1),85%,50%),
    hsl(var(--ht1),80%,55%));
  background-size: 200% 200%;
  background-clip: text; -webkit-text-fill-color: transparent;
  animation: gradient-shift 4s ease infinite;
}
@keyframes gradient-shift {
  0%,100%{background-position:0% 50%}
  50%{background-position:100% 50%}
}
```

### Task 6: Typewriter subtitle with animated caret
The subtitle already reads: "Thinker | Tinkerer | Inventor | ..." — animate it typing out:
```css
.meta.left-image .subtitle {
  overflow: hidden; white-space: nowrap;
  border-right: 2px solid hsl(var(--h), var(--s), var(--l));
  width: 0;
  animation: typing 2s steps(80) 0.5s forwards,
             blink 0.7s step-end infinite;
  color: hsl(var(--h), 30%, 40%);
}
```
(JS ensures it starts only when section scrolls into view.)

### Task 7: Developer SVG floating behind hero
Create a small inline SVG — terminal window, code brackets, lamp, glowing bulb. Same vibe as the existing `profile.svg` but smaller and simpler (~1KB). Position behind text at 6-8% opacity:
```css
.meta.left-image .hero-svg {
  position: absolute; right: 8%; bottom: 15%;
  width: max(200px, 20vw); opacity: 0.07; z-index: 0;
  animation: float-slow 15s ease-in-out infinite;
  pointer-events: none;
}
```

### Task 8: Scattered icon constellation in hero
4-5 Line Awesome icons (code, lightbulb, rocket, book, gear) positioned around the hero at 4-6% opacity, gently floating at different speeds:
```css
.hero-icon { position: absolute; opacity: 0.05; pointer-events: none; z-index: 0; }
.hero-icon:nth-child(1) { top: 10%; left: 5%; animation: float-slow 10s -0s infinite; }
.hero-icon:nth-child(2) { top: 20%; right: 10%; animation: float-slow 12s -3s infinite; }
.hero-icon:nth-child(3) { bottom: 15%; left: 15%; animation: float-slow 14s -6s infinite; }
.hero-icon:nth-child(4) { bottom: 25%; right: 5%; animation: float-slow 11s -8s infinite; }
```

### Task 9: Scroll-down chevron
A bouncing chevron at the bottom of the hero:
```html
<div class="scroll-hint" aria-hidden="true">
  {{ partialCached "util/icon" (dict "key" "angle-down" "size" 24) "chevron-down" }}
</div>
```
```css
.scroll-hint {
  position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
  opacity: 0.4; animation: chevron-bounce 2s ease-in-out infinite;
  transition: opacity 0.5s;
}
@keyframes chevron-bounce { 0%,100%{transform:translateX(-50%)translateY(0)} 50%{transform:translateX(-50%)translateY(-8px)} }
```
Hidden via IntersectionObserver once scrolled past.

### Task 10: Text panel — frosted glass card
The bio text gets a subtle glass card wrapper:
```css
.meta.left-image .items .item {
  background: rgba(255,255,255,0.55);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 20px;
  border: 1px solid rgba(255,255,255,0.3);
}
```

### Task 11: Gradient emphasis on key words
JS wraps bold/emphasized text in `<span class="highlight">` — gets a soft gradient background glow:
```css
.highlight {
  background: linear-gradient(120deg, hsl(var(--h),40%,90%), hsl(var(--ha1),35%,88%));
  padding: 0 4px; border-radius: 3px;
}
```

---

## NAVIGATION (Task 12)

### Task 12: Glass header — transparent menu bar
```css
header {
  background: rgba(255,255,255,0.78) !important;
  backdrop-filter: blur(14px);
  box-shadow: 0 1px 0 rgba(0,0,0,0.06);
}
.dark header { background: rgba(22,22,26,0.88) !important; }
```

---

## SECTION-LEVEL (Tasks 13-18)

### Task 13: Alternating section backgrounds
Odd sections get white, even sections get a very subtle theme tint:
```css
body.home .meta:nth-child(even) {
  background-color: hsl(var(--h), 30%, 97%);
}
.dark body.home .meta:nth-child(even) {
  background-color: hsl(var(--h), 14%, 8%);
}
```

### Task 14: Dot-grid pattern on tinted sections
Tinted sections get a subtle dot pattern:
```css
body.home .meta:nth-child(even) {
  background-image: radial-gradient(circle, hsl(var(--h), 20%, 85%) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

### Task 15: Angled section dividers
Sections slice into each other at a diagonal:
```css
body.home .meta::before {
  content: ""; position: absolute; bottom: -1px; left: 0; right: 0; height: 50px;
  background: inherit; z-index: 2; pointer-events: none;
  transform: skewY(-2deg); transform-origin: bottom left;
}
body.home .meta:nth-child(even)::before {
  transform: skewY(2deg); transform-origin: bottom right;
}
```

### Task 16: Section heading gradient underlines
```css
body.home .meta > h1::after {
  content: ""; display: block;
  width: 60px; height: 3px; margin-top: 8px; border-radius: 2px;
  background: linear-gradient(90deg, hsl(var(--h),90%,55%), transparent);
}
```

### Task 17: Decorative floating blobs per section
Even sections get a complementary blob, odd get analogous:
```css
body.home .meta::after {
  content: ""; position: absolute; pointer-events: none; z-index: 0;
  width: 280px; height: 280px;
  background: radial-gradient(circle, hsl(var(--h),50%,85%), transparent 70%);
  opacity: 0.18; border-radius: 40% 60% 30% 70%/50% 40% 60% 50%;
  animation: blob-morph 18s infinite, float-slow 12s infinite;
}
body.home .meta:nth-child(2n)::after {
  background: radial-gradient(circle, hsl(var(--hc),50%,82%), transparent 70%);
}
```

### Task 18: Mix-blend-mode section headlines
Select section titles blend with their background for a magazine feel:
```css
.meta:nth-child(4) h1,
.meta:nth-child(6) h1,
.meta:nth-child(9) h1 {
  mix-blend-mode: multiply;
  color: hsl(var(--h), 60%, 40%);
  background: hsl(var(--h), 50%, 85%);
  display: inline-block; padding: 4px 16px; border-radius: 6px;
}
```

---

## CARDS & INTERACTION (Tasks 19-24)

### Task 19: Blog post cards — rounded, shadowed, lifting
```css
.blog-post {
  border-radius: 12px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.blog-post:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.10); }
```

### Task 20: Filter pills — gradient active state
```css
.meta.filter .filter.button {
  appearance: none; padding: 6px 18px; border-radius: 999px; border: none;
  background: rgba(var(--text-color-rgb), 0.06); cursor: pointer;
  transition: all 0.2s; font-size: 0.85rem;
}
.meta.filter .filter.button:checked {
  background: linear-gradient(135deg, hsl(var(--h),90%,55%), hsl(var(--ha1),85%,48%));
  color: #fff;
}
```

### Task 21: Gradient link underlines
```css
a:not([class]):not(.button-small):not(.page-link) {
  text-decoration: none;
  background: linear-gradient(90deg, hsl(var(--h),90%,55%), hsl(var(--ha1),80%,50%));
  background-size: 0% 1.5px; background-position: 0 100%; background-repeat: no-repeat;
  transition: background-size 0.3s;
}
a:not([class]):hover { background-size: 100% 1.5px; }
```

### Task 22: Corner ribbon bookmarks on feature cards
Patents, Publications, Projects get a bookmark triangle:
```css
.meta.full-width .item::before,
.meta.filter .item:nth-child(3n+1)::before {
  content: ""; position: absolute; top: 0; right: 0;
  border: 16px solid transparent;
  border-top-color: hsl(var(--hc), 70%, 50%);
  border-right-color: hsl(var(--hc), 70%, 50%);
  border-radius: 0 14px 0 0;
}
```

### Task 23: Experience timeline — vertical gradient line
```css
body.home .meta.default .item {
  position: relative; padding-left: 30px;
}
body.home .meta.default .item::before {
  content: ""; position: absolute; left: 12px; top: 0; bottom: 0; width: 2px;
  background: linear-gradient(to bottom, hsl(var(--h),70%,60%), hsl(var(--ha1),70%,55%));
  border-radius: 1px;
}
```

### Task 24: Testimonial avatars — blob morphing
```css
.meta.carousel .item-cover {
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  animation: blob-morph 25s ease-in-out infinite;
}
```

---

## TEXT & TYPOGRAPHY (Tasks 25-30)

### Task 25: Gradient dropcap — already have NouveauDropCaps font, enhance with gradient
```css
.post main > p:first-of-type:first-letter {
  color: transparent;
  background: linear-gradient(135deg, hsl(var(--h),90%,50%), hsl(var(--ha1),80%,48%));
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Task 26: Blockquotes — colored edge + glass panel
```css
.post blockquote {
  border-left: 4px solid hsl(var(--h), 80%, 55%);
  padding: 16px 20px;
  background: rgba(var(--theme-color-rgb), 0.04);
  border-radius: 0 10px 10px 0;
}
```

### Task 27: Code blocks — colored left accent
```css
.post .highlight {
  border-left: 3px solid hsl(var(--h), 70%, 55%);
  border-radius: 0 6px 6px 0;
}
```

### Task 28: Table rows — theme-tinted stripes
```css
.post table tr:nth-child(even) { background: rgba(var(--theme-color-rgb), 0.04); }
.post table thead { background: rgba(var(--theme-color-rgb), 0.12); }
.post table tr:hover { background: rgba(var(--theme-color-rgb), 0.10); }
```

### Task 29: Blog sidebar — soft panel
```css
.post aside {
  border-radius: 14px;
  background: rgba(var(--theme-color-rgb), 0.03);
  padding: 20px;
  border: 1px solid rgba(var(--theme-color-rgb), 0.06);
}
```

### Task 30: Footer — colored top accent
```css
footer { border-top: 3px solid hsl(var(--h), 80%, 55%); }
```

---

## POLISH & MOMENTS (Tasks 31-36)

### Task 31: Scroll progress bar — gradient fill
```css
#scroll-indicator {
  background: linear-gradient(90deg,
    hsl(var(--h),90%,55%),
    hsl(var(--ha1),85%,50%),
    hsl(var(--ht1),80%,55%));
}
```

### Task 32: Selection color — soft theme tint
```css
::selection {
  background: rgba(var(--theme-color-rgb), 0.18);
  color: inherit;
}
```

### Task 33: Input focus — colored glow ring
```css
input:focus, textarea:focus {
  border-color: hsl(var(--h), 80%, 55%);
  box-shadow: 0 0 0 3px rgba(var(--theme-color-rgb), 0.15);
  outline: none;
}
```

### Task 34: Pagination — gradient pills
```css
.pagination .page-link { border-radius: 999px; }
.pagination .active .page-link,
.pagination .page-link:hover {
  background: linear-gradient(135deg, hsl(var(--h),90%,55%), hsl(var(--ha1),85%,48%));
  color: #fff;
}
```

### Task 35: Contact CTA — gradient button
```css
.meta.centered .content a {
  display: inline-block; padding: 12px 28px; border-radius: 999px;
  background: linear-gradient(135deg, hsl(var(--h),90%,55%), hsl(var(--ha1),85%,48%));
  color: #fff; transition: transform 0.2s, box-shadow 0.2s;
}
.meta.centered .content a:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px hsla(var(--h), 80%, 55%, 0.3);
}
```

### Task 36: Hugo GoAT diagrams for experience timeline
Replace text-based timeline with a visual GoAT diagram rendered by Hugo:
```markdown
{{</* goat */>}}
  .--------.     .--------.     .--------.
  | 2012   |---->| 2015   |---->| 2020   |
  | CC Libs|     | Adobe  |     | CCX    |
  '--------'     | Shape  |     '--------'
                 '--------'
{{</* /goat */>}}
```
For the experience or timeline sections. Hugo renders it as SVG inline.

---

## IMPLEMENTATION ORDER

Build foundation first, then hero, then propagate:

| Order | Task | What | Where |
|-------|------|------|-------|
| 1 | HSL system | JS color math | main.js |
| 2 | Glass header | Blurry transparent nav | header.scss |
| 3 | Full hero | 100dvh about section | meta.scss |
| 4 | Hero mesh bg | Animated gradient ellipses | meta.scss |
| 5 | Blob portrait | Morphing border-radius | meta.scss |
| 6 | Gradient name | Animated text gradient | meta.scss |
| 7 | Typewriter | Animated subtitle | main.js + meta.scss |
| 8 | SVG decor | Floating developer SVG | meta.html + meta.scss |
| 9 | Icon constellation | Scattered floating icons | meta.html + meta.scss |
| 10 | Text glass panel | Frosted bio card | meta.scss |
| 11 | Scroll chevron | Bouncing arrow | meta.html + meta.scss |
| 12 | Keyword glow | Gradient background spans | main.js + scss |
| 13 | Alternating bg | Tinted even sections | meta.scss |
| 14 | Dot-grid pattern | Subtle dots on tints | meta.scss |
| 15 | Swoop dividers | Skewed section edges | meta.scss |
| 16 | Heading underlines | Gradient bars | meta.scss |
| 17 | Floating blobs | Decorative per section | meta.scss |
| 18 | Blend-mode heads | Mix-blend-mode titles | meta.scss |
| 19 | Blog card lift | Shadow + translate | list.scss |
| 20 | Filter pills | Gradient active | meta.scss |
| 21 | Gradient links | Animated underline | global.scss |
| 22 | Corner ribbons | Bookmark triangles | meta.scss |
| 23 | Timeline line | Vertical gradient | meta.scss |
| 24 | Testimonial blob | Blob avatars | meta.scss |
| 25 | Gradient dropcap | Duotone first letter | post.scss |
| 26 | Blockquotes | Colored edge + glass | post.scss |
| 27 | Code edge | Colored border | post.scss |
| 28 | Table stripes | Theme-tinted rows | post.scss |
| 29 | Blog sidebar | Soft panel | post.scss |
| 30 | Footer accent | Colored top edge | footer.scss |
| 31 | Scroll bar | Gradient fill | header.scss |
| 32 | Selection | Soft tint | global.scss |
| 33 | Focus ring | Colored glow | global.scss |
| 34 | Pagination | Gradient pills | list.scss |
| 35 | Contact CTA | Gradient button | meta.scss |
| 36 | GoAT diagrams | Visual timeline | content YAML |

---

## DESIGN RULES

- **No font changes** — keep system fonts at 14px
- **No layout breaks** — existing grids and breakpoints stay
- **Colors through HSL** — all derived from single theme color
- **Animation budget**: 4 keyframes max (blob-morph, float-slow, mesh-breathe, chevron-bounce)
- **Opacity floor**: decorative elements never exceed 0.20 opacity
- **Performance**: `pointer-events: none` on all decoration, `will-change` only where needed
- **Dark mode**: all rules get `.dark` variants
- **Reduced motion**: `@media (prefers-reduced-motion)` kills all animations
