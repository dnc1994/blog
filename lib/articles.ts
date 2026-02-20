import { promises as fs } from 'fs'
import path from 'path'

export type PostWithTags = {
  slug: string
  title: string
  date: string
  tags: string[]
  section: 'posts' | 'notes' | 'misc'
  language?: string
  translationId?: string
  canonical?: boolean
  image?: string
}

// Helper function to dynamically import articles from a specific section
export async function getArticlesFromSection(
  section: 'posts' | 'notes' | 'misc'
): Promise<PostWithTags[]> {
  const articlesDir = path.join(process.cwd(), 'app', section, '_articles')
  const posts: PostWithTags[] = []

  try {
    const files = await fs.readdir(articlesDir)

    for (const file of files) {
      if (!file.endsWith('.mdx')) continue

      try {
        // Use section-specific dynamic imports with template literals
        // This helps webpack understand the import context
        let module
        if (section === 'posts') {
          module = await import(`@/app/posts/_articles/${file}`)
        } else if (section === 'notes') {
          module = await import(`@/app/notes/_articles/${file}`)
        } else if (section === 'misc') {
          module = await import(`@/app/misc/_articles/${file}`)
        }

        if (module && module.metadata) {
          posts.push({
            slug: file.replace(/\.mdx$/, ''),
            title: module.metadata.title || 'Untitled',
            date: module.metadata.date || '-',
            tags: module.metadata.tags || [],
            section,
            language: module.metadata.language,
            translationId: module.metadata.translationId,
            canonical: module.metadata.canonical,
            image: module.metadata.image,
          })
        }
      } catch (importError) {
        console.warn(`Failed to import ${section}/${file}:`, importError)
        continue
      }
    }
  } catch (error) {
    console.warn(`Failed to read directory for ${section}:`, error)
  }

  return posts
}


export async function getDedupedArticlesFromSection(
  section: 'posts' | 'notes' | 'misc'
): Promise<PostWithTags[]> {
  const allArticles = await getArticlesFromSection(section)

  const articlesByTranslationId = new Map<string, PostWithTags[]>()
  const uniqueArticles: PostWithTags[] = []

  for (const post of allArticles) {
    if (post.translationId) {
      if (!articlesByTranslationId.has(post.translationId)) {
        articlesByTranslationId.set(post.translationId, [])
      }
      articlesByTranslationId.get(post.translationId)!.push(post)
    } else {
      uniqueArticles.push(post)
    }
  }

  for (const posts of articlesByTranslationId.values()) {
    const canonicalPost = posts.find((p) => p.canonical)
    if (canonicalPost) {
      uniqueArticles.push(canonicalPost)
    } else if (posts.length > 0) {
      // Fallback to the first one if no canonical is set
      uniqueArticles.push(posts[0])
    }
  }

  return uniqueArticles
}

export async function getAllArticles(): Promise<PostWithTags[]> {
  const [posts, notes, misc] = await Promise.all([
    getArticlesFromSection('posts'),
    getArticlesFromSection('notes'),
    getArticlesFromSection('misc'),
  ]);
  return [...posts, ...notes, ...misc];
}
