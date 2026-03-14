# Design: /lists Curation Hub

**Date:** 2026-03-13
**Status:** Approved

## Summary

Introduce a top-level `/lists` page as a hub for curated lists. The existing `/agentic-coding` page moves to `/lists/agentic-coding`. Future lists (e.g. games, books) can be added as independent subpages under `/lists`.

## URL Structure

| Route | File |
|---|---|
| `/lists` | `app/lists/page.tsx` |
| `/lists/agentic-coding` | `app/lists/agentic-coding/page.tsx` |

The old `app/agentic-coding/` directory is deleted entirely. No redirect is needed as the route has not been indexed.

## `/lists` Landing Page

- `metadata.title` set to `'Lists'`
- Short intro blurb (e.g. "Things I've curated.")
- No `<h1>` heading — consistent with the rest of the site
- Divided list using `divide-y divide-rurikon-border` on the `<ul>`, matching `app/agentic-coding/page.tsx` (not the posts dot-leader style)
- Each row: **list name** (linked to subpage) + inline description in muted text + item count right-aligned
- Item counts are derived by importing each subpage's data array and reading its `.length`; use singular `1 item` when count is 1, plural `N items` otherwise
- Lists are added to this page manually as new subpages are created — no dynamic discovery

## `/lists/agentic-coding` Subpage

- `← Lists` back-link at the top, directly preceding the `<p>` blurb (no `<h1>` — consistent with site style), linking to `/lists`
- `metadata.title` set to `'Agentic Coding'`
- Content and styling otherwise identical to the current `/agentic-coding` page
- Data file moves to `app/lists/agentic-coding/data.ts` (unchanged content)

## Navbar

- Entry changes from `href='/agentic-coding'` label `Tools` → `href='/lists'` label `Lists`
- Active state logic handles both exact matches (`pathname === href`) and subpages (`pathname.startsWith(href + '/')`), so no change needed

## Other Files to Update

- `CLAUDE.md` — the `### Agentic Coding` section references `app/agentic-coding/data.ts` and `app/agentic-coding/page.tsx`; update paths to `app/lists/agentic-coding/`

## Future Subpages

Each new list is a fully independent page under `app/lists/<slug>/`. There is no shared layout or wrapper — each subpage renders its own `← Lists` back-link if desired and may use any layout (e.g. image grid for games). No constraints are imposed by this design.

## Implementation Approach

Flat files (Approach A): each route is a standalone `page.tsx`. No shared `layout.tsx` for the `/lists` subtree, no `<ListPage>` wrapper component. Kept simple because subpages intentionally have heterogeneous structures.

## Out of Scope

- Redirects from `/agentic-coding` to `/lists/agentic-coding`
- Dynamic slug routing (`app/lists/[slug]/page.tsx`)
- Shared subpage layout component
