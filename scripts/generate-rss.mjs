import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import RSS from 'rss'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SITE_URL = 'https://linghao.io'
const SECTIONS = ['posts']

async function generateRSS() {
  console.log('🔄 Generating RSS feed...')

  const feed = new RSS({
    title: 'Synthesist in the Shell — A blog by Linghao Zhang',
    description: 'A blog by Linghao Zhang',
    site_url: SITE_URL,
    feed_url: `${SITE_URL}/feed.xml`,
    language: 'en',
    pubDate: new Date(),
    ttl: 60,
  })

  const allArticles = []

  // Read articles from all sections
  for (const section of SECTIONS) {
    const articlesDir = path.join(__dirname, '..', 'app', section, '_articles')
    
    try {
      const files = fs.readdirSync(articlesDir)
      
      for (const file of files) {
        if (!file.endsWith('.mdx')) continue
        
        try {
          const filePath = path.join(articlesDir, file)
          const content = fs.readFileSync(filePath, 'utf-8')
          
          // Extract metadata from the file
          const metadataMatch = content.match(/export const metadata = \{([^}]+)\}/)
          if (!metadataMatch) continue
          
          // Parse the metadata
          const metadataStr = metadataMatch[0]
          const titleMatch = metadataStr.match(/title:\s*['"](.*?)['"]/s)
          const descMatch = metadataStr.match(/description:\s*['"](.*?)['"]/s)
          const dateMatch = metadataStr.match(/date:\s*['"](.*?)['"]/s)
          
          if (!titleMatch || !dateMatch) continue
          
          const title = titleMatch[1]
          const description = descMatch ? descMatch[1] : ''
          const dateStr = dateMatch[1]
          
          // Convert date format from YYYY.MM.DD to proper date
          const dateParts = dateStr.split('.')
          if (dateParts.length !== 3) continue
          
          const date = new Date(
            parseInt(dateParts[0]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[2])
          )
          
          const slug = file.replace('.mdx', '')
          const url = `${SITE_URL}/${section}/${slug}`
          
          allArticles.push({
            title,
            description,
            url,
            date,
            section,
          })
        } catch (error) {
          console.warn(`⚠️  Failed to process ${section}/${file}:`, error.message)
        }
      }
    } catch (error) {
      console.warn(`⚠️  Failed to read directory ${section}:`, error.message)
    }
  }

  // Sort articles by date, newest first
  allArticles.sort((a, b) => b.date.getTime() - a.date.getTime())

  // Add articles to feed
  for (const article of allArticles) {
    feed.item({
      title: article.title,
      description: article.description,
      url: article.url,
      guid: article.url,
      date: article.date,
      author: 'Linghao Zhang',
    })
  }

  // Generate XML
  const xml = feed.xml({ indent: true })

  // Define paths for public (dev) and dist (production)
  const publicPath = path.join(__dirname, '..', 'public', 'feed.xml')
  const distPath = path.join(__dirname, '..', 'dist', 'feed.xml')

  try {
    // Ensure directories exist
    fs.mkdirSync(path.dirname(publicPath), { recursive: true })
    fs.mkdirSync(path.dirname(distPath), { recursive: true })

    // Write to both directories
    fs.writeFileSync(publicPath, xml)
    console.log(`✅ RSS feed written to public/feed.xml (${allArticles.length} articles)`)
    
    fs.writeFileSync(distPath, xml)
    console.log(`✅ RSS feed written to dist/feed.xml`)

  } catch (error) {
    console.error('❌ Error writing RSS feed to file:', error)
    throw error
  }
  
  console.log(`📡 RSS feed URL: ${SITE_URL}/feed.xml`)
}

generateRSS().catch(error => {
  console.error('❌ Error generating RSS feed:', error)
  process.exit(1)
})
