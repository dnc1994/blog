import { promises as fs } from 'fs'
import path from 'path'

export type PostWithTags = {
  slug: string
  title: string
  date: string
  tags: string[]
  section: 'posts' | 'notes' | 'misc'
}

// Helper function to dynamically import articles from a specific section
async function getArticlesFromSection(
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

// Get all posts with their tags across all sections
export async function getAllPostsWithTags(): Promise<PostWithTags[]> {
  const [posts, notes, misc] = await Promise.all([
    getArticlesFromSection('posts'),
    getArticlesFromSection('notes'),
    getArticlesFromSection('misc'),
  ])

  const allPosts = [...posts, ...notes, ...misc]

  // Sort by date descending
  return allPosts.sort((a, b) => {
    const dateA = Number(a.date.replaceAll('.', '') || 0)
    const dateB = Number(b.date.replaceAll('.', '') || 0)
    return dateB - dateA
  })
}

// Get all unique tags with their counts
export async function getAllTags(): Promise<Map<string, number>> {
  const posts = await getAllPostsWithTags()
  const tagCounts = new Map<string, number>()

  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    })
  })

  // Sort tags alphabetically
  return new Map([...tagCounts.entries()].sort((a, b) => a[0].localeCompare(b[0])))
}

