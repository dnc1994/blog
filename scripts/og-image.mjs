#!/usr/bin/env node
/**
 * Compress a source image into an OG-optimized JPEG and upload it to R2.
 *
 * Usage:
 *   node scripts/og-image.mjs <source-image> [r2-key]
 *
 * Examples:
 *   node scripts/og-image.mjs ~/Downloads/hero.png
 *     → uploads to blog-assets/hero-og.jpg
 *
 *   node scripts/og-image.mjs ~/Downloads/hero.png blog-assets/my-post-og
 *     → uploads to blog-assets/my-post-og.jpg
 *
 * Output: prints the `image:` metadata line ready to paste into your MDX file.
 */

import sharp from 'sharp'
import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'
import os from 'os'

// ── Config ────────────────────────────────────────────────────────────────────
const R2_BUCKET = 'linghao-io-gallery'
const R2_PUBLIC_URL = 'https://r2.linghao.io'
const JPEG_QUALITY = 82
// ─────────────────────────────────────────────────────────────────────────────

const [,, source, destKey] = process.argv

if (!source) {
  console.error('Usage: node scripts/og-image.mjs <source-image> [r2-key]')
  process.exit(1)
}

const sourcePath = source.replace(/^~/, os.homedir())
if (!fs.existsSync(sourcePath)) {
  console.error(`File not found: ${sourcePath}`)
  process.exit(1)
}

// Derive R2 key from filename if not supplied
const baseName = path.basename(sourcePath, path.extname(sourcePath))
const rawKey = destKey ?? `blog-assets/${baseName}-og`
const finalKey = rawKey.replace(/\.jpe?g$/i, '') + '.jpg'

const tmpFile = path.join(os.tmpdir(), `og-${Date.now()}.jpg`)

try {
  const info = await sharp(sourcePath)
    .jpeg({ quality: JPEG_QUALITY, progressive: true })
    .toFile(tmpFile)

  const originalSize = fs.statSync(sourcePath).size
  const kb = (info.size / 1024).toFixed(1)
  const saving = (((originalSize - info.size) / originalSize) * 100).toFixed(0)
  console.log(`Processed: JPEG, ${kb} KB (${saving}% smaller than source)`)

  // Upload via wrangler
  const wrangler = path.join(process.cwd(), 'node_modules/.bin/wrangler')
  execSync(
    `"${wrangler}" r2 object put "${R2_BUCKET}/${finalKey}" --file "${tmpFile}" --content-type "image/jpeg" --remote`,
    { stdio: 'inherit' }
  )

  const publicUrl = `${R2_PUBLIC_URL}/${finalKey}`
  console.log(`\nAdd to MDX metadata:`)
  console.log(`  image: '${publicUrl}',`)
} finally {
  fs.rmSync(tmpFile, { force: true })
}
