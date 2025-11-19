import { PostWithTags } from './articles'
import { getAllArticles } from './articles'

// Get all posts with their tags across all sections
export async function getAllPostsWithTags(): Promise<PostWithTags[]> {
  const allPosts = await getAllArticles()
  const postsByTranslationId = new Map<string, PostWithTags[]>()

  // Group posts by translationId
  allPosts.forEach(post => {
    const key = post.translationId || post.slug
    if (!postsByTranslationId.has(key)) {
      postsByTranslationId.set(key, [])
    }
    postsByTranslationId.get(key)!.push(post)
  })

  const uniquePosts: PostWithTags[] = []
  for (const group of postsByTranslationId.values()) {
    if (group.length > 1) {
      const canonicalPost = group.find(p => p.canonical)
      if (canonicalPost) {
        uniquePosts.push(canonicalPost)
      } else {
        // Fallback to the first post if no canonical is set
        uniquePosts.push(group[0])
      }
    } else {
      uniquePosts.push(group[0])
    }
  }


  // Sort by date descending
  return uniquePosts.sort((a, b) => {
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
