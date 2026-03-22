# Visual Style

The blog's visual style is inspired by [stephango.com](https://stephango.com) and the [Flexoki](https://stephango.com/flexoki) color palette.

## Colors

The custom `rurikon` palette (defined in `app/globals.css` under `@theme`) is mapped to Flexoki values:

| Token | Value | Usage |
|---|---|---|
| `rurikon-50` | `#F2F0E5` | Code block bg, tag bg |
| `rurikon-200` | `#B7B5AC` | List markers, borders |
| `rurikon-300` | `#878580` | Link underline (default), muted UI |
| `rurikon-400` | `#6F6E69` | Secondary text, labels |
| `rurikon-500` | `#403E3C` | Body text |
| `rurikon-600` | `#282726` | Headings, strong text |
| `rurikon-800` | `#100F0F` | Near-black (active states) |
| `rurikon-accent` | `#24837B` | Link hover (teal) |
| `rurikon-border` | `#B7B5ACb3` | Dividers, borders |

Background (`--background`): `#FFFCF0` — warm cream/paper tone.

## Typography

- **Body font**: Inter Variable (`--sans`), loaded locally via `next/font/local`
- **Code font**: Iosevka Fixed Curly (`--mono`)
- **Serif font**: Lora Italic (`--serif`) — loaded but not actively applied to any element; available for future use
- **Font features**: `calt`, `liga` only (simplified from previous OpenType-heavy config)
- **Font sizes**: `16px` (mobile) → `17px` (sm) → `18px` (md+)
- **Line height**: `leading-7` (28px) at all breakpoints
- **No custom letter-spacing or word-spacing** — browser defaults used throughout

Blockquotes, nav, and sidenotes all use the sans-serif stack (same as body).

## Links

- Default: same color as surrounding text, underlined with `rurikon-300`
- Hover: text and underline both turn `rurikon-accent` (#24837B teal)

This applies consistently across blog post content (`mdx-components.tsx`), the projects page, lists pages, and tag components.

## Tags & UI Chips

Tags use `bg-rurikon-50` (warm tint matching the page background) with `border-rurikon-200`. Hover turns border and text teal. Active/selected state uses `bg-rurikon-800 text-white`.
