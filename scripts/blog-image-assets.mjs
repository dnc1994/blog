#!/usr/bin/env node
/**
 * Prepare and publish a blog post header image + OG image.
 *
 * Deterministic responsibilities only:
 *   - derive slug from the MDX filename unless --slug is supplied
 *   - crop/resize a source image into:
 *       blog-assets/<slug>.png       (wide article banner)
 *       blog-assets/<slug>-og.jpg    (1200x630 social preview)
 *   - upload both assets to Cloudflare R2 via wrangler
 *   - patch the MDX post's metadata.image and first Banner image
 *
 * Usage:
 *   node scripts/blog-image-assets.mjs <post.mdx> <source-image> [options]
 *
 * Options:
 *   --slug <slug>          Override slug / R2 basename
 *   --dry-run              Process locally and print intended changes, but do not upload or patch
 *   --no-patch             Upload/process assets but do not rewrite the MDX file
 *   --help                 Show this help
 *
 * Examples:
 *   npm run blog:image -- app/posts/_articles/software-speciation.mdx ~/Downloads/header.png --dry-run
 *   npm run blog:image -- app/posts/_articles/new-post.mdx ~/Downloads/generated.png
 */

import { spawnSync } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'
import process from 'process'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

const R2_BUCKET = 'linghao-io-gallery'
const R2_PREFIX = 'blog-assets'
const R2_PUBLIC_URL = 'https://r2.linghao.io'
const WRANGLER = path.join(ROOT, 'node_modules/.bin/wrangler')

const HEADER_WIDTH = 2752
const HEADER_HEIGHT = 1536
const OG_WIDTH = 1200
const OG_HEIGHT = 630
const JPEG_QUALITY = 82
const PNG_COMPRESSION_LEVEL = 9

function usage(exitCode = 0) {
  const script = path.relative(ROOT, fileURLToPath(import.meta.url))
  console.log(`Usage: node ${script} <post.mdx> <source-image> [options]\n\nOptions:\n  --slug <slug>          Override slug / R2 basename\n  --dry-run              Process locally and print intended changes, but do not upload or patch\n  --no-patch             Upload/process assets but do not rewrite the MDX file\n  --help                 Show this help`)
  process.exit(exitCode)
}

