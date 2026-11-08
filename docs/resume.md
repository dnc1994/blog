# Resume page

There are two renderings of one resume, both generated from `app/resume/source.ts`:

- the public web page at `/resume` (`https://linghao.io/resume`), and
- the recruiter PDF, built from `resume-pdf/main.tex` (in Overleaf or locally).

The web page It is implemented as a normal Next.js App Router page, not as an MDX article, so the resume can keep a tighter print-oriented layout without entering the posts feed.

## Files

- `app/resume/source.ts` — source of truth for resume content.
  - Name, title, summary, contact info, metrics, experience, education, and skills live here as typed data.
  - Keep this file prose/data-only. Do not put layout, Tailwind classes, or rendering logic here.
- `app/resume/page.tsx` — output HTML renderer.
  - Imports `resume` from `source.ts` and turns it into semantic HTML sections.
  - Owns metadata, links, print classes, responsive layout, and visual styling.
  - Deliberately renders a standalone fixed-position Kami-style sheet so `/resume` visually matches the original generated HTML instead of inheriting the blog article frame.
- `app/resume/variants.ts` — resolves per-audience variants (see below). Used by both renderers.
- `resume-pdf/template.tex` + `resume-pdf/style.cls` — hand-edited LaTeX layout for the PDF.
- `resume-pdf/main.tex` — **generated** by `npm run resume:tex`; never edit it by hand. Committed so Overleaf can pull it.
- `scripts/resume-latex.mjs` — the generator (`--pdf` to compile locally, `--check` to detect a stale `main.tex`).
- `components/navbar.tsx` — includes the `/resume` navigation entry, but the page itself visually covers the normal blog shell.

This separation is intentional: update content in `source.ts`; update the visual design in `page.tsx`.

## Web vs PDF variants

All fields are shared by default. Any item (the top-level object, an experience entry, a bullet, an education entry, a skill row) can diverge per audience:

```ts
{
  lead: 'Next-Gen Memory',
  text: 'Shared wording used by both versions.',
  pdf: { text: 'PDF-only wording.' },   // merged over the shared fields in the PDF
  // web: { ... }                       // same, for the web page
  // pdf: false / web: false            // hide the item in that version
}
```

PDF-only strings may use `**bold**` and `*italic*`. Links listed in `links` are applied to both `lead` and `text` in the PDF. Characters like `&`, `%`, `$`, `~`, `×`, curly quotes and `C++` are converted to LaTeX automatically.

To converge the two versions, delete the `pdf:` override and the shared text is used everywhere.

## How to update the resume

1. Edit `app/resume/source.ts`.
   - Add or revise bullets in the `experience` array.
   - Add links by including a `links` array on the relevant bullet. The renderer linkifies exact label matches in that bullet's text.
   - Keep metrics short enough to fit the four-column row.
2. Only edit `app/resume/page.tsx` when changing the rendered HTML structure or styling.
3. Regenerate the LaTeX and verify:

```bash
npm run resume:tex          # writes resume-pdf/main.tex
npm run resume:tex -- --pdf # optional: also compiles resume-pdf/main.pdf (needs TeX Live)
npm run build
```

4. Get the PDF: upload `resume-pdf/main.tex` (and `style.cls` the first time) to Overleaf, or link the Overleaf project to this repo via Overleaf's GitHub integration, or just use the locally compiled `main.pdf`.

5. Preview locally if needed:

```bash
npm run dev
# open http://localhost:3000/resume
```

## Print / PDF notes

The recruiter PDF comes from `resume-pdf/`, not from printing the page. The page also includes standalone print CSS so browser Print → Save as PDF should produce a compact Kami-style resume. Use A4 paper size. If a future content update makes the PDF overflow, first shorten bullets or metrics in `source.ts`; only then adjust print density in `page.tsx`.

## Content source history

The initial `/resume` content was ported from `~/Downloads/Linghao Zhang Resume 20260606.pdf` and the accompanying LaTeX source. The standalone generated HTML copy remains at `~/Downloads/Linghao Zhang Resume Kami.html`, but the blog source of truth is now `app/resume/source.ts`.
