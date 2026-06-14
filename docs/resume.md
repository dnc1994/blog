# Resume page

The public resume lives at `/resume` (`https://linghao.io/resume`). It is implemented as a normal Next.js App Router page, not as an MDX article, so the resume can keep a tighter print-oriented layout without entering the posts feed.

## Files

- `app/resume/source.ts` — source of truth for resume content.
  - Name, title, summary, contact info, metrics, experience, education, and skills live here as typed data.
  - Keep this file prose/data-only. Do not put layout, Tailwind classes, or rendering logic here.
- `app/resume/page.tsx` — output HTML renderer.
  - Imports `resume` from `source.ts` and turns it into semantic HTML sections.
  - Owns metadata, links, print classes, responsive layout, and visual styling.
  - Deliberately renders a standalone fixed-position Kami-style sheet so `/resume` visually matches the original generated HTML instead of inheriting the blog article frame.
- `components/navbar.tsx` — includes the `/resume` navigation entry, but the page itself visually covers the normal blog shell.

This separation is intentional: update content in `source.ts`; update the visual design in `page.tsx`.

## How to update the resume

1. Edit `app/resume/source.ts`.
   - Add or revise bullets in the `experience` array.
   - Add links by including a `links` array on the relevant bullet. The renderer linkifies exact label matches in that bullet's text.
   - Keep metrics short enough to fit the four-column row.
2. Only edit `app/resume/page.tsx` when changing the rendered HTML structure or styling.
3. Run verification:

```bash
npm run build
```

4. Preview locally if needed:

```bash
npm run dev
# open http://localhost:3000/resume
```

## Print / PDF notes

The page includes standalone print CSS so browser Print → Save as PDF should produce a compact Kami-style resume. Use A4 paper size. If a future content update makes the PDF overflow, first shorten bullets or metrics in `source.ts`; only then adjust print density in `page.tsx`.

## Content source history

The initial `/resume` content was ported from `~/Downloads/Linghao Zhang Resume 20260606.pdf` and the accompanying LaTeX source. The standalone generated HTML copy remains at `~/Downloads/Linghao Zhang Resume Kami.html`, but the blog source of truth is now `app/resume/source.ts`.
