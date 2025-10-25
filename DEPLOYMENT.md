# Deployment Guide

This document explains how to deploy the blog to Cloudflare Pages.

## 🚀 Quick Start

The blog automatically deploys via GitHub Actions when you push to:
- `main` branch → Production deployment
- `v2` branch → Preview deployment

## 📋 Initial Setup

### 1. Create a Cloudflare Pages Project

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages** → **Pages**
3. Click **Create Application** → **Pages** → **Connect to Git**
4. Select your repository: `linghao/blog`
5. Configure build settings:
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`
6. Click **Save and Deploy**

### 2. Get Cloudflare Credentials

1. Go to **My Profile** → **API Tokens**
2. Create token with **Cloudflare Pages** template or custom token with:
   - `Account.Cloudflare Pages` - Edit permission
3. Copy the API token

4. Get your Account ID:
   - Go to **Workers & Pages** → **Overview**
   - Copy **Account ID** from the right sidebar

### 3. Configure GitHub Secrets

Add these secrets to your GitHub repository:

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID

### 4. Configure Cloudflare Project

1. In Cloudflare Dashboard, go to your Pages project
2. Go to **Settings** → **General**
3. Update **Project name** to match `wrangler.toml`: `linghao-io`
4. Go to **Settings** → **Builds & deployments**
5. Set **Production branch**: `main`
6. Enable **Preview deployments**: `v2` branch

## 🔧 How It Works

### Automatic Deployment (CI/CD)

When you push to `main` or `v2`:

1. **GitHub Actions** triggers the workflow
2. **Build process** runs:
   ```bash
   npm ci                 # Install dependencies
   npm run build          # Build Next.js + generate RSS
   ```
3. **Deploy** to Cloudflare Pages:
   - `main` branch → Production at `linghao.io`
   - `v2` branch → Preview at `v2.linghao-io.pages.dev`

### Manual Deployment (Local)

Deploy directly from your machine:

```bash
# Deploy to preview
npm run deploy

# Deploy to production
npm run deploy:prod

# Or use wrangler directly
wrangler pages deploy dist
```

## 📦 What Gets Deployed

The deployment includes:

- ✅ **Static HTML/CSS/JS** - All pages and assets
- ✅ **RSS Feed** - Auto-generated at `/feed.xml`
- ✅ **Images & Fonts** - All static assets
- ✅ **Optimized Build** - Minified and tree-shaken

## 🌿 Branch Strategy

### `main` (Production)
- Production-ready code
- Deployed to: `linghao.io`
- Auto-deploys on push
- Should be stable and tested

### `v2` (Preview)
- Development and testing
- Deployed to: `v2.linghao-io.pages.dev`
- Auto-deploys on push
- Safe to experiment

### Feature Branches
- Create from `v2`
- Test locally
- Merge to `v2` for preview
- Merge to `main` for production

## 🔍 Monitoring Deployments

### In GitHub
1. Go to **Actions** tab
2. View workflow runs
3. Check build logs for errors

### In Cloudflare
1. Go to your Pages project
2. View **Deployments** tab
3. See deployment history, logs, and preview URLs

## 🐛 Troubleshooting

### Build Fails

**Check the build logs:**
```bash
# Test build locally first
npm run build

# Check for errors
npm run lint
```

**Common issues:**
- Missing dependencies: Run `npm install`
- TypeScript errors: Check `npm run lint`
- Build timeout: Optimize build process

### Deployment Fails

**Check secrets:**
- Verify `CLOUDFLARE_API_TOKEN` is valid
- Verify `CLOUDFLARE_ACCOUNT_ID` is correct

**Check project name:**
- Must match `wrangler.toml`: `linghao-io`

**Check permissions:**
- API token has Pages Edit permission
- GitHub Actions has deployment write permission

### Preview URL Not Working

**Check branch configuration:**
- `v2` branch is configured in Cloudflare
- Preview deployments are enabled

**Force rebuild:**
```bash
# Push an empty commit to trigger rebuild
git commit --allow-empty -m "Trigger rebuild"
git push
```

## 🔄 Updating Content

### Adding a New Post

1. Create MDX file in `app/posts/_articles/`
2. Add metadata:
   ```mdx
   export const metadata = {
     title: 'Post Title',
     description: 'Description',
     date: '2025.01.01',
     tags: ['Tag1', 'Tag2'],
   }
   ```
3. Commit and push to `v2` for preview
4. Merge to `main` for production

### RSS Auto-Update

RSS feed automatically regenerates on every build:
- Includes all posts, notes, and misc articles
- Sorted by date (newest first)
- Available at: `/feed.xml`

## 🎯 Best Practices

### Before Deploying
- ✅ Test locally: `npm run dev`
- ✅ Build locally: `npm run build`
- ✅ Check RSS: `npm run rss`
- ✅ Preview in `v2` branch first

### Code Quality
- Keep builds fast (<2 minutes)
- Optimize images before adding
- Test on multiple devices
- Check accessibility

### Content
- Write descriptive commit messages
- Use tags consistently
- Add dates to all articles
- Include descriptions for SEO

## 📊 Performance Tips

### Optimize Build Time
- Use `npm ci` instead of `npm install` in CI
- Enable Next.js caching
- Minimize dependencies

### Optimize Runtime
- Static export (no server needed)
- CDN distribution via Cloudflare
- Image optimization
- Font preloading

## 🔐 Security

### Protect Secrets
- Never commit API tokens
- Rotate tokens periodically
- Use GitHub environment protection for `main`

### Cloudflare Settings
- Enable **Bot Fight Mode**
- Configure **WAF rules** if needed
- Set up **Rate Limiting**

## 📚 Additional Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)

## 🆘 Support

If you encounter issues:
1. Check this guide first
2. Review GitHub Actions logs
3. Check Cloudflare deployment logs
4. Test locally: `npm run build`

---

**Last Updated**: October 2025

