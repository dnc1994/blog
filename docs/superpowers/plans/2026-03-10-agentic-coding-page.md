# Agentic Coding Curation Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an "Agentic Coding" curation page to the blog navbar listing bookmarked tools for agentic coding workflows.

**Architecture:** Data-driven page mirroring the projects page pattern — a `data.ts` file holds structured tool entries, `page.tsx` renders them as a lightweight list (name as link + muted description). No test suite exists in this project; skip TDD steps.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4, rurikon color palette

---

## Chunk 1: Data file and page component

### Task 1: Create data file

**Files:**
- Create: `app/agentic-coding/data.ts`

- [ ] **Step 1: Create `app/agentic-coding/data.ts`**

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

- [ ] **Step 2: Commit**

```bash
git add app/agentic-coding/data.ts
git commit -m "feat: add agentic-coding tools data"
```

---

### Task 2: Create page component

**Files:**
- Create: `app/agentic-coding/page.tsx`

- [ ] **Step 1: Create `app/agentic-coding/page.tsx`**

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
      <p className='text-rurikon-500 mb-8'>
        Tools I&apos;ve bookmarked for agentic coding workflows.
      </p>

      <ul className='divide-y divide-rurikon-border'>
        {tools.map((tool) => (
          <li key={tool.id} className='py-4 sm:py-5'>
            <div className='flex flex-wrap items-baseline gap-x-2'>
              <Link
                href={tool.url}
                target='_blank'
                rel='noopener noreferrer'
                draggable={false}
                className='font-medium text-rurikon-600 hover:text-rurikon-800 transition-colors underline decoration-rurikon-200 hover:decoration-rurikon-400 underline-offset-2'
              >
                {tool.name}
              </Link>
              <span className='text-rurikon-300'>—</span>
              <span className='text-rurikon-400'>{tool.description}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 2: Run `npm run build` and verify no errors**

```bash
cd /Users/linghao/dev/blog && npm run build
```

Expected: build succeeds, `dist/agentic-coding/index.html` generated.

- [ ] **Step 3: Commit**

```bash
git add app/agentic-coding/page.tsx
git commit -m "feat: add agentic-coding curation page"
```

---

## Chunk 2: Navbar and docs

### Task 3: Add navbar item

**Files:**
- Modify: `components/navbar.tsx`

- [ ] **Step 1: Add "Agentic Coding" item to navbar after "Projects"**

In `components/navbar.tsx`, change:
```tsx
        <Item href='/projects'>Projects</Item>
        <Item href='/gallery'>Gallery</Item>
```
to:
```tsx
        <Item href='/projects'>Projects</Item>
        <Item href='/agentic-coding'>Agentic Coding</Item>
        <Item href='/gallery'>Gallery</Item>
```

- [ ] **Step 2: Run `npm run build` and verify no errors**

```bash
cd /Users/linghao/dev/blog && npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/navbar.tsx
git commit -m "feat: add agentic-coding to navbar"
```

---

### Task 4: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Document the new page in CLAUDE.md under Architecture**

In `CLAUDE.md`, after the `### Gallery` section, add:

```markdown
### Agentic Coding

A curated list of tools bookmarked for agentic coding. Data lives in `app/agentic-coding/data.ts` as a flat array of `Tool` entries (id, name, description, url). The page at `app/agentic-coding/page.tsx` renders them as a lightweight list.
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: document agentic-coding page in CLAUDE.md"
```
