# Visual Style Rework (2026-03-21)

Reworked the blog's visual style to match [stephango.com](https://stephango.com), using the [Flexoki](https://stephango.com/flexoki) color palette as a reference. Changes were kept to `app/globals.css`, `mdx-components.tsx`, and page-level link components to make the diff easy to revert.

## Colors

Remapped all `rurikon-*` values in `@theme` from a cool blue-gray scale to Flexoki's warmer, darker equivalents. Key shifts:

- Background: `#fcfcfc` (cool white) → `#FFFCF0` (warm cream/paper)
- Body text: `rurikon-500` `#4a515b` → `#403E3C` (warmer dark gray)
- Headings: `rurikon-600` `#3b4149` → `#282726` (near-black)
- Borders/markers: lighter warm grays throughout
- Added `rurikon-accent: #24837B` — a Flexoki teal used for link hover

## Typography

- Removed custom `letter-spacing: 0.0085em` and `word-spacing: -0.04em` from body — reverted to browser defaults
- Simplified `font-feature-settings` from `cpsp, cv01, cv03, cv04, calt, ss03, liga, ordn` down to just `calt, liga`
- Body font weight: `'wght' 440` → `400`
- `text-rendering`: `geometricPrecision` → `optimizeLegibility`
- Increased font sizes: `14/15/16px` → `16/17/18px` across mobile/sm/md breakpoints
- Removed Lora serif from blockquotes, nav, and sidenotes — all now use the sans stack

## Links

Changed hover behavior across all link surfaces (MDX content, projects, lists, tags):

- Before: underline darkens from `rurikon-300` to `rurikon-600` on hover
- After: text and underline both turn teal (`rurikon-accent`) on hover

## Tags & Language Switcher

Changed tag background from `bg-white` to `bg-rurikon-50` — pure white looked wrong against the cream page background. Hover now also turns teal to match link behavior.
