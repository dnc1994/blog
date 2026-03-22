# Tag Consolidation

**Goal:** Reduce 44 unique tags to 10–15 meaningful categories and update all article MDX files accordingly.

**Approach:** Define a canonical tag set that maps all existing tags to a consolidated label. Update each article's `metadata.tags` in-place. No UI or filtering logic needs to change — tags are plain strings.

**Files touched:**
- `app/posts/_articles/*.mdx` — update `tags` in metadata (43 files)
- `app/misc/_articles/*.mdx` — update `tags` in metadata (4 files)

---

## Proposed Tag Taxonomy (12 tags)

Review and adjust before executing Task 2.

| New Tag | Absorbs |
|---|---|
| **Career** | Career, Leadership, Management, Mentorship, Interview |
| **Software Engineering** | Software Engineering, System Design, Infrastructure, Engineering Culture |
| **Staff+** | Staff+ _(kept — distinct enough audience)_ |
| **AI** | AI, Machine Learning, Data Science, Analytics |
| **Product** | Product, Technology |
| **Productivity** | Productivity, Tips, Tools, Tutorial |
| **Personal Growth** | Personal Growth, Growth, Learning, Reflection, Life |
| **Philosophy** | Philosophy, Musings |
| **Books** | Books, Review |
| **Writing** | Writing, Notes |
| **Life Abroad** | Study Abroad, Visa, Silicon Valley, Google, Travel |
| **Language** | Language Learning, Education |

Tags with 1 occurrence that don't fit (2025, Gaming, Steam, Science Fiction, Privacy): assign best-fit from above (e.g. Gaming/Steam/Science Fiction → drop or fold into Personal Growth / Writing).

---

## Tasks

- [x] **Task 1: Finalize tag taxonomy**
  - Review the proposed table above with the user
  - Confirm, rename, merge, or split any tags before touching files
  - Acceptance criteria: user signs off on the final tag list

- [x] **Task 2: Update all article MDX files**
  - For each article, replace `tags` array with new canonical tags from the agreed taxonomy
  - One article may carry multiple new tags where appropriate
  - Acceptance criteria: `grep -r "tags:" app/posts/_articles app/misc/_articles` shows only tags from the approved list; no old tags remain

- [x] **Task 3: Verify build**
  - Run `npm run build` to confirm no type errors introduced
  - Acceptance criteria: build exits 0
