# Deployment Guide

The blog is a static Next.js export (`dist/`) hosted on Cloudflare Pages, project `linghao-io` (see `wrangler.toml`). Its `*.pages.dev` subdomain is `blog-29f`, so preview URLs use that hostname, not the project name. Cloudflare builds and deploys straight from GitHub through its Git integration. There are no GitHub Actions workflows.

## Branches

| Branch | Deploys to | When |
| --- | --- | --- |
| `master` | Production, `linghao.io` | Every push, immediately |
| Any other branch | Preview, `<branch>.blog-29f.pages.dev` | Every push |

Every deployment also gets an immutable per-commit URL (`<hash>.blog-29f.pages.dev`), shown in the Cloudflare dashboard and as a commit status / PR check on GitHub.

Branch names are slugified for the preview hostname: lowercased, with `/` and other non-alphanumeric characters replaced by `-`. For example, `docs/foo` becomes `docs-foo.blog-29f.pages.dev`.

## Workflow

Because a push to `master` goes live right away, all changes go through a branch first:

1. Create a branch from `master`.
2. Make changes and run `npm run build` to catch type and build errors.
3. Push the branch, then review the result at its preview URL.
4. Merge into `master` (directly or via PR) to publish.

Drafts can also be committed with `draft: true` in their metadata. They are excluded from the exported build, so they aren't reachable on preview or production (see `CLAUDE.md`). To review a draft on a preview URL, make the flip to `draft: false` on the branch.

## Cloudflare settings

In the `linghao-io` Pages project, under **Settings → Builds & deployments**:

- **Production branch:** `master`
- **Preview branches:** All non-Production branches
- **Build command:** `npm run build`
- **Build output directory:** `dist`

## Manual deploys

Deploying from a local machine with Wrangler (requires `wrangler login`) bypasses the Git integration:

```bash
npm run deploy        # build + preview deploy
npm run deploy:prod   # build + production deploy (--branch=master)
```

## Troubleshooting

- **Build fails on Cloudflare:** run `npm run build` locally (or `npm run lint` for a faster first pass) and check the build log in the Cloudflare dashboard under **Deployments**.
- **No preview for a branch:** check the preview branch setting above. To rebuild, push an empty commit: `git commit --allow-empty -m "Trigger rebuild" && git push`.
