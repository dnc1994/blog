import { getDedupedArticlesFromSection } from '@/lib/articles'
import { toDumpEntries } from '@/lib/dump'
import { projects } from '@/app/projects/data'
import { Terminal } from './terminal'

// Server wrapper: hands the shell a compact index of posts and projects.
export default async function ShellMount() {
  const entries = toDumpEntries(await getDedupedArticlesFromSection('posts'))
  const posts = entries.map((e, i) => ({
    n: i + 1,
    slug: e.slug,
    title: e.title,
    date: e.date,
    tags: e.tags,
  }))
  const projectIndex = projects.map((p) => ({ name: p.name, url: p.repoUrl }))
  return <Terminal posts={posts} projects={projectIndex} />
}
