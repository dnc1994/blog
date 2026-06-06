# Email Subscribe

**Goal:** Let readers subscribe to blog updates via email with a minimal, unobtrusive form.

**Approach:** Use [Buttondown](https://buttondown.com) as the email backend — it accepts form POSTs directly to its public API, requires no backend, and fits a static site. Add a small subscribe form component and place it at the bottom of the posts index page. Optionally add it to the bottom of article pages.

**Files touched:**
- `components/subscribe-form.tsx` — new client component: email input + submit, POSTs to Buttondown
- `app/posts/posts-client.tsx` — render `<SubscribeForm>` below the posts list
- `app/posts/[slug]/page.tsx` — optionally render `<SubscribeForm>` at end of articles

---

## Tasks

- [ ] **Task 1: Create a Buttondown account and get the username**
  - Sign up at buttondown.com, create a newsletter
  - Note the username (used in the form action URL: `https://buttondown.com/api/emails/embed-subscribe/<username>`)
  - Acceptance criteria: have a working username/endpoint ready

- [ ] **Task 2: Build `SubscribeForm` component**
  - Minimal form: one email `<input>` + submit button, styled to match the site palette (`rurikon` colors, Inter font)
  - POST to Buttondown's embed endpoint; handle success/error states inline (no page reload)
  - Use `fetch` with `application/json` body `{ email }` to `https://buttondown.com/api/emails/embed-subscribe/<username>`
  - On success: replace form with a confirmation message; on error: show inline error
  - Acceptance criteria: submitting a valid email shows confirmation; submitting invalid email shows browser/inline validation

- [ ] **Task 3: Add `<SubscribeForm>` to posts index**
  - Place it below the post list in `app/posts/posts-client.tsx`, visually separated (border-top or spacing)
  - Heading: something like "Subscribe" or "Get updates" — short, no marketing copy
  - Acceptance criteria: visible at bottom of /posts, unobtrusive, matches visual style

- [ ] **Task 4: (Optional) Add `<SubscribeForm>` to article pages**
  - Add at the bottom of `app/posts/[slug]/page.tsx` after the article content
  - Acceptance criteria: appears after each article, same styling as posts index version

- [ ] **Task 5: Verify build**
  - Run `npm run build` — no type errors, no broken imports
  - Acceptance criteria: clean build
