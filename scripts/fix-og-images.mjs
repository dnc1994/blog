#!/usr/bin/env node
/**
 * One-off script: compress existing post OG images and update MDX metadata.
 *
 * For each entry:
 *   1. Downloads the original image from R2
 *   2. Resizes/compresses to 1200×630 JPEG
 *   3. Uploads the result back to R2 as a new key
 *   4. Rewrites the `image:` line in the MDX file
 *
 * Run: node scripts/fix-og-images.mjs
 */

import sharp from 'sharp'
import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'
import os from 'os'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

const R2_BUCKET = 'linghao-io-gallery'
const R2_PUBLIC_URL = 'https://r2.linghao.io'
const JPEG_QUALITY = 82
const WRANGLER = path.join(ROOT, 'node_modules/.bin/wrangler')

const POSTS = [
  {
    mdx: 'app/posts/_articles/ai-memory-negative-space.mdx',
    sourceUrl: 'https://r2.linghao.io/blog-assets/ai-memory-negative-space-header.png',
    destKey: 'blog-assets/ai-memory-negative-space-og.jpg',
  },
  {
    mdx: 'app/posts/_articles/bespoke-flywheel.mdx',
    sourceUrl: 'https://r2.linghao.io/blog-assets/bespoke-flywheel.png',
    destKey: 'blog-assets/bespoke-flywheel-og.jpg',
  },
  {
    mdx: 'app/posts/_articles/software-speciation.mdx',
    sourceUrl: 'https://r2.linghao.io/blog-assets/software-speciation.png',
    destKey: 'blog-assets/software-speciation-og.jpg',
  },
]

for (const { mdx, sourceUrl, destKey } of POSTS) {
  const label = path.basename(mdx)
  console.log(`\n── ${label}`)

  const tmpFile = path.join(os.tmpdir(), `og-fix-${Date.now()}.jpg`)

  try {
    // 1. Download
    console.log(`  Downloading ${sourceUrl} ...`)
    const res = await fetch(sourceUrl)
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${sourceUrl}`)
    const buffer = Buffer.from(await res.arrayBuffer())
    const originalKB = (buffer.length / 1024).toFixed(1)

    // 2. Compress
    const info = await sharp(buffer)
      .jpeg({ quality: JPEG_QUALITY, progressive: true })
      .toFile(tmpFile)

    const newKB = (info.size / 1024).toFixed(1)
    const saving = (((buffer.length - info.size) / buffer.length) * 100).toFixed(0)
    console.log(`  Compressed: ${originalKB} KB → ${newKB} KB (${saving}% smaller)`)

    // 3. Upload
    console.log(`  Uploading to ${R2_BUCKET}/${destKey} ...`)
    execSync(
      `"${WRANGLER}" r2 object put "${R2_BUCKET}/${destKey}" --file "${tmpFile}" --content-type "image/jpeg" --remote`,
      { stdio: 'inherit' }
    )

    // 4. Rewrite MDX
    const mdxPath = path.join(ROOT, mdx)
    const before = fs.readFileSync(mdxPath, 'utf-8')
    const publicUrl = `${R2_PUBLIC_URL}/${destKey}`
    const after = before.replace(
      /^(\s*image:\s*')[^']+(',$)/m,
      `$1${publicUrl}$2`
    )
    if (before === after) {
      console.warn(`  WARNING: image: line not updated in ${mdx} — check regex`)
    } else {
      fs.writeFileSync(mdxPath, after)
      console.log(`  Updated MDX → image: '${publicUrl}'`)
    }
  } finally {
    fs.rmSync(tmpFile, { force: true })
  }
}

console.log('\nDone.')