function parseArgs(argv) {
  const positional = []
  const opts = { dryRun: false, patch: true, slug: null }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--help' || arg === '-h') usage(0)
    if (arg === '--dry-run') {
      opts.dryRun = true
    } else if (arg === '--no-patch') {
      opts.patch = false
    } else if (arg === '--slug') {
      opts.slug = argv[++i]
      if (!opts.slug) throw new Error('--slug requires a value')
    } else if (arg.startsWith('--slug=')) {
      opts.slug = arg.slice('--slug='.length)
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`)
    } else {
      positional.push(arg)
    }
  }

  if (positional.length !== 2) usage(1)
  return { post: positional[0], source: positional[1], opts }
}

function expandHome(p) {
  return p.replace(/^~(?=$|\/)/, os.homedir())
}

function resolveFromRoot(p) {
  const expanded = expandHome(p)
  return path.isAbsolute(expanded) ? expanded : path.join(ROOT, expanded)
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function upload(localPath, key, contentType) {
  const target = `${R2_BUCKET}/${key}`
  const result = spawnSync(
    WRANGLER,
    ['r2', 'object', 'put', target, '--file', localPath, '--content-type', contentType, '--remote'],
    { cwd: ROOT, stdio: 'inherit' }
  )
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`wrangler upload failed for ${target}`)
}

function patchMdx(mdxPath, headerUrl, ogUrl) {
  const before = fs.readFileSync(mdxPath, 'utf8')
  let after = before

  if (/^(\s*image:\s*')[^']+(',$)/m.test(after)) {
    after = after.replace(/^(\s*image:\s*')[^']+(',$)/m, `$1${ogUrl}$2`)
  } else {
    after = after.replace(/(export const metadata = \{\n)/, `$1  image: '${ogUrl}',\n`)
  }

  if (/^!\[Banner\]\([^)]*\)\s*$/m.test(after)) {
    after = after.replace(/^!\[Banner\]\([^)]*\)\s*$/m, `![Banner](${headerUrl})`)
  } else {
    const metadataEnd = after.match(/^\}\s*$/m)
    if (!metadataEnd) throw new Error('Could not find end of metadata block to insert Banner image')
    const insertAt = metadataEnd.index + metadataEnd[0].length
    after = `${after.slice(0, insertAt)}\n\n![Banner](${headerUrl})${after.slice(insertAt)}`
  }

  if (after === before) {
    console.log('MDX already up to date')
    return false
  }

  fs.writeFileSync(mdxPath, after)
  return true
}

async function main() {
  const { post, source, opts } = parseArgs(process.argv.slice(2))
  const mdxPath = resolveFromRoot(post)
  const sourcePath = resolveFromRoot(source)

  if (!fs.existsSync(mdxPath)) throw new Error(`Post not found: ${mdxPath}`)
  if (!fs.existsSync(sourcePath)) throw new Error(`Source image not found: ${sourcePath}`)
  if (!opts.dryRun && !fs.existsSync(WRANGLER)) {
    throw new Error(`wrangler not found at ${WRANGLER}; run npm install first`)
  }

  const slug = slugify(opts.slug ?? path.basename(mdxPath))
  if (!slug) throw new Error('Could not derive slug')

  const headerKey = `${R2_PREFIX}/${slug}.png`
  const ogKey = `${R2_PREFIX}/${slug}-og.jpg`
  const headerUrl = `${R2_PUBLIC_URL}/${headerKey}`
  const ogUrl = `${R2_PUBLIC_URL}/${ogKey}`

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-image-assets-'))
  const headerFile = path.join(tmpDir, `${slug}.png`)
  const ogFile = path.join(tmpDir, `${slug}-og.jpg`)

  try {
    const input = sharp(sourcePath).rotate()
    const meta = await input.metadata()

    await sharp(sourcePath)
      .rotate()
      .resize({
        width: HEADER_WIDTH,
        height: HEADER_HEIGHT,
        fit: 'cover',
        position: sharp.strategy.attention,
        withoutEnlargement: true,
      })
      .png({ compressionLevel: PNG_COMPRESSION_LEVEL })
      .toFile(headerFile)

    await sharp(sourcePath)
      .rotate()
      .resize({
        width: OG_WIDTH,
        height: OG_HEIGHT,
        fit: 'cover',
        position: sharp.strategy.attention,
      })
      .jpeg({ quality: JPEG_QUALITY, progressive: true })
      .toFile(ogFile)

    const headerStats = fs.statSync(headerFile)
    const ogStats = fs.statSync(ogFile)

    console.log(`Source: ${sourcePath}`)
    console.log(`Post:   ${path.relative(ROOT, mdxPath)}`)
    console.log(`Slug:   ${slug}`)
    console.log(`Input:  ${meta.width}x${meta.height} ${meta.format}`)
    console.log(`Header: ${headerKey} (${(headerStats.size / 1024).toFixed(1)} KB)`)
    console.log(`OG:     ${ogKey} (${(ogStats.size / 1024).toFixed(1)} KB, ${OG_WIDTH}x${OG_HEIGHT})`)
    console.log(`Header URL: ${headerUrl}`)
    console.log(`OG URL:     ${ogUrl}`)

    if (opts.dryRun) {
      console.log('\nDry run: skipped R2 upload and MDX patch.')
      console.log(`Temporary files kept at: ${tmpDir}`)
      return
    }

    upload(headerFile, headerKey, 'image/png')
    upload(ogFile, ogKey, 'image/jpeg')

    if (opts.patch) {
      const changed = patchMdx(mdxPath, headerUrl, ogUrl)
      console.log(changed ? 'Patched MDX.' : 'No MDX patch needed.')
    } else {
      console.log('Skipped MDX patch due to --no-patch.')
    }
  } finally {
    if (!opts.dryRun) fs.rmSync(tmpDir, { recursive: true, force: true })
  }
}

main().catch((err) => {
  console.error(`Error: ${err.message}`)
  process.exit(1)
})
