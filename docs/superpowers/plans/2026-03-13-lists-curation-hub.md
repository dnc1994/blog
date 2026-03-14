# Lists Curation Hub Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the site so `/agentic-coding` becomes `/lists/agentic-coding` under a new `/lists` hub page, with a navbar entry that links to `/lists`.

**Architecture:** Flat files — each route is a standalone `page.tsx` with no shared layout. The `/lists` landing page manually lists all subpages and imports their data arrays for item counts. Each subpage is fully independent.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4, `components/navbar.tsx` for site nav.

**Note:** This project has no test suite. Skip all TDD steps. Verify by running `npm run build` after each task.

---

## Chunk 1: Move agentic-coding and create /lists hub

### Task 1: Move data file

**Files:**
- Create: `app/lists/agentic-coding/data.ts`
- Delete: `app/agentic-coding/data.ts`

- [ ] Create `app/lists/agentic-coding/data.ts` with identical content to `app/agentic-coding/data.ts`:

```ts
export interface Tool {
  id: string
  name: string
  description: string
  url: string
}

export const tools: Tool[] = [
  {
    id: 'rtk',
    name: 'rtk',
    description: 'Token-optimized CLI proxy for Claude Code — 60–90% token savings on dev operations.',
    url: 'https://github.com/rtk-ai/rtk',
  },
]
```

- [ ] Delete `app/agentic-coding/data.ts`:

```bash
rm app/agentic-coding/data.ts
```

---

### Task 2: Create /lists/agentic-coding page

**Files:**
- Create: `app/lists/agentic-coding/page.tsx`
- Delete: `app/agentic-coding/page.tsx`

- [ ] Create `app/lists/agentic-coding/page.tsx`:

```tsx
import Link from 'next/link'
import { tools } from './data'

export const metadata = {
  title: 'Agentic Coding',
  description: 'Tools I have bookmarked for agentic coding workflows.',
}

export default function AgenticCodingPage() {
  return (
    <div>
      <Link
        href='/lists'
        className='inline-block mb-6 text-sm text-rurikon-400 hover:text-rurikon-600 transition-colors'
      >
        ← Lists
      </Link>

      <p className='text-rurikon-500 mb-8'>
        Tools I&apos;ve bookmarked for agentic coding workflows.
      </p>

      <ul className='divide-y divide-rurikon-border'>
        {tools.map((tool) => (
          <li key={tool.id} className='py-4 sm:py-5'>
            <div className='min-w-0'>
              <Link
                href={tool.url}
                target='_blank'
                rel='noopener noreferrer'
                draggable={false}
                className='font-medium text-rurikon-600 hover:text-rurikon-800 transition-colors underline decoration-rurikon-200 hover:decoration-rurikon-400 underline-offset-2'
              >
                {tool.name}
              </Link>
              <p className='mt-1 text-rurikon-400'>{tool.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] Delete `app/agentic-coding/page.tsx`:

```bash
rm app/agentic-coding/page.tsx
```

- [ ] Verify the `app/agentic-coding/` directory is now empty and remove it:

```bash
rmdir app/agentic-coding
```

---

### Task 3: Create /lists landing page

**Files:**
- Create: `app/lists/page.tsx`

- [ ] Create `app/lists/page.tsx`:

```tsx
import Link from 'next/link'
import { tools } from './agentic-coding/data'

export const metadata = {
  title: 'Lists',
  description: 'Things I\'ve curated.',
}

function itemCount(n: number): string {
  return n === 1 ? '1 item' : `${n} items`
}

const lists = [
  {
    slug: 'agentic-coding',
    name: 'Agentic Coding',
    description: 'Tools for agentic coding workflows.',
    count: tools.length,
  },
]

export default function ListsPage() {
  return (
    <div>
      <p className='text-rurikon-500 mb-8'>
        Things I&apos;ve curated.
      </p>

      <ul className='divide-y divide-rurikon-border'>
        {lists.map((list) => (
          <li key={list.slug} className='py-4 sm:py-5'>
            <div className='flex items-baseline justify-between gap-4 min-w-0'>
              <div className='min-w-0'>
                <Link
                  href={`/lists/${list.slug}`}
                  draggable={false}
                  className='font-medium text-rurikon-600 hover:text-rurikon-800 transition-colors underline decoration-rurikon-200 hover:decoration-rurikon-400 underline-offset-2'
                >
                  {list.name}
                </Link>
                <span className='ml-3 text-rurikon-400 text-sm'>{list.description}</span>
              </div>
              <span className='shrink-0 text-rurikon-300 text-sm'>{itemCount(list.count)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

### Task 4: Update navbar

**Files:**
- Modify: `components/navbar.tsx`

- [ ] In `components/navbar.tsx`, change the agentic-coding entry:

Find:
```tsx
<Item href='/agentic-coding'>Tools</Item>
```

Replace with:
```tsx
<Item href='/lists'>Lists</Item>
```

---

### Task 5: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] In `CLAUDE.md`, find the `### Agentic Coding` section and update the file paths from `app/agentic-coding/` to `app/lists/agentic-coding/`. The section describes the data file and page file locations.

---

### Task 6: Build and commit

- [ ] Run the build to verify no errors:

```bash
npm run build
```

Expected: build completes without errors. Check that `/lists` and `/lists/agentic-coding` appear in the output file list (`dist/lists/index.html`, `dist/lists/agentic-coding/index.html`).

- [ ] Commit all changes (including staged deletions of the old directory):

```bash
git add app/lists/ components/navbar.tsx CLAUDE.md
git add -u app/agentic-coding/
git commit -m "feat: restructure /agentic-coding into /lists curation hub"
```
