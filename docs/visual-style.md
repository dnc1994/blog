# Visual style: Memory Dump

The site's design since November 2026. It is a terminal / memory-dump aesthetic, dark by default, built around the site name *Synthesist in the Shell*. The previous minimal design (Shu Ding layout + Flexoki palette) is preserved on branch `design-v1`; see `2026-03-21-visual-style-rework.md` for its history.

Everything below lives in `app/globals.css` unless noted.

## Color

The Tailwind palette is still called `rurikon` so existing components keep working; only the values changed. Each step has a fixed *role*, and both themes define every step:

| Token | Role | Dark (default) | Light (`html.theme-light`) |
| --- | --- | --- | --- |
| `--background` | page | `#050707` | `#FFFCF0` |
| `rurikon-50` | surfaces, code blocks, row hover | `#0A1111` | `#F2F0E5` |
| `rurikon-100` | row dividers | `#142120` | `#E6E4D9` |
| `rurikon-200` | borders, chips, dashed rules | `#2A4A46` | `#B7B5AC` |
| `rurikon-300` | muted text (meta, labels) | `#6E8F89` | `#6F6E69` |
| `rurikon-400` | secondary text | `#8FB3AC` | `#575653` |
| `rurikon-500` | body text | `#B5CFC9` | `#343331` |
| `rurikon-600` | headings, titles | `#E8F4F1` | `#1C1B1A` |
| `rurikon-700`/`800` | strongest text, hover | `#F2FAF8` / `#FFFFFF` | `#100F0F` |
| `rurikon-border` | panel and frame borders | `#1C2B29` | `#DAD8CE` |
| `rurikon-accent` | links, active nav, offsets, cursor | `#3AA99F` | `#24837B` |
| `rurikon-signal` | kickers, dates on hover, warnings | `#DA702C` | `#BC5215` |
| `rurikon-ghost` | decorative only (hex bytes, noise) | `#3E5C57` | `#B7B5AC` |

Rules:

- Readable text uses 300 or above (≥ 4.5:1 on the background). `ghost` is for decoration that is also `aria-hidden`.
- On solid accent fills (active chips, primary buttons), use `text-[var(--background)]` so the label works in both themes.
- Code tokens use Flexoki colors, defined separately for each theme on `code`.

The `/dive` experience is always dark and uses literal hex values from the same palette, since it renders its own world regardless of theme.

## Type

| Utility | Font | Use |
| --- | --- | --- |
| `font-sans` | Inter Variable | article body, descriptions |
| `font-display` | Space Grotesk Variable | page titles, post titles, list titles, hero |
| `font-mono` | JetBrains Mono Variable | nav, kickers, meta, tags, tables, code, shell |

All three are self-hosted in `app/_fonts/` (Latin subsets) and loaded with `next/font/local` in `app/layout.tsx`. Chinese text falls back to the system CJK fonts.

Recurring patterns:

- **Kicker**: `font-mono text-xs tracking-[0.24em] text-rurikon-signal` uppercase line above a title (`CORE DUMP · …`, `ENTRY · date · n min read`).
- **Section label**: `$ command`-style mono label (`$ xxd ~/writing | head -8`, `$ cat featured.md`), rendered by `SectionLabel` in `components/home.tsx`.
- **Article headings**: `font-display` bold, with a mono accent `##` / `###` prefix via `before:` content in `mdx-components.tsx`.

## Layout

- Top header (`components/navbar.tsx`): pulsing dot + `LINGHAO.IO`, nav items prefixed `0x00`–`0x04`, music slot and theme toggle on the right.
- Container: `max-w-[1280px]`. `components/content-frame.tsx` gives `/` and `/posts` the full width; all other routes use a centered `max-w-[44rem]` reading column.
- Footer (`components/site-footer.tsx`): motto, `>_ shell` opener, links, decorative `exit 0`.

## Motion

- **Decode** (`components/decode.tsx`): text resolves from glyph noise (`01#$%&*+<>/\|=?@ABCDEF░▒▓`) left to right. Lists stagger rows by 70ms on load; hovering a row replays it. Real text is always in the HTML, and screen readers get it via `sr-only`.
- **Glitch** headline: `.glitch` (orange/teal chromatic text-shadow) + `.glitch-jitter` (twitch every ~4.5s).
- **Scanlines**: fixed `body::after` overlay, never intercepts clicks.
- `.cursor-blink`, `.pulse-dot` for terminal details.
- Everything is disabled or reduced under `prefers-reduced-motion`.

## Dump lists

`components/dump-list.tsx` renders article lists as a memory dump:

| Column | Shown from | Content |
| --- | --- | --- |
| OFFSET | `md` | `0x` + 6 hex digits, 0x40 per entry, oldest = `0x000000` |
| HEX | `lg` | first 10 UTF-8 bytes of the title |
| DECODED | always | the title (decode effect) |
| WRITTEN | always | `YYYY.MM.DD`, scrambles while decoding |

`/posts` adds `// YYYY` year markers and mono tag filter chips. Entries come from `toDumpEntries()` in `lib/dump.ts`.
